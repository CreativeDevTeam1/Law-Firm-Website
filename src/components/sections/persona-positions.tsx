"use client";

import { useRef } from "react";
import LineReveal from "@/components/ui/line-reveal";
import type { PastPosition } from "@/content/types";
import { useDividerReveal } from "@/hooks/use-divider-reveal";

type PersonaPositionsProps = { positions: PastPosition[] };

// The positions a member held before, on their page (persona-profile.tsx):
// "(Past Positions)" over a ledger of position, organization and period,
// each row's hairline drawing in as it scrolls into view. A member shows it
// with the "Show past positions" switch in the Studio.
export default function PersonaPositions({ positions }: PersonaPositionsProps) {
  const listRef = useRef<HTMLOListElement>(null);

  useDividerReveal(listRef, ".persona-position-rule");

  return (
    <section className="persona-positions" aria-labelledby="persona-positions-title">
      <LineReveal as="h2" id="persona-positions-title" className="persona-positions-label cta-medium">
        (Past Positions)
      </LineReveal>

      <ol className="persona-positions-list" ref={listRef}>
        {positions.map((position, i) => (
          <li className="persona-position" key={`${position.title}-${position.organization}-${i}`}>
            <span className="persona-position-rule" aria-hidden="true" />
            <LineReveal as="h3" className="persona-position-title header-3-semibold">
              {position.title}
            </LineReveal>
            <LineReveal className="persona-position-organization header-3-medium" delay={0.08}>
              {position.organization}
            </LineReveal>
            {position.period && (
              <LineReveal className="persona-position-period header-3-medium" delay={0.16}>
                {position.period}
              </LineReveal>
            )}
            {i === positions.length - 1 && (
              <span className="persona-position-rule persona-position-rule-end" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
