export const conditions = {
  showArrivalInFrance: (answers: any) =>
    answers.birthCountry && answers.birthCountry !== "France",

  showBrevet: (answers: any) =>
    answers.collegeStarted === "true",

  showFirstApartmentDetails: (answers: any) =>
    answers.hasApartment === "owner" || answers.hasApartment === "tenant",

  showCovidImpact: (answers: any) =>
    answers.covidPeriodOverlaps === "true"
};
