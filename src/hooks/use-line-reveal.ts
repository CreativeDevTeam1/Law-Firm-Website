"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { whenIntroDone } from "@/lib/intro";

gsap.registerPlugin(ScrollTrigger, SplitText);

export type LineRevealOptions = {
  /**
   * "scroll" plays when the element scrolls into view; "load" plays as soon
   * as the page is ready (after the intro, on pages that have one).
   */
  play?: "scroll" | "load";
  /** Seconds to wait before the first line starts. */
  delay?: number;
  /** Seconds each line takes to slide in. */
  duration?: number;
  /** Seconds between one line starting and the next. */
  stagger?: number;
  ease?: string;
  /** ScrollTrigger start position, used when play is "scroll". */
  start?: string;
  /**
   * Runs once, as the last line settles into place (40% of its slide in),
   * so whatever goes with the text (a link's underline and arrow, say) can
   * follow it in. Never runs for visitors who prefer reduced motion.
   */
  onRevealed?: () => void;
};

export const LINE_REVEAL_DEFAULTS = {
  play: "scroll",
  delay: 0,
  duration: 1.2,
  stagger: 0.08,
  ease: "power4.out",
  start: "top 85%",
} satisfies Required<Omit<LineRevealOptions, "onRevealed">>;

// Splits an element's text into lines and slides each line up from behind a
// mask, once. autoSplit re-splits when the width or font changes so line
// breaks stay correct; after the reveal has played, a re-split just shows the
// text in place. Visitors who prefer reduced motion get no animation.
//
// The element needs the "line-reveal" class (hidden until split, see
// globals.css). Use the <LineReveal> component unless you need the hook on an
// element you render yourself.
export function useLineReveal(
  ref: RefObject<HTMLElement | null>,
  options: LineRevealOptions = {},
) {
  const { play, delay, duration, stagger, ease, start } = {
    ...LINE_REVEAL_DEFAULTS,
    ...options,
  };

  // Kept in a ref so a new callback each render doesn't re-split the text.
  const onRevealedRef = useRef(options.onRevealed);
  useEffect(() => {
    onRevealedRef.current = options.onRevealed;
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      let hasPlayed = false;
      let cancelWait = () => {};

      const split = SplitText.create(element, {
        type: "lines",
        mask: "lines",
        linesClass: "line-reveal-line",
        autoSplit: true,
        onSplit(self) {
          gsap.set(element, { visibility: "visible" });
          cancelWait();
          if (hasPlayed) return;

          // Not shown (display: none, e.g. a layout for another screen size):
          // wait for the re-split when it appears; a trigger made now would
          // count as passed and play out of sight.
          if (!element.getClientRects().length) return;

          const timeline = gsap.timeline({
            delay,
            paused: play === "load",
            onStart: () => {
              hasPlayed = true;
            },
            // Plays once but never kills itself: a once-trigger already passed
            // kills itself when another trigger refreshes it, and ScrollTrigger
            // then crashes ("curTrigger is undefined").
            scrollTrigger:
              play === "scroll"
                ? { trigger: element, start, toggleActions: "play none none none" }
                : undefined,
          });

          timeline
            .from(self.lines, { yPercent: 100, duration, ease, stagger })
            .call(() => onRevealedRef.current?.(), [], `-=${duration * 0.6}`);

          // "load" waits for the page intro (if there is one) to finish.
          if (play === "load") cancelWait = whenIntroDone(() => timeline.play());

          return timeline;
        },
      });

      return () => {
        cancelWait();
        split.revert();
      };
    });

    return () => mm.revert();
  }, [ref, play, delay, duration, stagger, ease, start]);
}
