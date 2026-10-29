// The Sanity project the site reads from (.env.local). Both are public: the
// dataset is readable by anyone, and they're in every image URL.

export const projectId = required(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, "NEXT_PUBLIC_SANITY_PROJECT_ID");

export const dataset = required(process.env.NEXT_PUBLIC_SANITY_DATASET, "NEXT_PUBLIC_SANITY_DATASET");

/** Kept fixed so the API's behaviour doesn't change under the site. */
export const apiVersion = "2026-10-29";

function required(value: string | undefined, name: string) {
  if (!value) throw new Error(`Missing environment variable ${name} (see .env.example)`);
  return value;
}
