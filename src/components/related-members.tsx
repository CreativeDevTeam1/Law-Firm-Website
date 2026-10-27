"use client";

import { useRef } from "react";
import CarouselControls from "@/components/carousel-controls";
import LineReveal from "@/components/line-reveal";
import TeamsCard from "@/components/teams-card";
import { useCarousel } from "@/hooks/use-carousel";
import type { TeamMember } from "@/lib/team";

type RelatedMembersProps = { members: TeamMember[] };

// The end of a team member's page — Figma "team-carousel": a divider and
// "(Related Members)", then the rest of the team as cards in a carousel
// (use-carousel.ts) running to the screen edges: swiped, dragged, or
// stepped with the arrows from 1024px, where four cards fit across as in
// Figma. Below that a part of the next card shows, so it reads as a row
// that scrolls.
export default function RelatedMembers({ members }: RelatedMembersProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const { canScroll, step } = useCarousel(listRef);

  return (
    <section className="related-members" aria-labelledby="related-members-title">
      <span className="related-members-divider" aria-hidden="true" />
      <LineReveal as="h2" id="related-members-title" className="related-members-label cta-medium">
        (Related Members)
      </LineReveal>

      <ul className="carousel related-members-list" id="related-members-list" ref={listRef}>
        {members.map((member) => (
          <li className="related-members-item" key={member.slug}>
            <TeamsCard
              name={member.name}
              role={member.role}
              photo={member.photo}
              photoPosition={member.photoPosition}
              href={`/team/${member.slug}`}
            />
          </li>
        ))}
      </ul>

      <CarouselControls
        className="related-members-controls"
        controls="related-members-list"
        canScroll={canScroll}
        step={step}
        itemName="member"
      />
    </section>
  );
}
