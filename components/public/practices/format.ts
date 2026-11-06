/** Dates in the practices template ("3 de noviembre"), with the year only when it isn't this one. */
export function formatDay(isoDate: string, lang: "es" | "en") {
  const date = new Date(`${isoDate}T00:00:00Z`);
  const sameYear = date.getUTCFullYear() === new Date().getUTCFullYear();
  return date.toLocaleDateString(lang === "es" ? "es-AR" : "en-US", {
    day: "numeric",
    month: "long",
    year: sameYear ? undefined : "numeric",
    timeZone: "UTC",
  });
}

/** Short month name for a week column, only where the month changes. */
export function monthMarks(weeks: string[], lang: "es" | "en") {
  let last = "";
  return weeks.map((week) => {
    const month = new Date(`${week}T00:00:00Z`)
      .toLocaleDateString(lang === "es" ? "es-AR" : "en-US", { month: "short", timeZone: "UTC" })
      .replace(".", "");
    if (month === last) return "";
    last = month;
    return month;
  });
}
