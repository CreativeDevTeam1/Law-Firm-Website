import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { contentTag } from "@/sanity/live";

// Sanity's webhook calls this on every publish, so edits reach the site even
// when no one has it open for <SanityLive /> to hear about them. Pages share
// documents through references, so all cached content is refreshed together.
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return new Response("SANITY_REVALIDATE_SECRET isn't set", { status: 500 });

  // Waits a few seconds first, so the refetch finds the new content.
  const { isValidSignature } = await parseBody(request, secret);
  if (!isValidSignature) return new Response("Invalid signature", { status: 401 });

  // expire: 0 so the next visitor gets the new content, not the old copy.
  revalidateTag(contentTag, { expire: 0 });
  return Response.json({ revalidated: contentTag });
}
