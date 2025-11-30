export type QuestionType = 'text' | 'number' | 'date' | 'select' | 'textarea';

export interface FormQuestion {
  id: string;
  label: string;
  type: QuestionType;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: { label: string; value: string }[]; // For select
  condition?: (answers: Record<string, any>) => boolean;
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  questions: FormQuestion[];
}

export const formSteps: FormStep[] = [
  {
    id: "general",
    title: "Informations générales",
    description: "Commençons par les bases.",
    questions: [
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
          { label: "Autre", value: "Autre" },
        ],
      },
      {
        id: "arrivalDate",
        label: "Date d'arrivée en France",
        type: "date",
        helpText: "Si vous êtes né(e) ailleurs.",
        condition: (answers) => answers.birthCountry && answers.birthCountry !== "France",
      },
      {
        id: "currentCity",
        label: "Ville actuelle",
        type: "text",
        required: true,
        placeholder: "Ex: Lyon",
      },
      {
        id: "familyOrigins",
        label: "D'où vient votre famille ?",
        type: "textarea",
        helpText: "Pays d'origine des parents, grands-parents...",
      },
      {
        id: "moveCount",
        label: "Combien de fois avez-vous déménagé ?",
        type: "number",
      },
    ],
  },
  {
    id: "childhood",
    title: "Enfance & scolarité",
    description: "Vos premières années.",
    questions: [
      {
        id: "primarySchoolMemory",
        label: "Meilleur souvenir de l'école primaire",
        type: "textarea",
        placeholder: "La cour de récré, un prof marquant...",
      },
    ],
  },
  {
    id: "college",
    title: "Collège & Lycée",
    questions: [
        {
            id: "collegeStarted",
            label: "Avez-vous été au collège ?",
            type: "select",
            options: [
                { label: "Oui", value: "true" },
                { label: "Non", value: "false" }
            ]
        },
        {
            id: "brevetObtained",
            label: "Avez-vous obtenu le Brevet ?",
            type: "select",
            options: [
                { label: "Oui", value: "true" },
                { label: "Non", value: "false" }
            ],
            condition: (answers) => answers.collegeStarted === "true",
        },
        {
            id: "bacObtained",
            label: "Avez-vous obtenu le Bac ?",
            type: "select",
            options: [
                { label: "Oui", value: "true" },
                { label: "Non", value: "false" }
            ]
        }
    ]
  },
  {
    id: "studies",
    title: "Études supérieures",
    questions: [
        {
            id: "hasDegrees",
            label: "Avez-vous fait des études supérieures ?",
            type: "select",
            options: [
                { label: "Oui", value: "true" },
                { label: "Non", value: "false" }
            ]
        },
        {
            id: "degreeDetails",
            label: "Quel diplôme ?",
            type: "text",
            condition: (answers) => answers.hasDegrees === "true"
        },
        {
            id: "degreeLevel",
            label: "Niveau d'études atteint",
            type: "select",
            options: [
                { label: "Bac+3 (Licence, Bachelor...)", value: "bachelor" },
                { label: "Bac+5 (Master, Ingénieur...)", value: "master" },
                { label: "Autre / Doctorat", value: "other" }
            ],
            condition: (answers) => answers.hasDegrees === "true"
        }
    ]
  },
  {
    id: "work",
    title: "Vie professionnelle",
    questions: [
        {
            id: "firstJob",
            label: "Votre tout premier job",
            type: "text",
        },
        {
            id: "hasManaged",
            label: "Avez-vous déjà managé une équipe ?",
            type: "select",
            options: [
                { label: "Oui", value: "true" },
                { label: "Non", value: "false" }
            ]
        }
    ]
  },
  {
    id: "adulting",
    title: "Autonomie & vie d’adulte",
    questions: [
        {
            id: "hasApartment",
            label: "Avez-vous votre propre logement ?",
            type: "select",
            options: [
                { label: "Oui, propriétaire", value: "owner" },
                { label: "Oui, locataire", value: "tenant" },
                { label: "Non", value: "no" }
            ]
        },
        {
            id: "moveInDate",
            label: "Date d'emménagement",
            type: "date",
            condition: (answers) => answers.hasApartment === "owner" || answers.hasApartment === "tenant"
        },
        {
            id: "managesBudget",
            label: "Gérez-vous votre propre budget ?",
            type: "select",
            options: [
                { label: "Oui", value: "true" },
                { label: "Non", value: "false" }
            ]
        }
    ]
  },
  {
    id: "social",
    title: "Vie sociale & passions",
    questions: [
        {
            id: "hobbies",
            label: "Vos passions principales",
            type: "textarea"
        }
    ]
  },
  {
    id: "resilience",
    title: "Épreuves & résilience",
    questions: [
        {
            id: "covidPeriodOverlaps",
            label: "Avez-vous vécu la période Covid ?",
            type: "select",
            options: [
                { label: "Oui", value: "true" },
                { label: "Non", value: "false" }
            ]
        },
        {
            id: "covidImpact",
            label: "Comment cela vous a-t-il impacté ?",
            type: "textarea",
            condition: (answers) => answers.covidPeriodOverlaps === "true"
        }
    ]
  },
  {
    id: "vision",
    title: "Objectifs & futur",
    questions: [
        {
            id: "nextGoal",
            label: "Prochain grand objectif",
            type: "text"
        }
    ]
  }
];
