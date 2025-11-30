export type QuestionType =
  | "text"
  | "number"
  | "date"
  | "select"
  | "textarea"
  | "multi"
  | "boolean";

export interface QuestionSubField {
  id: string;
  label: string;
  type: QuestionType;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: { label: string; value: string }[];
  condition?: (answers: Record<string, any>) => boolean;
  weight?: number;
  xpReward?: number;
  badgeUnlock?: string;
  skillTags?: string[];
  sidEvent?: string;
}

export interface FormQuestion {
  id: string;
  label: string;
  type: QuestionType;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: { label: string; value: string }[];
  condition?: (answers: Record<string, any>) => boolean;

  // Champs analytiques enrichis
  category?: string;
  group?: string;
  weight?: number;
  xpReward?: number;
  badgeUnlock?: string;
  sidEvent?: string;
  skillTags?: string[];

  subQuestions?: QuestionSubField[];
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  category?: string;
  questions: FormQuestion[];
}

export const formSteps: FormStep[] = [
  // ----------------------------------------------------------------------
  // STEP 1: ORIGINES & IDENTITÉ (Le Socle)
  // ----------------------------------------------------------------------
  {
    id: "general",
    title: "Racines & Identité",
    category: "IDENTITY",
    description: "Chaque histoire commence quelque part. Définissons votre point de départ.",
    questions: [
      {
        id: "identity_basics",
        label: "Commençons par votre arrivée dans ce monde",
        type: "date",
        required: true,
        category: "BIOMETRICS",
        weight: 1.0,
        xpReward: 10,
        sidEvent: "BIRTH_EVENT",
        skillTags: ["self_awareness"],
        subQuestions: [
          {
            id: "birthDate",
            label: "Date de naissance",
            type: "date",
            required: true,
            sidEvent: "BIRTH_DATE",
            weight: 1.0
          },
          {
            id: "birthCountry",
            label: "Pays de naissance",
            type: "select",
            required: true,
            options: [
              { label: "France", value: "France" },
              { label: "Belgique", value: "Belgique" },
              { label: "Suisse", value: "Suisse" },
              { label: "Canada", value: "Canada" },
              { label: "Maroc", value: "Maroc" },
              { label: "Algérie", value: "Algérie" },
              { label: "Tunisie", value: "Tunisie" },
              { label: "Sénégal", value: "Sénégal" },
              { label: "Autre", value: "Autre" },
            ],
            skillTags: ["cultural_heritage"],
            sidEvent: "ORIGIN_POINT"
          }
        ]
      },
      {
        id: "mobility_history",
        label: "Avez-vous changé de ville ou de pays au cours de votre vie ?",
        type: "boolean",
        category: "ADAPTABILITY",
        helpText: "Le mouvement est une source d'apprentissage.",
        weight: 0.6,
        xpReward: 5,
        subQuestions: [
            {
                id: "moveCount",
                label: "Combien de déménagements majeurs ?",
                type: "number",
                placeholder: "Ex: 3",
                condition: (answers) => answers.mobility_history === "true",
                xpReward: 15,
                skillTags: ["adaptability", "openness"]
            },
            {
                id: "arrivalDate",
                label: "Date d'arrivée en France (si applicable)",
                type: "date",
                condition: (answers) => answers.identity_basics?.birthCountry !== "France" && !!answers.identity_basics?.birthCountry && answers.mobility_history === "true",
                sidEvent: "MIGRATION_EVENT",
                xpReward: 20,
                badgeUnlock: "WORLD_TRAVELER"
            },
            {
                id: "currentCity",
                label: "Votre camp de base actuel",
                type: "text",
                required: true,
                placeholder: "Ex: Lyon",
                sidEvent: "CURRENT_LOCATION"
            }
        ]
      }
    ]
  },

  // ----------------------------------------------------------------------
  // STEP 2: ENFANCE & SCOLAIRE (La Formation)
  // ----------------------------------------------------------------------
  {
    id: "education",
    title: "Apprentissage & Formation",
    category: "KNOWLEDGE",
    description: "Vos années de construction intellectuelle et sociale.",
    questions: [
      {
        id: "secondary_education",
        label: "Le cycle secondaire (Collège / Lycée)",
        type: "select",
        category: "ACADEMIC",
        options: [
            { label: "J'ai terminé le lycée", value: "full" },
            { label: "J'ai arrêté avant le Bac", value: "partial" }
        ],
        xpReward: 10,
        sidEvent: "ADOLESCENCE_CYCLE",
        subQuestions: [
            {
                id: "brevetObtained",
                label: "Avez-vous le Brevet ?",
                type: "boolean",
                xpReward: 10,
                badgeUnlock: "JUNIOR_GRADUATE"
            },
            {
                id: "bacObtained",
                label: "Avez-vous obtenu le Bac ?",
                type: "boolean",
                xpReward: 25,
                weight: 0.8,
                sidEvent: "BAC_GRADUATION",
                badgeUnlock: "HIGH_SCHOOL_GRADUATE"
            },
            {
                id: "bacYear",
                label: "Année d'obtention du Bac",
                type: "number",
                placeholder: "Ex: 2015",
                condition: (answers) => answers.secondary_education?.bacObtained === "true",
                sidEvent: "BAC_DATE"
            }
        ]
      },
      {
        id: "higher_education",
        label: "Études Supérieures",
        type: "select",
        category: "EXPERTISE",
        options: [
            { label: "Oui", value: "true" },
            { label: "Non, je suis entré dans la vie active", value: "false" }
        ],
        xpReward: 30,
        weight: 0.9,
        skillTags: ["expertise", "critical_thinking"],
        subQuestions: [
            {
                id: "degreeLevel",
                label: "Niveau atteint",
                type: "select",
                options: [
                    { label: "Bac+2 (BTS, DUT...)", value: "bts" },
                    { label: "Bac+3 (Licence, Bachelor...)", value: "bachelor" },
                    { label: "Bac+5 (Master, Ingénieur...)", value: "master" },
                    { label: "Doctorat / PhD", value: "phd" }
                ],
                xpReward: 40,
                badgeUnlock: "SCHOLAR"
            },
            {
                id: "degreeDetails",
                label: "Domaine d'études",
                type: "text",
                placeholder: "Ex: Marketing Digital, Droit...",
                skillTags: ["specialization"]
            },
            {
                id: "studiesEndDate",
                label: "Année de fin d'études",
                type: "number",
                placeholder: "Ex: 2020",
                sidEvent: "STUDIES_END"
            }
        ]
      }
    ]
  },

  // ----------------------------------------------------------------------
  // STEP 3: VIE PROFESSIONNELLE (L'Action)
  // ----------------------------------------------------------------------
  {
    id: "work",
    title: "Carrière & Réalisations",
    category: "CAREER",
    description: "Votre impact sur le monde professionnel.",
    questions: [
      {
        id: "career_start",
        label: "Entrée dans la vie active",
        type: "text",
        category: "CAREER_MILESTONE",
        weight: 1.0,
        xpReward: 30,
        sidEvent: "CAREER_START_EVENT",
        subQuestions: [
            {
                id: "firstJob",
                label: "Intitulé de votre premier vrai job",
                type: "text",
                placeholder: "Ex: Vendeur, Développeur Junior..."
            },
            {
                id: "firstJobStartDate",
                label: "Date de début",
                type: "date",
                sidEvent: "FIRST_PAYCHECK",
                helpText: "Le moment où vous êtes devenu financièrement indépendant.",
                xpReward: 20,
                badgeUnlock: "FINANCIAL_INDEPENDENCE"
            }
        ]
      },
      {
        id: "leadership_experience",
        label: "Responsabilités & Management",
        type: "select",
        category: "LEADERSHIP",
        options: [
            { label: "Oui, j'ai géré des équipes", value: "true" },
            { label: "Non, contributeur individuel", value: "false" }
        ],
        weight: 0.7,
        skillTags: ["leadership", "people_management"],
        subQuestions: [
            {
                id: "teamSize",
                label: "Taille maximale de l'équipe gérée",
                type: "number",
                condition: (answers) => answers.leadership_experience === "true",
                xpReward: 30,
                badgeUnlock: "TEAM_LEADER"
            }
        ]
      }
    ]
  },

  // ----------------------------------------------------------------------
  // STEP 4: AUTONOMIE & ADULTE (La Stabilité)
  // ----------------------------------------------------------------------
  {
    id: "adulting",
    title: "Indépendance & Stabilité",
    category: "LIFESTYLE",
    description: "Les piliers de votre vie d'adulte.",
    questions: [
      {
        id: "housing_situation",
        label: "Situation résidentielle",
        type: "select",
        category: "STABILITY",
        options: [
            { label: "Propriétaire", value: "owner" },
            { label: "Locataire", value: "tenant" },
            { label: "Chez mes parents / Hébergé", value: "hosted" },
            { label: "Nomade digital", value: "nomad" }
        ],
        weight: 0.6,
        xpReward: 15,
        skillTags: ["autonomy"],
        subQuestions: [
            {
                id: "moveInDate",
                label: "Installé depuis quand ?",
                type: "date",
                condition: (answers) => ["owner", "tenant"].includes(answers.housing_situation),
                sidEvent: "SETTLEMENT_DATE"
            }
        ]
      },
      {
        id: "finance_management",
        label: "Gestion financière",
        type: "select",
        category: "FINANCE",
        options: [
            { label: "Je gère un budget strict", value: "strict" },
            { label: "Je gère au feeling", value: "loose" },
            { label: "C'est compliqué", value: "struggle" }
        ],
        skillTags: ["financial_literacy"]
      }
    ]
  },

  // ----------------------------------------------------------------------
  // STEP 5: RÉSILIENCE & VISION (Le Futur)
  // ----------------------------------------------------------------------
  {
    id: "resilience_vision",
    title: "Épreuves & Futur",
    category: "GROWTH",
    description: "Ce qui ne vous tue pas vous donne de l'XP.",
    questions: [
      {
        id: "major_hardship",
        label: "Avez-vous surmonté une épreuve majeure ?",
        type: "boolean",
        category: "RESILIENCE",
        helpText: "Maladie, deuil, échec pro, rupture difficile...",
        weight: 1.2,
        xpReward: 50,
        skillTags: ["resilience", "grit"],
        badgeUnlock: "SURVIVOR",
        subQuestions: [
            {
                id: "hardshipType",
                label: "Type d'épreuve (optionnel)",
                type: "select",
                options: [
                    { label: "Santé", value: "health" },
                    { label: "Professionnel", value: "career" },
                    { label: "Personnel / Familial", value: "family" }
                ]
            },
            {
                id: "hardshipYear",
                label: "Année de l'événement",
                type: "number",
                sidEvent: "RESILIENCE_EVENT"
            }
        ]
      },
      {
        id: "next_big_thing",
        label: "Votre prochain grand chapitre",
        type: "text",
        category: "VISION",
        placeholder: "Lancer ma boîte, courir un marathon, acheter une maison...",
        weight: 1.5,
        xpReward: 20,
        sidEvent: "NEXT_GOAL",
        skillTags: ["ambition", "vision"]
      }
    ]
  }
];
