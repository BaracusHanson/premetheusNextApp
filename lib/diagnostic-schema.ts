export type DiagnosticItemType = 'text' | 'date' | 'boolean' | 'select';

export interface DiagnosticItemDef {
  id: string; // Field name in DB
  label: string;
  type: DiagnosticItemType;
  stepId: string; // Which bucket to save this in
  options?: { label: string; value: string }[];
  requiresDate?: boolean; // If true, asking for a date alongside the value (for bool/select)
  placeholder?: string;
}

export interface DiagnosticSectionDef {
  id: string;
  title: string;
  description: string;
  items: DiagnosticItemDef[];
}

export const DIAGNOSTIC_SCHEMA: DiagnosticSectionDef[] = [
  {
    id: 'identity',
    title: 'Identité & Origines',
    description: 'Les fondations de votre histoire.',
    items: [
      { id: 'birthCountry', label: 'Pays de naissance', type: 'text', stepId: 'general', placeholder: 'Ex: France' },
      { id: 'birthCity', label: 'Ville de naissance', type: 'text', stepId: 'general', placeholder: 'Ex: Paris' },
      { id: 'birthDate', label: 'Date de naissance', type: 'date', stepId: 'general' },
      { id: 'familyOrigins', label: 'Origines familiales (Pays, Régions)', type: 'text', stepId: 'general', placeholder: 'Ex: Italie (Sicile), Bretagne...' },
      { id: 'languages', label: 'Langues parlées en famille', type: 'text', stepId: 'general', placeholder: 'Ex: Français, Italien, Arabe...' },
      { id: 'currentCity', label: 'Ville actuelle', type: 'text', stepId: 'general', placeholder: 'Ex: Lyon' },
      { id: 'moveCount', label: 'Nombre de déménagements', type: 'text', stepId: 'general', placeholder: 'Ex: 5' }, // Cast to number in logic if needed
      { id: 'arrivalDate', label: 'Date d\'arrivée en France (si né ailleurs)', type: 'date', stepId: 'general' }
    ]
  },
  {
    id: 'childhood',
    title: 'Enfance',
    description: 'Vos premières années.',
    items: [
      { id: 'primarySchoolMemory', label: 'Souvenir d\'école primaire', type: 'text', stepId: 'childhood', placeholder: 'Nom de l\'école ou souvenir marquant' }
    ]
  },
  {
    id: 'education',
    title: 'Scolarité',
    description: 'Votre parcours académique.',
    items: [
      { id: 'brevetObtained', label: 'Brevet des collèges', type: 'boolean', stepId: 'college', requiresDate: true },
      { id: 'bacObtained', label: 'Baccalauréat', type: 'boolean', stepId: 'college', requiresDate: true },
      { 
        id: 'degreeLevel', 
        label: 'Niveau d\'études supérieures', 
        type: 'select', 
        stepId: 'studies',
        requiresDate: true,
        options: [
          { label: 'Aucun', value: 'none' },
          { label: 'Bac +2 (BTS/DUT)', value: 'bts' },
          { label: 'Licence (Bac +3)', value: 'bachelor' },
          { label: 'Master (Bac +5)', value: 'master' },
          { label: 'Doctorat', value: 'phd' }
        ]
      },
      { 
        id: 'studyDomain', 
        label: 'Domaine d\'études', 
        type: 'select', 
        stepId: 'studies',
        options: [
            { label: 'Sciences & Tech', value: 'science_tech' },
            { label: 'Lettres & Sciences Humaines', value: 'humanities' },
            { label: 'Économie & Gestion', value: 'business' },
            { label: 'Arts & Design', value: 'arts' },
            { label: 'Santé', value: 'health' },
            { label: 'Droit', value: 'law' },
            { label: 'Autre', value: 'other' }
        ]
      },
      { id: 'degreeDetails', label: 'Intitulé du diplôme', type: 'text', stepId: 'studies', placeholder: 'Ex: Master Marketing' }
    ]
  },
  {
    id: 'work',
    title: 'Vie Professionnelle',
    description: 'Votre carrière et expériences.',
    items: [
      { id: 'firstJob', label: 'Première expérience pro', type: 'text', stepId: 'work', placeholder: 'Intitulé du poste' },
      { id: 'currentJob', label: 'Poste actuel (si applicable)', type: 'text', stepId: 'work', placeholder: 'Intitulé du poste actuel' },
      { id: 'hasManaged', label: 'Expérience de management', type: 'boolean', stepId: 'work' }
    ]
  },
  {
    id: 'adulting',
    title: 'Vie Adulte',
    description: 'Indépendance et gestion.',
    items: [
      { 
        id: 'hasApartment', 
        label: 'Logement', 
        type: 'select', 
        stepId: 'adulting',
        options: [
            { label: 'Propriétaire', value: 'owner' },
            { label: 'Locataire', value: 'tenant' },
            { label: 'Hébergé / Chez les parents', value: 'no' }
        ]
      },
      { id: 'moveInDate', label: 'Date d\'emménagement', type: 'date', stepId: 'adulting' },
      { id: 'managesBudget', label: 'Gestion de budget personnel', type: 'boolean', stepId: 'adulting' }
    ]
  },
  {
    id: 'social',
    title: 'Vie Sociale',
    description: 'Passions et Résilience.',
    items: [
        { id: 'hobbies', label: 'Passions & Hobbies', type: 'text', stepId: 'social', placeholder: 'Ex: Piano, Football, Lecture...' },
        { 
            id: 'covidPeriodOverlaps', 
            label: 'Avez-vous vécu la période Covid ?', 
            type: 'boolean', 
            stepId: 'social' 
        },
        { id: 'covidImpact', label: 'Impact du Covid sur votre vie (Négatif)', type: 'text', stepId: 'social', placeholder: 'Stress, isolement...' },
        { id: 'covidPositive', label: 'Leçons ou Positif tiré de la période', type: 'text', stepId: 'social', placeholder: 'Nouvelles compétences, introspection...' }
    ]
  },
  {
    id: 'vision',
    title: 'Vision',
    description: 'Vos objectifs futurs.',
    items: [
      { id: 'nextGoal', label: 'Prochain grand objectif', type: 'text', stepId: 'vision', placeholder: 'Ex: Acheter une maison, changer de travail...' }
    ]
  }
];
