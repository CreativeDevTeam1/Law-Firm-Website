import { createClient } from "next-sanity";
import { defineLive } from "next-sanity/live";
import { apiVersion, dataset, projectId } from "@/sanity/env";

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

// sanityFetch caches each query and tags it with what it read; <SanityLive />
// in the root layout listens for published changes and refreshes exactly
// those caches while someone has the site open. For when no one does, the
// webhook route (src/app/api/revalidate) refreshes everything tagged with
// contentTag. Only published content is read, so no token is needed (the
// dataset is public). Each caller in src/content/queries.ts provides the
// 'use cache' boundary.
export const { sanityFetch, SanityLive } = defineLive({ client, strict: true });

/** Tags every cached query, so the webhook can refresh them all at once. */
export const contentTag = "sanity-content";
