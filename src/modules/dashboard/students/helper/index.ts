import { ENGLISH_MONTHS, SESSION_RANGES } from "../constants";

export function getMonthsBetweenRange(sessionRange: string): string[] {
  if (sessionRange === "no_session") return [];

  const match = sessionRange.match(/january_(\d+)_december_(\d+)/);
  if (!match) throw new Error("Invalid session range format");

  const startYear = parseInt(match[1], 10);
  const endYear = parseInt(match[2], 10);

  const months: string[] = [];

  for (let year = startYear; year <= endYear; year++) {
    for (const month of ENGLISH_MONTHS) {
      months.push(`${month} ${year}`);
    }
  }

  return months;
}

export const filteredSessionBasedOnYear = (duration: string) => {
  const durationYears = Number(duration);

  return SESSION_RANGES.map((item) => {
    if (item === "no_session") return item;

    const splited = item.split("_");
    const startYear = Number(splited[1]);
    const newEndYear = startYear + durationYears - 1;

    return `january_${startYear}_december_${newEndYear}`;
  });
};
