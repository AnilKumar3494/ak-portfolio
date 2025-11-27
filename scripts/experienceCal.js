const elYearsExperience = document.getElementById("years_experience");

const startDate = new Date("2024-04-01");
const currentDate = new Date();

const differenceInTime = currentDate.getTime() - startDate.getTime();

const yearsExact = differenceInTime / (1000 * 3600 * 24 * 365.25);

const years = yearsExact.toFixed(1);

if (elYearsExperience) {
  elYearsExperience.textContent = `I have ${years} years of work experience and have been writing code since 2020.`;
}
