export const QUEST_CONTENT: Record<string, {
  longDescription?: string;
  steps?: string[];
  estimatedTime?: string;
}> = {
  "quest_identity_birth": {
    longDescription: "Cette première étape est fondamentale pour construire votre arbre. Elle permet de vous situer dans le temps et l'espace, et sert de point de départ pour remonter vers vos ancêtres.",
    steps: [
      "Renseignez votre pays de naissance",
      "Indiquez votre ville de naissance",
      "Confirmez votre date de naissance"
    ],
    estimatedTime: "2 min"
  },
  "quest_identity_roots": {
    longDescription: "Pour comprendre qui vous êtes, il est essentiel de savoir d'où vous venez. Cette quête vous invite à explorer les origines de vos parents et grands-parents.",
    steps: [
      "Listez les pays d'origine de vos parents",
      "Mentionnez les régions spécifiques si connues",
      "Indiquez les langues parlées dans la famille"
    ],
    estimatedTime: "5 min"
  }
};
