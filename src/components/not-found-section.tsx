"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import LineReveal from "@/components/line-reveal";
import TextLink from "@/components/text-link";

gsap.registerPlugin(CustomEase);

// justgowiththeflow.com's page-load ease and timings.
CustomEase.create("not-found-ease", "0.62, 0.05, 0.01, 0.99");
const DURATION = 1.47;
const STAGGER = 0.07;
/** Seconds between one figure of the "404" starting and the next. */
const CHAR_STAGGER = 0.1;

const CODE = "404";

// The figures, drawn for this page in the reference's wide, heavy style:
// 330 units tall, with the counters cut out (even-odd fill). The 0 is a
// wide stadium; the 4 has a straight diagonal and a crossbar that runs past
// the stem.
const FOUR = { width: 320, path: "M175 0H290V205H320V270H290V330H205V270H0V200ZM205 95V205H100Z" };
const ZERO = {
  width: 360,
  path: "M165 0H195A165 165 0 0 1 195 330H165A165 165 0 0 1 165 0ZM175 85H185A80 80 0 0 1 185 245H175A80 80 0 0 1 175 85Z",
};
const FIGURES = [FOUR, ZERO, FOUR];

// 404 page, as justgowiththeflow.com/404: a screen-wide "404" in the middle
// of the screen, with the message and a link home along the bottom (on
// phones, the message at the top and the "404" at the bottom). The figures
// of the "404" rise in one after another, then the message's lines, and the
// link follows a moment later. Visitors who prefer reduced motion see it all
// in place.
export default function NotFoundSection() {
  const codeRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const code = codeRef.current;
    if (!code) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(code, { visibility: "visible" });
      gsap.from(code.querySelectorAll(".not-found-char"), {
        yPercent: 100,
        duration: DURATION,
        ease: "not-found-ease",
        stagger: CHAR_STAGGER,
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <h1 ref={codeRef} id="not-found-title" className="not-found-code" aria-label={CODE}>
        {FIGURES.map((figure, i) => (
          <span className="not-found-char-mask" aria-hidden="true" key={i}>
            <svg className="not-found-char" viewBox={`0 0 ${figure.width} 330`}>
              <path d={figure.path} fillRule="evenodd" />
            </svg>
          </span>
        ))}
      </h1>

      <div className="not-found-text">
        <LineReveal
          className="not-found-message header-2-medium"
          play="load"
          delay={CHAR_STAGGER * (FIGURES.length - 1)}
          duration={DURATION}
          stagger={STAGGER}
          ease="not-found-ease"
        >
          Looks like you are lost. Navigate back to our homepage via the link.
        </LineReveal>
        <TextLink
          href="/"
          size="big"
          icon="arrow-right"
          className="not-found-link"
          reveal
          revealDelay={0.4}
          revealStart="top bottom"
        >
          To the homepage
        </TextLink>
      </div>
    </section>
  );
}
