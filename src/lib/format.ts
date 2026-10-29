const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** An ISO date as the site shows it: "2026-10-21" → "21 October 2026". */
export const formatDate = (isoDate: string) => DATE_FORMAT.format(new Date(isoDate));

/** A list position as the site numbers it: 0 → "01". */
export const indexNumber = (i: number) => String(i + 1).padStart(2, "0");
