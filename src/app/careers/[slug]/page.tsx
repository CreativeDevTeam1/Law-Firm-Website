import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JobContent from "@/components/sections/job-content";
import OtherRoles from "@/components/sections/other-roles";
import { getRolePage, getRoleSlugs } from "@/content/queries";

// Every role's page is built ahead of time; any other slug is a 404
// (dynamicParams isn't available with Cache Components, so it's checked here).
export async function generateStaticParams() {
  return (await getRoleSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/careers/[slug]">): Promise<Metadata> {
  const page = await getRolePage((await params).slug);
  return page ? { title: `${page.role.title}, ${page.groupName}` } : {};
}

// As the team member pages: the slug is read inside Suspense, so the
// page's shell is the same for every role and navigating to one is
// instant. The placeholder holds a screen's height so the footer doesn't
// flash up meanwhile.
export default function CareersRole({ params }: PageProps<"/careers/[slug]">) {
  return (
    <main>
      <Suspense fallback={<div className="persona-placeholder" />}>
        <Opening params={params} />
      </Suspense>
    </main>
  );
}

async function Opening({ params }: Pick<PageProps<"/careers/[slug]">, "params">) {
  const page = await getRolePage((await params).slug);
  if (!page) notFound();

  return (
    <>
      <JobContent role={page.role} groupName={page.groupName} offer={page.offer} />
      <OtherRoles roles={page.otherRoles} />
    </>
  );
}
