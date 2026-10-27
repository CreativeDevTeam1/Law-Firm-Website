import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JobContent from "@/components/job-content";
import OtherRoles from "@/components/other-roles";
import { getRole, otherRoles, roleGroup, ROLES } from "@/lib/careers";

// Every role's page is built ahead of time; any other slug is a 404
// (dynamicParams isn't available with Cache Components, so it's checked here).
export function generateStaticParams() {
  return ROLES.map((role) => ({ slug: role.slug }));
}

export async function generateMetadata({ params }: PageProps<"/careers/[slug]">): Promise<Metadata> {
  const role = getRole((await params).slug);
  return role ? { title: `${role.title}, ${roleGroup(role).name}` } : {};
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
  const role = getRole((await params).slug);
  if (!role) notFound();

  return (
    <>
      <JobContent role={role} />
      <OtherRoles roles={otherRoles(role)} />
    </>
  );
}
