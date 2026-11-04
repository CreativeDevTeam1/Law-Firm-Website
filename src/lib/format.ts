const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** An ISO date as the site shows it: "2026-10-14" → "14 Oct. 2026" (May isn't shortened, so it has no dot). */
export const formatDate = (isoDate: string) => {
  const parts = DATE_FORMAT.formatToParts(new Date(isoDate));
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value;
  const month = part("month");
  return `${part("day")} ${month}${month === "May" ? "" : "."} ${part("year")}`;
};

/** A list position as the site numbers it: 0 → "01". */
export const indexNumber = (i: number) => String(i + 1).padStart(2, "0");
