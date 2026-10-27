"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import LineReveal from "@/components/line-reveal";
import SectionHeading from "@/components/section-heading";

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
// scrolls sideways when they don't all fit; the arrow buttons move it one
// value at a time and switch off at either end.
export default function WhoWeAreSection() {
  const listRef = useRef<HTMLUListElement>(null);
  const [canScroll, setCanScroll] = useState({ back: false, forward: false });

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const update = () =>
      setCanScroll({
        back: list.scrollLeft > 1,
        forward: list.scrollLeft + list.clientWidth < list.scrollWidth - 1,
      });

    update();
    list.addEventListener("scroll", update, { passive: true });
    const resize = new ResizeObserver(update);
    resize.observe(list);

    return () => {
      list.removeEventListener("scroll", update);
      resize.disconnect();
    };
  }, []);

  // Slides to the previous or next value: from the value nearest the row's
  // start, one step back or forward, stopping at either end. GSAP animates
  // the scroll rather than the browser's smooth scrolling, which some
  // browsers skip; snapping is paused meanwhile so it can't pull the row
  // back partway.
  const step = (direction: -1 | 1) => {
    const list = listRef.current;
    if (!list) return;

    const values = Array.from(list.children) as HTMLElement[];
    const start = values[0].offsetLeft;
    const max = list.scrollWidth - list.clientWidth;
    const positions = values.map((value) => Math.min(value.offsetLeft - start, max));
    const current = positions.reduce(
      (nearest, position, i) =>
        Math.abs(position - list.scrollLeft) < Math.abs(positions[nearest] - list.scrollLeft) ? i : nearest,
      0,
    );
    const target = positions[Math.max(0, Math.min(positions.length - 1, current + direction))];

    gsap.killTweensOf(list);
    list.style.scrollSnapType = "none";
    gsap.to(list, {
      scrollLeft: target,
      duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.8,
      ease: "power3.out",
      onComplete: () => list.style.removeProperty("scroll-snap-type"),
    });
  };

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

        <ul className="core-values-list" id="core-values-list" ref={listRef}>
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

        <div className="core-values-controls">
          <button
            type="button"
            className="core-values-button"
            aria-label="Previous value"
            aria-controls="core-values-list"
            disabled={!canScroll.back}
            onClick={() => step(-1)}
          >
            <span className="core-values-icon core-values-icon-back" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="core-values-button"
            aria-label="Next value"
            aria-controls="core-values-list"
            disabled={!canScroll.forward}
            onClick={() => step(1)}
          >
            <span className="core-values-icon core-values-icon-forward" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
