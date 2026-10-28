"use client";

import { useEffect, type Dispatch, type RefObject, type SetStateAction } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Reveals an editorial index's rows (.values-index-item inside `ref`) as
// each scrolls in: its rule draws in from the left (as the Team page
// dividers), then its number and (+) rise out of their masks. The first
// row opens as part of its reveal, once its title is in, unless a row has
// been opened or closed already. With reduced motion it simply opens.
//
//   const [openIndex, setOpenIndex] = useState(-1);
//   useIndexReveal(indexRef, setOpenIndex);
export function useIndexReveal(
  ref: RefObject<HTMLElement | null>,
  setOpenIndex: Dispatch<SetStateAction<number>>,
) {
  useEffect(() => {
    const index = ref.current;
    if (!index) return;

    const openFirst = () => setOpenIndex((open) => (open === -1 ? 0 : open));
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", openFirst);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>(".values-index-item", index).forEach((item, i) => {
        const reveal = gsap
          .timeline({
            // Not once: true, which can crash ScrollTrigger (use-line-reveal.ts).
            scrollTrigger: { trigger: item, start: "top 85%", toggleActions: "play none none none" },
          })
          .fromTo(
            item.querySelectorAll(".values-index-rule"),
            { scaleX: 0 },
            { scaleX: 1, duration: 1.6, ease: "power4.inOut" },
          )
          .fromTo(
            item.querySelectorAll(".values-index-number > span, .values-index-sign > span"),
            { yPercent: 110 },
            { yPercent: 0, duration: 1.2, ease: "power4.out", stagger: 0.08 },
            0.3,
          );
        if (i === 0) reveal.call(openFirst, [], 0.9);
      });
    });

    return () => mm.revert();
  }, [ref, setOpenIndex]);
}
