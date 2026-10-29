import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PersonaProfile from "@/components/sections/persona-profile";
import RelatedMembers from "@/components/sections/related-members";
import { getTeamMemberPage, getTeamMemberSlugs } from "@/content/queries";

// Every member's page is built ahead of time; any other slug is a 404
// (dynamicParams isn't available with Cache Components, so it's checked here).
export async function generateStaticParams() {
  return (await getTeamMemberSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/team/[slug]">): Promise<Metadata> {
  const page = await getTeamMemberPage((await params).slug);
  return page ? { title: `${page.member.name}, ${page.member.role}` } : {};
}

// The slug is read inside Suspense, so the page's shell is the same for
// every member and navigating to one is instant (Next's "URL data outside
// of Suspense" guidance). The placeholder holds a screen's height so the
// footer doesn't flash up meanwhile.
export default function TeamMember({ params }: PageProps<"/team/[slug]">) {
  return (
    <main>
      <Suspense fallback={<div className="persona-placeholder" />}>
        <Member params={params} />
      </Suspense>
    </main>
  );
}

async function Member({ params }: Pick<PageProps<"/team/[slug]">, "params">) {
  const page = await getTeamMemberPage((await params).slug);
  if (!page) notFound();

  return (
    <>
      <PersonaProfile member={page.member} />
      <RelatedMembers members={page.related} />
    </>
  );
}
