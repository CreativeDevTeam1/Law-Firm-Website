"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Draws the dividers matching `selector` inside `ref` in from the left as
// each scrolls into view (the Team page's group dividers). Give them
// transform-origin: left center. With reduced motion they're simply shown.
//
//   useDividerReveal(directoryRef, ".team-group-divider");
export function useDividerReveal(ref: RefObject<HTMLElement | null>, selector: string) {
  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const dividers = gsap.utils.toArray<HTMLElement>(selector, container);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      dividers.forEach((divider) =>
        gsap.fromTo(
          divider,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.6,
            ease: "power4.inOut",
            // Not once: true, which can crash ScrollTrigger (use-line-reveal.ts).
            scrollTrigger: { trigger: divider, start: "top 90%", toggleActions: "play none none none" },
          },
        ),
      );
    });

    return () => mm.revert();
  }, [ref, selector]);
}
