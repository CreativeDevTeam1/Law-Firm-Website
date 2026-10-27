"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LineReveal from "@/components/line-reveal";
import SectionHeading from "@/components/section-heading";
import TeamsCard, { type TeamsCardProps } from "@/components/teams-card";

gsap.registerPlugin(ScrollTrigger);

type Member = Omit<TeamsCardProps, "nameAs" | "className">;
type Group = { id: string; label: string; members: Member[] };

const PHOTOS = [
  { photo: "/images/home-page/founders/founder-1.png", photoPosition: "21% 0" },
  { photo: "/images/home-page/founders/founder-2.png", photoPosition: "70% 0" },
  { photo: "/images/home-page/founders/founder-3.png", photoPosition: "39% 0" },
  { photo: "/images/home-page/founders/founder-4.png", photoPosition: "41% 0" },
];

// TODO: Figma's placeholders until the real team arrives: every card is
// "Shady el Barkoky" (with a date where the role goes, so the roles here
// are stand-ins), the four founder photos cycle, and "Know more" points
// at this page until each person has their own.
const placeholders = (role: string, count = PHOTOS.length): Member[] =>
  Array.from({ length: count }, (_, i) => ({
    name: "Shady el Barkoky",
    role,
    href: "/team",
    ...PHOTOS[i % PHOTOS.length],
  }));

// Keep each group a multiple of four, so the last row is full at four
// columns (and at two).
const GROUPS: Group[] = [
  { id: "team-founders", label: "(Founders)", members: placeholders("Founding Partner") },
  { id: "team-partners", label: "(Partners)", members: placeholders("Partner") },
  { id: "team-seniors", label: "(Seniors)", members: placeholders("Senior Associate", 8) },
];

// Team page — Figma "team-section" (Web and Mobile). The heading has
// "(Our Team)" set into its first line, like the home headings, with a
// paragraph below (see Page header in globals.css). Then a group per level of
// the firm: a divider that draws in from the left, the group's label and
// its cards — two columns, four from 1024px (never three, which would
// leave one of four cards alone on a row). The cards slide up and fade in
// a row at a time, as on the home page.
export default function TeamSection() {
  const directoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const directory = directoryRef.current;
    if (!directory) return;

    const dividers = gsap.utils.toArray<HTMLElement>(".team-group-divider", directory);
    const cards = gsap.utils.toArray<HTMLElement>(".teams-card", directory);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      dividers.forEach((divider) =>
        gsap.fromTo(
          divider,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.6,
            ease: "power4.inOut",
            // Not once: true, which can crash ScrollTrigger (use-line-reveal.ts).
            scrollTrigger: { trigger: divider, start: "top 90%", toggleActions: "play none none none" },
          },
        ),
      );

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
        {GROUPS.map((group) => (
          <section className="team-group" key={group.id} aria-labelledby={group.id}>
            <span className="team-group-divider" aria-hidden="true" />
            <LineReveal as="h3" id={group.id} className="team-group-label cta-medium">
              {group.label}
            </LineReveal>
            <ul className="team-grid">
              {group.members.map((member, i) => (
                <li key={i}>
                  <TeamsCard {...member} nameAs="h4" />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
