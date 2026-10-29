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
// those caches, so edits show up without a rebuild or a webhook. Only
// published content is read, so no token is needed (the dataset is public).
// Each caller in src/content/queries.ts provides the 'use cache' boundary.
export const { sanityFetch, SanityLive } = defineLive({ client, strict: true });
