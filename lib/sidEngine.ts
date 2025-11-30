import { formSteps, FormStep, FormQuestion, QuestionSubField } from "./formSteps";
import { addYears, subYears, parseISO, isValid, setMonth, setDate, setYear } from "date-fns";

// Structure d'un événement standardisé (SID)
export interface SIDEvent {
  id: string;              // ex: "evt_birth", "evt_bac_2015"
  type: string;            // ex: "BIRTH_EVENT", "ACADEMIC_PERIOD", "CAREER_MILESTONE"
  sidKey: string;          // La clé définie dans formSteps (ex: "BAC_DATE")
  label: string;           // ex: "Obtention du Bac", "Années Lycée"
  startDate: Date;
  endDate?: Date;          // Si c'est une période (ex: Lycée)
  isEstimated: boolean;    // True si calculé via équation
  metadata?: Record<string, any>; // Données brutes associées
}

/**
 * Moteur principal : Transforme les réponses brutes en Timeline structurée
 */
export function generateTimelineFromAnswers(answers: Record<string, any>): SIDEvent[] {
  const events: SIDEvent[] = [];

  // 1. Extraction des événements explicites (ceux taggués 'sidEvent' dans le form)
  const explicitEvents = extractExplicitEvents(answers);
  events.push(...explicitEvents);

  // 2. Calcul des événements déduits (Les équations temporelles)
  const inferredEvents = calculateInferredPeriods(answers, explicitEvents);
  events.push(...inferredEvents);

  // 3. Tri chronologique
  return events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}

/**
 * Phase 1 : Extraction directe depuis le formulaire
 */
function extractExplicitEvents(answers: Record<string, any>): SIDEvent[] {
  const events: SIDEvent[] = [];

  // Fonction récursive pour parcourir les questions et sous-questions
  const processQuestion = (q: FormQuestion | QuestionSubField) => {
    // Si la question a un tag SID et une réponse
    if (q.sidEvent && answers[q.id]) {
      const value = answers[q.id];
      let date: Date | null = null;

      // Normalisation de la date selon le type
      if (q.type === 'date') {
        date = new Date(value);
      } else if (q.type === 'number' && parseInt(value) > 1900) {
        // Si c'est une année (ex: 2015), on fixe arbitrairement au 1er Juillet (fin année scolaire) ou 1er Janvier
        // Pour un diplôme -> Juillet. Pour une naissance -> Janvier ? 
        // On va standardiser à Juin/Juillet pour les événements scolaires si le SID contient "BAC" ou "DEGREE"
        if (q.sidEvent.includes("BAC") || q.sidEvent.includes("STUDIES")) {
            date = new Date(parseInt(value), 6, 1); // 1er Juillet
        } else {
            date = new Date(parseInt(value), 0, 1); // 1er Janvier
        }
      }

      if (date && isValid(date)) {
        events.push({
          id: `sid_${q.id}`,
          type: "POINT_IN_TIME", // Par défaut, c'est un point. Les périodes sont calculées après.
          sidKey: q.sidEvent,
          label: q.label,
          startDate: date,
          isEstimated: q.type === 'number', // Si c'est juste une année, c'est estimé
          metadata: { rawValue: value }
        });
      }
    }

    // Récursion sur les sous-questions
    if ('subQuestions' in q && q.subQuestions) {
      q.subQuestions.forEach(processQuestion);
    }
  };

  formSteps.forEach(step => {
    step.questions.forEach(processQuestion);
  });

  return events;
}

/**
 * Phase 2 : Les Équations Temporelles
 * C'est ici qu'on applique la logique métier pour créer des périodes.
 */
function calculateInferredPeriods(answers: Record<string, any>, explicitEvents: SIDEvent[]): SIDEvent[] {
  const periods: SIDEvent[] = [];

  // Helper pour trouver une date par clé SID
  const getDateBySID = (sidKey: string): Date | undefined => {
    return explicitEvents.find(e => e.sidKey === sidKey)?.startDate;
  };

  // --- ÉQUATION 1 : Le Lycée (Durée 3 ans) ---
  // Si on a la date du Bac, on déduit les années Lycée
  const bacDate = getDateBySID("BAC_DATE");
  if (bacDate) {
    const lyceeStart = subYears(bacDate, 3);
    // On recale à Septembre de l'année de début
    const academicStart = setDate(setMonth(lyceeStart, 8), 1); // 1er Septembre

    periods.push({
      id: "inf_lycee",
      type: "PERIOD",
      sidKey: "PERIOD_LYCEE",
      label: "Années Lycée",
      startDate: academicStart,
      endDate: bacDate,
      isEstimated: true,
      metadata: { source: "Calculé depuis date Bac" }
    });
  }

  // --- ÉQUATION 2 : Les Études Supérieures ---
  // Si on a la fin des études ET le niveau (Bac+X)
  const studiesEnd = getDateBySID("STUDIES_END");
  const degreeLevel = answers["degreeLevel"]; // bachelor (3), master (5), bts (2), phd (8)

  if (studiesEnd && degreeLevel) {
    let duration = 0;
    switch(degreeLevel) {
        case "bts": duration = 2; break;
        case "bachelor": duration = 3; break;
        case "master": duration = 5; break;
        case "phd": duration = 8; break;
        default: duration = 3;
    }

    // Si on a aussi le Bac, le début des études SUP est l'année du Bac (ou l'année d'après)
    // Sinon on recule depuis la fin
    let startSup = subYears(studiesEnd, duration);
    
    // Raffinement : Si BacDate existe, StartSup doit être >= BacDate
    if (bacDate && startSup < bacDate) {
        startSup = bacDate; // On aligne
    }
    
    const academicStart = setDate(setMonth(startSup, 8), 1); // 1er Septembre

    periods.push({
      id: "inf_higher_ed",
      type: "PERIOD",
      sidKey: "PERIOD_HIGHER_ED",
      label: "Études Supérieures",
      startDate: academicStart,
      endDate: studiesEnd,
      isEstimated: true,
      metadata: { level: degreeLevel }
    });
  }

  // --- ÉQUATION 3 : Vie Active (Premier Job -> Aujourd'hui) ---
  const firstJobDate = getDateBySID("FIRST_PAYCHECK"); // ou FIRST_JOB_START
  if (firstJobDate) {
    periods.push({
        id: "inf_active_life",
        type: "PERIOD",
        sidKey: "PERIOD_CAREER",
        label: "Vie Active",
        startDate: firstJobDate,
        endDate: new Date(), // Jusqu'à aujourd'hui
        isEstimated: false
    });
  }

  // --- ÉQUATION 4 : Enfance (Naissance -> 11 ans/Collège) ---
  const birthDate = getDateBySID("BIRTH_DATE");
  if (birthDate) {
      const childhoodEnd = addYears(birthDate, 11); // Fin primaire approx
      periods.push({
          id: "inf_childhood",
          type: "PERIOD",
          sidKey: "PERIOD_CHILDHOOD",
          label: "Enfance",
          startDate: birthDate,
          endDate: childhoodEnd,
          isEstimated: true
      });
  }

  return periods;
}
