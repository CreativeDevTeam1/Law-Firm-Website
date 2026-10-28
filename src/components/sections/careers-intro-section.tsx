"use client";

import { useRef } from "react";
import CarouselControls from "@/components/ui/carousel-controls";
import LineReveal from "@/components/ui/line-reveal";
import SectionHeading from "@/components/ui/section-heading";
import { useCarousel } from "@/hooks/use-carousel";

type Reason = { title: string; description: string };

const REASONS: Reason[] = [
  {
    title: "Mentorship",
    description:
      "Work alongside the firm’s founders and partners, who review, guide and invest in every lawyer’s growth.",
  },
  {
    title: "Real Responsibility",
    description:
      "From your first months you take part in client meetings, draft the documents that matter and see matters through.",
  },
  {
    title: "Breadth of Practice",
    description:
      "Corporate, commercial, litigation and advisory work under one roof, so you build judgment across the law, not one corner of it.",
  },
  {
    title: "Continuous Learning",
    description:
      "Internal training, sponsored courses and time set aside to keep up with a legal landscape that never stands still.",
  },
  {
    title: "A Collegial Culture",
    description:
      "A close team that shares knowledge freely, holds high standards and treats colleagues with the same respect as clients.",
  },
];

// Careers page opening — designed from the About page's patterns (there's
// no Figma frame). The Page header, with "(Careers)" set into the heading,
// then the reasons to join in the Core Values carousel (who-we-are-section.tsx
// and its styles): swiped, dragged, or stepped with the arrows from 1024px.
export default function CareersIntroSection() {
  const listRef = useRef<HTMLUListElement>(null);
  const { canScroll, step } = useCarousel(listRef);

  return (
    <section className="careers-intro" aria-labelledby="careers-title">
      <div className="page-header careers-header">
        <SectionHeading id="careers-title" label="(Careers)" className="page-heading careers-heading">
          Build a legal career grounded in integrity, rigour and purpose,
          alongside people who take both the law and each other seriously.
        </SectionHeading>
        <LineReveal className="page-intro body" delay={0.1}>
          We look for lawyers and professionals who care about the details,
          think strategically and want to grow. In return, we offer close
          mentorship, meaningful work from day one and a firm that invests in
          every member of its team.
        </LineReveal>
      </div>

      <div className="core-values">
        <LineReveal as="h3" className="core-values-title cta-medium">
          (Why join us)
        </LineReveal>

        <ul className="carousel core-values-list" id="careers-reasons-list" ref={listRef}>
          {REASONS.map((reason, i) => (
            <li className="core-value" key={reason.title}>
              <LineReveal className="core-value-number display-header-2">
                {`${String(i + 1).padStart(2, "0")}.`}
              </LineReveal>
              <LineReveal as="h4" className="core-value-title header-3-semibold" delay={0.1}>
                {reason.title}
              </LineReveal>
              <LineReveal className="core-value-text body" delay={0.15}>
                {reason.description}
              </LineReveal>
            </li>
          ))}
        </ul>

        <CarouselControls
          className="core-values-controls"
          controls="careers-reasons-list"
          canScroll={canScroll}
          step={step}
          itemName="reason"
        />
      </div>
    </section>
  );
}
