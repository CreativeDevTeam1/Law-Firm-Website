"use client";

import { useRef, useState } from "react";
import { useIndexReveal } from "@/hooks/use-index-reveal";
import LineReveal from "@/components/ui/line-reveal";

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

// Careers page "(Why join us)", after the open positions — the About page's
// Core values index (who-we-are-section.tsx, use-index-reveal.ts and the
// values-index styles): a row per reason between hairline rules, with its
// number, title and a (+). Clicking a row opens its description and its
// number in display type, and closes the one before; the first opens as
// part of its reveal. From 1024px the label sits in columns 1–5 and the
// index in 6–12, as on the About page.
export default function CareersReasonsSection() {
  const indexRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState(-1);

  useIndexReveal(indexRef, setOpenIndex);

  return (
    <section className="careers-reasons core-values" ref={indexRef} aria-labelledby="careers-reasons-title">
      <LineReveal as="h2" id="careers-reasons-title" className="core-values-title cta-medium">
        (Why join us)
      </LineReveal>

      <ol className="values-index">
        {REASONS.map((reason, i) => {
          const number = String(i + 1).padStart(2, "0");
          const isOpen = i === openIndex;
          return (
            <li className={`values-index-item${isOpen ? " is-open" : ""}`} key={reason.title}>
              <span className="values-index-rule" aria-hidden="true" />
              <h3 className="values-index-heading">
                <button
                  type="button"
                  className="values-index-toggle"
                  aria-expanded={isOpen}
                  aria-controls={`careers-reason-${i}`}
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                >
                  <span className="values-index-number cta-medium">
                    <span>{number}</span>
                  </span>
                  <LineReveal as="span" className="values-index-title header-1" delay={0.3}>
                    {reason.title}
                  </LineReveal>
                  {/* A + whose upright turns flat into a − as the row opens. */}
                  <span className="values-index-sign cta-medium" aria-hidden="true">
                    <span>
                      (<span className="values-index-plus" />)
                    </span>
                  </span>
                </button>
              </h3>
              <div className="values-index-panel" id={`careers-reason-${i}`} inert={!isOpen}>
                <div className="values-index-panel-inner">
                  <div className="values-index-body">
                    <p className="values-index-text body">{reason.description}</p>
                    <span className="values-index-big display-header-2" aria-hidden="true">
                      {number}.
                    </span>
                  </div>
                </div>
              </div>
              {i === REASONS.length - 1 && <span className="values-index-rule" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
