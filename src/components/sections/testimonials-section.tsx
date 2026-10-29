"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import SectionHeading from "@/components/ui/section-heading";
import TestimonialCard from "@/components/cards/testimonial-card";
import type { HomePage } from "@/content/types";

type TestimonialsSectionProps = { testimonials: HomePage["testimonials"] };

/** Which way each row scrolls: -1 to the left, 1 to the right. */
const ROW_DIRECTIONS = [-1, 1];

/** How many times each row repeats the testimonials, so the loop never shows a gap. */
const SET_COUNT = 3;

// The marquee engine from sunnybonnell.com (its app.min.js, initMarquee).
const MARQUEE = {
  /** Seconds per loop for a set as wide as the screen, before speedMultiplier. */
  speed: 7,
  speedMultiplier: 1.5,
  normalSpeed: 1,
  /** How much scrolling speeds the rows up, and the most it can add. */
  scrollSpeedInfluence: 0.1,
  maxScrollBoost: 10,
  /** How much of the scroll boost is left after each frame. */
  scrollDecay: 0.9,
  /** How fast the speed eases toward its target each frame (phones: 0.2). */
  ease: 0.1,
  easeMobile: 0.2,
};

// Home page "Testimonials" — Figma "testimonials-section". The heading works
// like the News one; below, two rows of cards loop across the screen in
// opposite directions, like sunnybonnell.com's heading marquee, and speed
// up while the page is scrolled. Only the first set of the first row is
// read out to screen readers; the rest repeat it.
export default function TestimonialsSection({ testimonials: { heading, testimonials } }: TestimonialsSectionProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const rows = gsap.utils.toArray<HTMLElement>(".testimonials-row", grid);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Each set of cards slides left by its own width, over and over, so
      // the next set takes its place. Wider sets loop more slowly, keeping
      // the same pace at any card width. Starting halfway through the
      // (endless) repeats lets the right-moving row play backwards forever.
      const loops = rows.map((row) => {
        const sets = gsap.utils.toArray<HTMLElement>(".testimonials-set", row);
        const duration =
          MARQUEE.speed * (sets[0].offsetWidth / window.innerWidth) * MARQUEE.speedMultiplier;

        return gsap
          .to(sets, { xPercent: -100, repeat: -1, duration, ease: "none" })
          .totalProgress(0.5)
          .pause();
      });

      // Only runs while the rows are on screen (or within 100px of it).
      const visibility = new IntersectionObserver(
        ([entry]) => loops.forEach((loop) => (entry.isIntersecting ? loop.play() : loop.pause())),
        { rootMargin: "100px 0px", threshold: 0.01 },
      );
      visibility.observe(grid);

      // Scrolling speeds the rows up by a tenth of the scroll speed (in px
      // per frame, at most 10 times faster), and that boost fades out.
      let scrollSpeed = 0;
      let lastY = window.scrollY;
      let lastTime = performance.now();

      const onScroll = () => {
        const y = window.scrollY;
        const now = performance.now();
        const elapsed = now - lastTime;
        if (elapsed > 0) scrollSpeed = (16.67 * Math.abs(y - lastY)) / elapsed;
        lastY = y;
        lastTime = now;
      };

      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      let speed = MARQUEE.normalSpeed;

      const tick = () => {
        let target = MARQUEE.normalSpeed;
        if (scrollSpeed > 0.1) {
          target += Math.min(scrollSpeed * MARQUEE.scrollSpeedInfluence, MARQUEE.maxScrollBoost);
          scrollSpeed *= MARQUEE.scrollDecay;
        }

        const ease = (isTouch ? MARQUEE.easeMobile : MARQUEE.ease) * gsap.ticker.deltaRatio(60);
        speed = gsap.utils.interpolate(speed, target, ease);
        loops.forEach((loop, i) => loop.timeScale(-ROW_DIRECTIONS[i] * speed));
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      gsap.ticker.add(tick);

      return () => {
        visibility.disconnect();
        window.removeEventListener("scroll", onScroll);
        gsap.ticker.remove(tick);
        loops.forEach((loop) => loop.kill());
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="testimonials" aria-labelledby="testimonials-title">
      <SectionHeading id="testimonials-title" label={heading.label} className="testimonials-heading">
        {heading.title}
      </SectionHeading>

      <div className="testimonials-grid" ref={gridRef}>
        {ROW_DIRECTIONS.map((_, row) => (
          <div className="testimonials-row" key={row} aria-hidden={row > 0 || undefined}>
            {Array.from({ length: SET_COUNT }, (_, set) => (
              <div
                className="testimonials-set"
                key={set}
                aria-hidden={(row === 0 && set > 0) || undefined}
              >
                {testimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.name} testimonial={testimonial} />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
