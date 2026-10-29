"use client";

import { useRef, useState } from "react";
import { useIndexReveal } from "@/hooks/use-index-reveal";
import LineReveal from "@/components/ui/line-reveal";
import SectionHeading from "@/components/ui/section-heading";
import ValuesIndex from "@/components/ui/values-index";
import type { AboutPage } from "@/content/types";

type WhoWeAreSectionProps = { whoWeAre: AboutPage["whoWeAre"] };

// About page "Who we are" — Figma "who-we-are-section". The heading, then the
// firm's mission and vision, each with its label set into the first line
// (like the home page headings). Below, the core values as an editorial
// index (values-index.tsx). Each row reveals as it scrolls in: its rule
// draws in from the left (as the Team page dividers), then the number and
// the (+) rise out of their masks with the title's line reveal. The first
// opens as part of its reveal, once its title is in, so its description and
// number animate in too. (Not on hover: opening changes the rows' heights,
// so the list would shift under the pointer.)
export default function WhoWeAreSection({ whoWeAre }: WhoWeAreSectionProps) {
  const indexRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState(-1);

  useIndexReveal(indexRef, setOpenIndex);

  return (
    <section className="who-we-are" aria-labelledby="who-we-are-title">
      <div className="who-we-are-intro">
        <SectionHeading id="who-we-are-title" label={whoWeAre.heading.label} className="who-we-are-heading">
          {whoWeAre.heading.title}
        </SectionHeading>

        {[whoWeAre.mission, whoWeAre.vision].map((statement) => (
          <SectionHeading
            as="p"
            labelAs="h3"
            label={statement.label}
            titleClassName="header-2-semibold"
            labelClassName="header-4"
            className="who-we-are-statement"
            key={statement.label}
          >
            {statement.title}
          </SectionHeading>
        ))}
      </div>

      <div className="core-values" ref={indexRef}>
        <LineReveal as="h3" className="core-values-title cta-medium">
          ({whoWeAre.valuesLabel})
        </LineReveal>

        <ValuesIndex
          items={whoWeAre.values}
          idPrefix="core-value"
          openIndex={openIndex}
          onOpenChange={setOpenIndex}
          headingAs="h4"
        />
      </div>
    </section>
  );
}
