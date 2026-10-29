"use client";

import { useRef, useState } from "react";
import { useIndexReveal } from "@/hooks/use-index-reveal";
import LineReveal from "@/components/ui/line-reveal";
import ValuesIndex from "@/components/ui/values-index";
import type { CareersPage } from "@/content/types";

type CareersReasonsSectionProps = { reasons: CareersPage["reasons"] };

// Careers page "(Why join us)", after the open positions — the About page's
// Core values index (values-index.tsx and use-index-reveal.ts): a row per
// reason between hairline rules, with its number, title and a (+).
// Clicking a row opens its description and its number in display type, and
// closes the one before; the first opens as part of its reveal. From 1024px
// the label sits in columns 1–5 and the index in 6–12, as on the About page.
export default function CareersReasonsSection({ reasons }: CareersReasonsSectionProps) {
  const indexRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState(-1);

  useIndexReveal(indexRef, setOpenIndex);

  return (
    <section className="careers-reasons core-values" ref={indexRef} aria-labelledby="careers-reasons-title">
      <LineReveal as="h2" id="careers-reasons-title" className="core-values-title cta-medium">
        ({reasons.label})
      </LineReveal>

      <ValuesIndex items={reasons.items} idPrefix="careers-reason" openIndex={openIndex} onOpenChange={setOpenIndex} />
    </section>
  );
}
