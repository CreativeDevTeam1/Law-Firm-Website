"use client";

import { useRef } from "react";
import LineReveal from "@/components/ui/line-reveal";
import SectionHeading from "@/components/ui/section-heading";
import type { CareersPage } from "@/content/types";
import { useDividerReveal } from "@/hooks/use-divider-reveal";
import { indexNumber } from "@/lib/format";

type HiringProcessSectionProps = { hiring: CareersPage["hiring"] };

// Careers "How we hire" — the heading with its label set into the first
// line, then the steps as numbered rows, each under a divider that draws in
// (as on the Team page): the number in columns 1–4 and the title and
// description in columns 6–10, the column the article and bio text use.
export default function HiringProcessSection({ hiring: { heading, steps } }: HiringProcessSectionProps) {
  const stepsRef = useRef<HTMLOListElement>(null);
  useDividerReveal(stepsRef, ".hiring-step-divider");

  return (
    <section className="hiring" aria-labelledby="hiring-title">
      <SectionHeading id="hiring-title" label={heading.label} className="hiring-heading">
        {heading.title}
      </SectionHeading>

      <ol className="hiring-steps" ref={stepsRef}>
        {steps.map((step, i) => (
          <li className="hiring-step" key={step.title}>
            <span className="hiring-step-divider" aria-hidden="true" />
            <LineReveal className="hiring-step-number header-2-semibold">{`${indexNumber(i)}.`}</LineReveal>
            <div className="hiring-step-content">
              <LineReveal as="h3" className="header-3-semibold" delay={0.08}>
                {step.title}
              </LineReveal>
              <LineReveal className="hiring-step-text body-big" delay={0.14}>
                {step.description}
              </LineReveal>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
