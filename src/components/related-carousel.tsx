"use client";

import { useRef, type ReactNode } from "react";
import CarouselControls from "@/components/carousel-controls";
import LineReveal from "@/components/line-reveal";
import { useCarousel } from "@/hooks/use-carousel";

type RelatedCarouselProps = {
  /** Prefix for the heading's and list's ids, e.g. "related-members". */
  id: string;
  /** The label above the cards, e.g. "(Related Members)". */
  label: string;
  /** What one arrow step moves by, e.g. "member" makes "Next member". */
  itemName: string;
  /** One <li className="related-item"> per card. */
  children: ReactNode;
};

// The end of a team member's or an article's page — Figma "team-carousel":
// a divider and the label, then cards in a carousel (use-carousel.ts)
// running to the screen edges: swiped, dragged, or stepped with the arrows
// from 1024px, where four cards fit across as in Figma. Below that a part
// of the next card shows, so it reads as a row that scrolls.
//
//   <RelatedCarousel id="related-members" label="(Related Members)" itemName="member">
//     <li className="related-item"><TeamsCard … /></li>
//   </RelatedCarousel>
export default function RelatedCarousel({ id, label, itemName, children }: RelatedCarouselProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const { canScroll, step } = useCarousel(listRef);

  return (
    <section className="related" aria-labelledby={`${id}-title`}>
      <span className="related-divider" aria-hidden="true" />
      <LineReveal as="h2" id={`${id}-title`} className="related-label cta-medium">
        {label}
      </LineReveal>

      <ul className="carousel related-list" id={`${id}-list`} ref={listRef}>
        {children}
      </ul>

      <CarouselControls
        className="related-controls"
        controls={`${id}-list`}
        canScroll={canScroll}
        step={step}
        itemName={itemName}
      />
    </section>
  );
}
