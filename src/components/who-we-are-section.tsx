"use client";

import { useRef } from "react";
import CarouselControls from "@/components/carousel-controls";
import LineReveal from "@/components/line-reveal";
import SectionHeading from "@/components/section-heading";
import { useCarousel } from "@/hooks/use-carousel";

type CoreValue = { title: string; description: string };

const CORE_VALUES: CoreValue[] = [
  {
    title: "Integrity",
    description:
      "Every matter is handled with honesty, transparency, and strict adherence to professional ethics.",
  },
  {
    title: "Excellence",
    description:
      "We strive for the highest standards of legal practice through thorough preparation, continuous development, and meticulous attention to detail.",
  },
  {
    title: "Confidentiality",
    description:
      "Protecting our clients’ information and interests remains one of our highest priorities.",
  },
  {
    title: "Professionalism",
    description:
      "Every client receives respectful, responsive, and dedicated legal representation.",
  },
  {
    title: "Commitment",
    description:
      "We approach every legal matter with determination, responsibility, and unwavering dedication.",
  },
  {
    title: "Strategic Thinking",
    description:
      "Legal challenges require more than technical knowledge—they require careful planning, sound judgment, and forward-thinking legal strategies.",
  },
];

// About page "Who we are" — Figma "who-we-are-section". The heading, then the
// firm's mission and vision, each with its label set into the first line
// (like the home page headings). Below, the core values sit in a row that
// scrolls sideways when they don't all fit: swiped on touch screens,
// dragged with a mouse, or (from 1024px) moved one value at a time by the
// arrow buttons, which switch off at either end (use-carousel.ts).
export default function WhoWeAreSection() {
  const listRef = useRef<HTMLUListElement>(null);
  const { canScroll, step } = useCarousel(listRef);

  return (
    <section className="who-we-are" aria-labelledby="who-we-are-title">
      <div className="who-we-are-intro">
        <SectionHeading id="who-we-are-title" label="(Who we are)" className="who-we-are-heading">
          As legal landscapes continue to evolve, our firm remains committed to
          delivering modern legal solutions while maintaining the highest
          standards of professional ethics and confidentiality.
        </SectionHeading>

        <SectionHeading
          as="p"
          labelAs="h3"
          label="(Our Mission)"
          titleClassName="header-2-semibold"
          labelClassName="header-4"
          className="who-we-are-statement"
        >
          To provide reliable legal solutions that protect our clients’
          interests with professionalism, integrity, and excellence.
        </SectionHeading>

        <SectionHeading
          as="p"
          labelAs="h3"
          label="(Our Vision)"
          titleClassName="header-2-semibold"
          labelClassName="header-4"
          className="who-we-are-statement"
        >
          To become a leading legal institution in Egypt and the Arab region,
          recognized for exceptional service, professionalism, trust, and
          lasting client relationships.
        </SectionHeading>
      </div>

      <div className="core-values">
        <LineReveal as="h3" className="core-values-title cta-medium">
          (Our Core Values)
        </LineReveal>

        <ul className="carousel core-values-list" id="core-values-list" ref={listRef}>
          {CORE_VALUES.map((value, i) => (
            <li className="core-value" key={value.title}>
              <LineReveal className="core-value-number display-header-2">
                {`${String(i + 1).padStart(2, "0")}.`}
              </LineReveal>
              <LineReveal as="h4" className="core-value-title header-3-semibold" delay={0.1}>
                {value.title}
              </LineReveal>
              <LineReveal className="core-value-text body" delay={0.15}>
                {value.description}
              </LineReveal>
            </li>
          ))}
        </ul>

        <CarouselControls
          className="core-values-controls"
          controls="core-values-list"
          canScroll={canScroll}
          step={step}
          itemName="value"
        />
      </div>
    </section>
  );
}
