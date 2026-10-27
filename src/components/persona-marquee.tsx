"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Which way each row runs: 1 to the right, -1 to the left. */
const ROW_DIRECTIONS = [1, -1, 1];

/** Copies of the logo per row: enough to cover the widest screen with one to spare. */
const SET_COUNT = 3;

// wearemotto.com's founder page marquee (its main.js): a row loops once in
// 15 × (one copy's width ÷ the screen's width) seconds, a half that on
// screens under 991px and a quarter under 479px. Scrolling multiplies the
// speed by a fifth of the pixels scrolled that frame (at least 1, at most
// 10), with no easing. The asterisks spin a turn every 4 seconds (clockwise
// on rows running right), sped up by scrolling the same way.
const MARQUEE = { speed: 15, scrollDivisor: 5, maxBoost: 10, spin: 4 };

// The top of a team member's page, like wearemotto.com's founder pages
// (which loop the founder's name): the firm's full logo in three huge rows,
// each copy followed by a spinning asterisk, that loop sideways in turn
// (right, left, right). The block drifts down by half its height as the
// page scrolls, so the photo below rises over it. Decorative, so hidden
// from screen readers. With reduced motion it stands still.
export default function PersonaMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    const rows = gsap.utils.toArray<HTMLElement>(".persona-marquee-row", marquee);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const width = window.innerWidth;
      const pace = width < 479 ? 0.25 : width < 991 ? 0.5 : 1;

      // Each copy slides left by its own width, over and over; starting
      // halfway through lets the right-running rows play backwards forever.
      const loops = rows.map((row) => {
        const sets = gsap.utils.toArray<HTMLElement>(".persona-marquee-set", row);
        const duration = MARQUEE.speed * (sets[0].offsetWidth / width) * pace;
        return gsap
          .to(sets, { xPercent: -100, repeat: -1, duration, ease: "none" })
          .totalProgress(0.5)
          .pause();
      });

      const spins = rows.map((row, i) =>
        gsap
          .to(gsap.utils.toArray<HTMLElement>(".persona-marquee-star", row), {
            rotation: 360 * ROW_DIRECTIONS[i],
            repeat: -1,
            duration: MARQUEE.spin,
            ease: "none",
          })
          .pause(),
      );

      const visibility = new IntersectionObserver(([entry]) =>
        [...loops, ...spins].forEach((tween) => (entry.isIntersecting ? tween.play() : tween.pause())),
      );
      visibility.observe(marquee);

      let lastY = window.scrollY;
      const tick = () => {
        const y = window.scrollY;
        const boost = gsap.utils.clamp(1, MARQUEE.maxBoost, Math.abs(y - lastY) / MARQUEE.scrollDivisor);
        lastY = y;
        loops.forEach((loop, i) => loop.timeScale(-ROW_DIRECTIONS[i] * boost));
        spins.forEach((spin) => spin.timeScale(boost));
      };
      gsap.ticker.add(tick);

      gsap.fromTo(
        marquee,
        { yPercent: 0 },
        {
          yPercent: 50,
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            endTrigger: marquee,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      return () => {
        visibility.disconnect();
        gsap.ticker.remove(tick);
        [...loops, ...spins].forEach((tween) => tween.kill());
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="persona-marquee" ref={marqueeRef} aria-hidden="true">
      {ROW_DIRECTIONS.map((_, row) => (
        <div className="persona-marquee-row" key={row}>
          {Array.from({ length: SET_COUNT }, (_, set) => (
            <span className="persona-marquee-set" key={set}>
              <span className="persona-marquee-logo" />
              <span className="persona-marquee-star">
                <span />
              </span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
