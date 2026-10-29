// The Sanity project the site reads from. Both are public: the dataset is
// readable by anyone, and they're in every image URL. So they default to the
// site's own project, and .env.local or the host's env vars only override them.

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "6x6vo5xc";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

/** Kept fixed so the API's behaviour doesn't change under the site. */
export const apiVersion = "2026-10-29";
