"use client";

import { useRef } from "react";
import LineReveal from "@/components/ui/line-reveal";
import SectionHeading from "@/components/ui/section-heading";
import { useDividerReveal } from "@/hooks/use-divider-reveal";

type Step = { title: string; description: string };

const STEPS: Step[] = [
  {
    title: "Application",
    description:
      "Send us your CV and a short note on why the role interests you. Every application is read by a member of the team, not a filter.",
  },
  {
    title: "First interview",
    description:
      "A conversation with the practice group you’d join about your experience, how you approach legal problems and what you’re looking for next.",
  },
  {
    title: "Meet the partners",
    description:
      "A meeting with the firm’s partners, who share where the firm is heading and want to hear how you see your place in it.",
  },
  {
    title: "Offer",
    description:
      "If it’s the right fit for both sides, we move quickly with a clear written offer and agree on a start date that works for you.",
  },
];

// Careers "How we hire" — the heading with its label set into the first
// line, then the steps as numbered rows, each under a divider that draws in
// (as on the Team page): the number in columns 1–4 and the title and
// description in columns 6–10, the column the article and bio text use.
export default function HiringProcessSection() {
  const stepsRef = useRef<HTMLOListElement>(null);
  useDividerReveal(stepsRef, ".hiring-step-divider");

  return (
    <section className="hiring" aria-labelledby="hiring-title">
      <SectionHeading id="hiring-title" label="(How we hire)" className="hiring-heading">
        A clear, respectful process, built to show us how you think and you
        how we work.
      </SectionHeading>

      <ol className="hiring-steps" ref={stepsRef}>
        {STEPS.map((step, i) => (
          <li className="hiring-step" key={step.title}>
            <span className="hiring-step-divider" aria-hidden="true" />
            <LineReveal className="hiring-step-number header-2-semibold">
              {`${String(i + 1).padStart(2, "0")}.`}
            </LineReveal>
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
