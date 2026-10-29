import { GLOSSARY, type Glossary } from "@/lib/glossary";

// The Client intake form's sections, in order (client-intake-form.tsx). Its
// wording, choices included, is in src/glossary under "intake"; a choice's
// key there is the value the form sends. Nothing is sent yet.

export type IntakeText = Glossary["intake"];

export type IntakeSectionId = keyof IntakeText["sections"];

export const INTAKE_SECTION_IDS = Object.keys(GLOSSARY.en.intake.sections) as IntakeSectionId[];

/** Arabic-Indic (٠–٩) and Persian (۰–۹) digits as 0–9, for phone and ID numbers. */
export const toWesternDigits = (value: string) =>
  value.replace(/[٠-٩۰-۹]/g, (digit) => String(digit.charCodeAt(0) & 0xf));
