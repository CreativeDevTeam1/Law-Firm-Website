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

// Where the row scrolls to for each value (its start lined up with the
// text), capped at the end of the row.
const positionsOf = (list: HTMLElement) => {
  const values = Array.from(list.children) as HTMLElement[];
  const start = values[0].offsetLeft;
  const max = list.scrollWidth - list.clientWidth;
  return values.map((value) => Math.min(value.offsetLeft - start, max));
};

// The value whose position is nearest a scroll position.
const nearestIndex = (list: HTMLElement, scroll: number) => {
  const positions = positionsOf(list);
  return positions.reduce(
    (nearest, position, i) =>
      Math.abs(position - scroll) < Math.abs(positions[nearest] - scroll) ? i : nearest,
    0,
  );
};

// GSAP animates the scroll rather than the browser's smooth scrolling, which
// some browsers skip; snapping is paused meanwhile so it can't pull the row
// back partway.
const slideTo = (list: HTMLElement, index: number) => {
  const positions = positionsOf(list);
  const target = positions[Math.max(0, Math.min(positions.length - 1, index))];

  gsap.killTweensOf(list);
  list.style.scrollSnapType = "none";
  gsap.to(list, {
    scrollLeft: target,
    duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.8,
    ease: "power3.out",
    onComplete: () => list.style.removeProperty("scroll-snap-type"),
  });
};

// About page "Who we are" — Figma "who-we-are-section". The heading, then the
// firm's mission and vision, each with its label set into the first line
// (like the home page headings). Below, the core values sit in a row that
// scrolls sideways when they don't all fit: swiped on touch screens,
// dragged with a mouse, or (from 1024px) moved one value at a time by the
// arrow buttons, which switch off at either end.
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

  // Mouse dragging (touch screens already swipe the row natively). The row
  // follows the pointer; on release it carries on the way it was thrown and
  // settles on the nearest value, as the arrows do.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    let drag: { id: number; x: number; scroll: number; moved: boolean } | null = null;
    let samples: { x: number; t: number }[] = [];

    const down = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      gsap.killTweensOf(list);
      list.style.scrollSnapType = "none";
      drag = { id: event.pointerId, x: event.clientX, scroll: list.scrollLeft, moved: false };
      samples = [{ x: event.clientX, t: event.timeStamp }];
    };

    const move = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x;
      // A few pixels of slack so a plain click (or selecting text) isn't a drag.
      if (!drag.moved && Math.abs(dx) < 4) return;
      if (!drag.moved) {
        drag.moved = true;
        list.setPointerCapture(drag.id);
        list.classList.add("is-dragging");
      }
      list.scrollLeft = drag.scroll - dx;
      samples = [...samples, { x: event.clientX, t: event.timeStamp }].filter(
        (sample) => event.timeStamp - sample.t < 100,
      );
    };

    const up = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) return;
      const { moved } = drag;
      drag = null;
      list.classList.remove("is-dragging");
      if (!moved) {
        list.style.removeProperty("scroll-snap-type");
        return;
      }

      // Pixels per millisecond over the last tenth of a second, thrown on for
      // a quarter of a second's worth before settling.
      const first = samples[0];
      const last = samples[samples.length - 1];
      const velocity = last && first && last.t > first.t ? (last.x - first.x) / (last.t - first.t) : 0;
      slideTo(list, nearestIndex(list, list.scrollLeft - velocity * 250));
    };

    list.addEventListener("pointerdown", down);
    list.addEventListener("pointermove", move);
    list.addEventListener("pointerup", up);
    list.addEventListener("pointercancel", up);
    // No native drag of a selection or image out of the row.
    const noNativeDrag = (event: DragEvent) => event.preventDefault();
    list.addEventListener("dragstart", noNativeDrag);

    return () => {
      list.removeEventListener("pointerdown", down);
      list.removeEventListener("pointermove", move);
      list.removeEventListener("pointerup", up);
      list.removeEventListener("pointercancel", up);
      list.removeEventListener("dragstart", noNativeDrag);
    };
  }, []);

  // Slides to the previous or next value: from the value nearest the row's
  // start, one step back or forward, stopping at either end.
  const step = (direction: -1 | 1) => {
    const list = listRef.current;
    if (!list) return;
    slideTo(list, nearestIndex(list, list.scrollLeft) + direction);
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
