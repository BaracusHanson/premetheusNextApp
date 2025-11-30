export const formTriggers = {
  birthCountry: {
    quests: ["quest_identity_birth"],
    badges: ["badge_nomad"] // Example candidate
  },
  familyOrigins: {
    quests: ["quest_identity_roots"]
  },
  moveCount: {
    quests: ["quest_stability_move"],
    badges: [
      // Logic handled in engine usually, but we can map candidate IDs here
      "badge_nomad", "badge_explorer_ir"
    ]
  },
  primarySchoolMemory: {
    quests: ["quest_school_primary"]
  },
  brevetObtained: {
    quests: ["quest_school_brevet"],
    value: "true" // Trigger if value matches?
  },
  bacObtained: {
    quests: ["quest_school_bac"],
    badges: ["badge_bac_fighter"]
  },
  degreeLevel: {
    valueMapping: {
      "bachelor": ["quest_studies_bachelor"],
      "master": ["quest_studies_bachelor", "quest_studies_master"]
    }
  },
  firstJob: {
    quests: ["quest_work_first"],
    badges: ["badge_first_paycheck"]
  },
  hasManaged: {
    quests: ["quest_work_manager"],
    value: "true"
  },
  hasApartment: {
    quests: ["quest_adult_home"],
    badges: ["badge_builder"],
    journeys: ["journey_autonomy"]
  },
  managesBudget: {
    quests: ["quest_adult_budget"],
    value: "true"
  },
  covidPeriodOverlaps: {
    journeys: ["journey_resilience"]
  },
  nextGoal: {
    quests: ["quest_vision_goal"],
    badges: ["badge_visionary"]
  }
};
