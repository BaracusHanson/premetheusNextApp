export const formTriggers = {
  birthCountry: {
    quests: ["quest_identity_birth"],
    badges: ["badge_nomad"] // Potential trigger if moved a lot (handled by logic usually)
  },
  moveCount: {
    quests: ["quest_identity_mobility"],
    badges: ["badge_nomad", "badge_explorer_ir"]
  },
  brevetObtained: {
    quests: ["quest_school_brevet"],
    value: "true"
  },
  bacObtained: {
    quests: ["quest_school_bac"],
    value: "true",
    badges: ["badge_bac_fighter"]
  },
  higher_education: {
    quests: ["quest_studies_higher"],
    value: "true"
  },
  degreeLevel: {
    valueMapping: {
      "master": ["quest_studies_master"],
      "phd": ["quest_studies_master"] // PhD covers Master
    },
    badges: ["badge_master_mind"]
  },
  firstJob: {
    quests: ["quest_work_first"],
    badges: ["badge_first_paycheck"]
  },
  leadership_experience: {
    quests: ["quest_work_leader"],
    value: "true",
    badges: ["badge_team_leader"]
  },
  housing_situation: {
    quests: ["quest_adult_settle"],
    // Any value except maybe 'hosted' if strict, but quest desc says "Stable"
  },
  finance_management: {
    quests: ["quest_adult_finance"],
    value: "strict" // Or "loose" depending on strictness wanted
  },
  major_hardship: {
    quests: ["quest_growth_survivor"],
    value: "true",
    badges: ["badge_survivor"]
  },
  next_big_thing: {
    quests: ["quest_growth_vision"],
    // badges: ["badge_visionary"]
  }
};
