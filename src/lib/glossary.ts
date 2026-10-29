import ar from "@/glossary/ar.json";
import en from "@/glossary/en.json";

// The site's wording in each language, from src/glossary: one JSON file per
// language, the same keys in each. English is the reference; the Arabic
// file must have every key it has (the type below checks this).
//
// Wording can hold placeholders in braces, filled by format():
//
//   format(t.intake.progress, { done: 3, all: 7 })   → "3 of 7 complete"
//
// A count that changes the wording ("1 file", "2 files") is an object of
// plural forms, chosen by plural(). Arabic has more forms than English
// (one, two, few, many, other), so each language lists only the ones it
// uses.
//
// The Arabic is formal Modern Standard Arabic. TODO: a lawyer at the firm
// approves it before launch, the intake's consent line and intro above
// all, since they carry legal weight.

export const LANGS = ["en", "ar"] as const;

export type Lang = (typeof LANGS)[number];

/** The language a ?lang= value asks for; English unless it's "ar". */
export const toLang = (value: unknown): Lang => (value === "ar" ? "ar" : "en");

export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

// English's shape with every piece of wording as a string, and plural forms
// (under a "files"-style key) free to differ between languages.
type Wording<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends (infer Item)[]
      ? Wording<Item>[]
      : T[K] extends { other: string }
        ? PluralForms
        : Wording<T[K]>;
};

export type Glossary = Wording<typeof en>;

export const GLOSSARY: Record<Lang, Glossary> = { en, ar };

/** Fills the {placeholders} in a piece of wording. */
export const format = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (placeholder, key: string) => String(values[key] ?? placeholder));

/** The plural form for a count in that language, with {count} filled. */
export const plural = (lang: Lang, forms: PluralForms, count: number) =>
  format(forms[new Intl.PluralRules(lang).select(count)] ?? forms.other, { count });
