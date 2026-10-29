"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Slides the elements matching `selector` inside `ref` up and fades them in
// a few at a time as they scroll into view, as the cards do on the home
// page. `rise` is how far they start below, as a percentage of their own
// height, and `stagger` the seconds between one and the next. With reduced
// motion they're simply shown.
//
//   useBatchReveal(gridRef, ".news-card");
//   useBatchReveal(groupsRef, ".careers-role", { rise: 60, stagger: 0.08 });
export function useBatchReveal(
  ref: RefObject<HTMLElement | null>,
  selector: string,
  { rise = 100, stagger = 0.1 }: { rise?: number; stagger?: number } = {},
) {
  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const items = gsap.utils.toArray<HTMLElement>(selector, container);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const reveal = ScrollTrigger.batch(items, {
        start: "top bottom",
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { yPercent: rise, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, duration: 1.2, ease: "power3.out", stagger },
          ),
      });

      return () => reveal.forEach((trigger) => trigger.kill());
    });

    return () => mm.revert();
  }, [ref, selector, rise, stagger]);
}
