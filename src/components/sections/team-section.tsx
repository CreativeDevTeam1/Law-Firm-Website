"use client";

import { useRef } from "react";
import LineReveal from "@/components/ui/line-reveal";
import SectionHeading from "@/components/ui/section-heading";
import TeamsCard from "@/components/cards/teams-card";
import type { TeamPage } from "@/content/types";
import { useBatchReveal } from "@/hooks/use-batch-reveal";
import { useDividerReveal } from "@/hooks/use-divider-reveal";

type TeamSectionProps = { directory: TeamPage };

// Team page — Figma "team-section" (Web and Mobile). The heading has
// "(Our Team)" set into its first line, like the home headings, with a
// paragraph below (see Page header in globals.css). Then a group per level of
// the firm: a divider that draws in from the left, the group's label and
// its cards — two columns, four from 768px (never three, which would
// leave one of four cards alone on a row). Each card links to the
// member's page (/team/[slug]). The cards slide up and fade in a row at a
// time, as on the home page.
export default function TeamSection({ directory: { heading, intro, groups } }: TeamSectionProps) {
  const directoryRef = useRef<HTMLDivElement>(null);
  useDividerReveal(directoryRef, ".team-group-divider");
  useBatchReveal(directoryRef, ".teams-card");

  return (
    <section className="team" aria-labelledby="team-title">
      <div className="page-header">
        <SectionHeading id="team-title" label={heading.label} className="page-heading team-heading">
          {heading.title}
        </SectionHeading>
        <LineReveal className="page-intro body" delay={0.1}>
          {intro}
        </LineReveal>
      </div>

      <div className="team-directory" ref={directoryRef}>
        {groups.map((group, i) => (
          <section className="team-group" key={group.title} aria-labelledby={`team-group-${i}`}>
            <span className="team-group-divider" aria-hidden="true" />
            <LineReveal as="h3" id={`team-group-${i}`} className="team-group-label cta-medium">
              ({group.title})
            </LineReveal>
            <ul className="team-grid">
              {group.members.map((member) => (
                <li key={member.slug}>
                  <TeamsCard member={member} nameAs="h4" />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
