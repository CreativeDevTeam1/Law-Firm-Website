"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LineReveal from "@/components/line-reveal";
import SectionHeading from "@/components/section-heading";
import TeamsCard from "@/components/teams-card";
import { useDividerReveal } from "@/hooks/use-divider-reveal";
import { TEAM, TEAM_GROUPS } from "@/lib/team";

gsap.registerPlugin(ScrollTrigger);

// Team page — Figma "team-section" (Web and Mobile). The heading has
// "(Our Team)" set into its first line, like the home headings, with a
// paragraph below (see Page header in globals.css). Then a group per level of
// the firm: a divider that draws in from the left, the group's label and
// its cards — two columns, four from 768px (never three, which would
// leave one of four cards alone on a row). Each card links to the
// member's page (/team/[slug]). The members are in src/lib/team.ts. The
// cards slide up and fade in a row at a time, as on the home page.
export default function TeamSection() {
  const directoryRef = useRef<HTMLDivElement>(null);
  useDividerReveal(directoryRef, ".team-group-divider");

  useEffect(() => {
    const directory = directoryRef.current;
    if (!directory) return;

    const cards = gsap.utils.toArray<HTMLElement>(".teams-card", directory);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const reveal = ScrollTrigger.batch(cards, {
        start: "top bottom",
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { yPercent: 100, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, duration: 1.2, ease: "power3.out", stagger: 0.1 },
          ),
      });

      return () => reveal.forEach((trigger) => trigger.kill());
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="team" aria-labelledby="team-title">
      <div className="page-header">
        <SectionHeading id="team-title" label="(Our Team)" className="page-heading team-heading">
          Our multidisciplinary team brings senior expertise across strategy,
          brand, culture, verbal, and design under one roof.
        </SectionHeading>
        <LineReveal className="page-intro body" delay={0.1}>
          Built upon professionalism, integrity, and client-focused
          representation, the firm serves individuals, corporations,
          investors, entrepreneurs, and institutions seeking dependable legal
          counsel in an increasingly complex legal and commercial environment.
        </LineReveal>
      </div>

      <div className="team-directory" ref={directoryRef}>
        {TEAM_GROUPS.map((group) => (
          <section className="team-group" key={group.id} aria-labelledby={`team-${group.id}`}>
            <span className="team-group-divider" aria-hidden="true" />
            <LineReveal as="h3" id={`team-${group.id}`} className="team-group-label cta-medium">
              {group.label}
            </LineReveal>
            <ul className="team-grid">
              {TEAM.filter((member) => member.group === group.id).map((member) => (
                <li key={member.slug}>
                  <TeamsCard
                    name={member.name}
                    role={member.role}
                    photo={member.photo}
                    photoPosition={member.photoPosition}
                    href={`/team/${member.slug}`}
                    nameAs="h4"
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
