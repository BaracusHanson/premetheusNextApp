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
  },
  "quest_resilience_1": {
    longDescription: "La pandémie de Covid-19 a été une épreuve collective sans précédent. Cette quête marque votre traversée de cette période historique et votre capacité d'adaptation.",
    steps: [
      "Mars 2020 : Le Choc du premier confinement",
      "2020-2021 : L'Adaptation (Masques, Télétravail, Couvre-feu)",
      "2021 : La Campagne de Vaccination & Pass Sanitaire",
      "2022+ : Le 'Monde d'Après' et le retour à la normale",
      "Bilan personnel : Ce que vous avez appris sur vous-même"
    ],
    estimatedTime: "3 min"
  }
};
