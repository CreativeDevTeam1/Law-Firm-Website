"use client";

import { useRef, useState } from "react";
import { useIndexReveal } from "@/hooks/use-index-reveal";
import LineReveal from "@/components/ui/line-reveal";
import SectionHeading from "@/components/ui/section-heading";

type CoreValue = { title: string; description: string };

const CORE_VALUES: CoreValue[] = [
  {
    title: "Integrity",
    description:
      "We act honestly, communicate clearly, and place professional responsibility at the centre of every engagement.",
  },
  {
    title: "Excellence",
    description:
      "We pursue quality through rigorous analysis, precise execution, and a continuous commitment to improving our practice.",
  },
  {
    title: "Confidentiality",
    description:
      "We safeguard the information entrusted to us and exercise discretion at every stage of a matter.",
  },
  {
    title: "Professionalism",
    description:
      "We bring discipline, respect, responsiveness, and sound judgment to every client relationship.",
  },
  {
    title: "Commitment",
    description:
      "We take ownership of our work and remain focused on the client’s objectives from instruction through resolution.",
  },
  {
    title: "Strategic Thinking",
    description:
      "We connect legal analysis with practical context to develop strategies that address immediate needs and longer-term consequences.",
  },
];

// About page "Who we are" — Figma "who-we-are-section". The heading, then the
// firm's mission and vision, each with its label set into the first line
// (like the home page headings). Below, the core values as an editorial
// index: a row per value between hairline rules, with its number, its
// title in large type and a (+). Each row reveals as it scrolls in: its
// rule draws in from the left (as the Team page dividers), then the
// number and the (+) rise out of their masks with the title's line reveal.
// Clicking or tapping a row opens it, showing its description and its
// number in display type, and closes the one before; clicking it again
// closes it. The first opens as part of its reveal, once its title is in,
// so its description and number animate in too. (Not on hover: opening
// changes the rows' heights, so the list would shift under the pointer.)
export default function WhoWeAreSection() {
  const indexRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState(-1);

  useIndexReveal(indexRef, setOpenIndex);

  return (
    <section className="who-we-are" aria-labelledby="who-we-are-title">
      <div className="who-we-are-intro">
        <SectionHeading id="who-we-are-title" label="(Who we are)" className="who-we-are-heading">
          We are an Egyptian law firm helping clients navigate complex legal
          and commercial decisions with clarity, discipline, and confidence.
        </SectionHeading>

        <SectionHeading
          as="p"
          labelAs="h3"
          label="(Our Mission)"
          titleClassName="header-2-semibold"
          labelClassName="header-4"
          className="who-we-are-statement"
        >
          To deliver clear, rigorous, and practical legal counsel that protects
          our clients’ interests and supports sound decisions.
        </SectionHeading>

        <SectionHeading
          as="p"
          labelAs="h3"
          label="(Our Vision)"
          titleClassName="header-2-semibold"
          labelClassName="header-4"
          className="who-we-are-statement"
        >
          To build a trusted Egyptian legal institution recognised for the
          quality of its judgment, the strength of its relationships, and the
          consistency of its service.
        </SectionHeading>
      </div>

      <div className="core-values" ref={indexRef}>
        <LineReveal as="h3" className="core-values-title cta-medium">
          (Our Core Values)
        </LineReveal>

        <ol className="values-index">
          {CORE_VALUES.map((value, i) => {
            const number = String(i + 1).padStart(2, "0");
            const isOpen = i === openIndex;
            return (
              <li className={`values-index-item${isOpen ? " is-open" : ""}`} key={value.title}>
                <span className="values-index-rule" aria-hidden="true" />
                <h4 className="values-index-heading">
                  <button
                    type="button"
                    className="values-index-toggle"
                    aria-expanded={isOpen}
                    aria-controls={`core-value-${i}`}
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  >
                    <span className="values-index-number cta-medium">
                      <span>{number}</span>
                    </span>
                    <LineReveal as="span" className="values-index-title header-1" delay={0.3}>
                      {value.title}
                    </LineReveal>
                    {/* A + whose upright turns flat into a − as the row opens. */}
                    <span className="values-index-sign cta-medium" aria-hidden="true">
                      <span>
                        (<span className="values-index-plus" />)
                      </span>
                    </span>
                  </button>
                </h4>
                <div className="values-index-panel" id={`core-value-${i}`} inert={!isOpen}>
                  <div className="values-index-panel-inner">
                    <div className="values-index-body">
                      <p className="values-index-text body">{value.description}</p>
                      <span className="values-index-big display-header-2" aria-hidden="true">
                        {number}.
                      </span>
                    </div>
                  </div>
                </div>
                {i === CORE_VALUES.length - 1 && <span className="values-index-rule" aria-hidden="true" />}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
