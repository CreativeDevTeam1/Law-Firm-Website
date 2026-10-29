"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LineReveal from "@/components/ui/line-reveal";
import TeamsCard from "@/components/cards/teams-card";
import TextLink from "@/components/ui/text-link";
import type { HomePage } from "@/content/types";

gsap.registerPlugin(ScrollTrigger);

type FoundersSectionProps = { partners: HomePage["partners"] };

// Home page "Partners Behind the Firm" — Figma "founders-section".
//
// From 1024px it plays like sunnybonnell.com's keynote cards: the heading
// pins to the screen, the founder cards slide up over it one at a time
// (each pinned in its own screen-tall slot) and settle into a fanned stack,
// then fly into a row of four as the row's spot scrolls in. The row's spot
// is held by invisible copies of the cards (.founders-targets), so each card
// knows exactly where to land. On phones, and without motion, the cards are
// a plain grid.
export default function FoundersSection({ partners: { titleLines, link, members } }: FoundersSectionProps) {
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 64rem) and (prefers-reduced-motion: no-preference)", () => {
      const slots = gsap.utils.toArray<HTMLElement>(".founders-slot", stack);
      const frames = gsap.utils.toArray<HTMLElement>(".founders-frame", stack);
      const targets = gsap.utils.toArray<HTMLElement>(".founders-target .teams-card", stack.parentElement!);
      const cards = stack.querySelector(".founders-cards")!;
      const row = stack.parentElement!.querySelector(".founders-targets")!;

      // While stacked, cards are resized from their row size to fill the
      // screen between the navbar and an equal space at the bottom, less
      // room for the fan's 40px lift: bigger on tall screens, smaller on
      // short ones, never under the navbar.
      // Each card also takes its spot's height first: the spots in the row
      // are all as tall as the tallest card, so the cards land level (they
      // land by their centres) whichever names and roles wrap.
      let zoom = 1;
      const measureZoom = () => {
        frames.forEach((frame, i) => {
          frame.style.height = `${targets[i].offsetHeight}px`;
        });
        const navbar = document.querySelector<HTMLElement>(".navbar")?.offsetHeight ?? 0;
        zoom = (window.innerHeight - 2 * navbar - 80) / frames[0].offsetHeight;
      };

      // Fans the stack out as the cards scroll past: earlier cards shrink
      // and lift, later ones stay bigger and lower (the reference's 0.85 /
      // 0.9 / 0.95 and -40 / 0 / 40px, spread over however many cards).
      const fan = gsap.timeline({
        scrollTrigger: { trigger: cards, start: "top 80%", end: "bottom 80%", scrub: true },
      });
      slots.forEach((slot, i) => {
        const t = slots.length > 1 ? i / (slots.length - 1) : 1;
        fan.to(slot, { scale: 0.85 + 0.1 * t, y: -40 + 80 * t, ease: "none" }, 0.01 * i);
      });

      // Moves each card from its slot (p = 0, zoomed) onto its spot in the
      // row (p = 1, actual size). Measured every update, since the slots
      // are still scrolling while this plays.
      const place = (p: number) => {
        frames.forEach((frame, i) => {
          const from = slots[i].getBoundingClientRect();
          const to = targets[i].getBoundingClientRect();
          gsap.set(frame, {
            x: p * (to.left + to.width / 2 - (from.left + from.width / 2)),
            y: p * (to.top + to.height / 2 - (from.top + from.height / 2)),
            scale: gsap.utils.interpolate(zoom, 1, p),
          });
        });
      };

      const land = ScrollTrigger.create({
        trigger: row,
        start: "top bottom",
        end: "bottom 95%",
        onUpdate: (self) => {
          fan.progress(1 - self.progress);
          place(self.progress);
        },
        onRefreshInit: measureZoom,
        onRefresh: (self) => place(self.progress),
      });

      measureZoom();
      place(land.progress);

      return () => {
        fan.scrollTrigger?.kill();
        land.kill();
        frames.forEach((frame) => frame.style.removeProperty("height"));
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="founders" aria-labelledby="founders-title">
      <div className="founders-stack" ref={stackRef}>
        <div className="founders-head">
          {/* Each line is set in from the left by its own amount (founders-title-1, -2, -3). */}
          <h2 id="founders-title" className="founders-title display-header">
            {titleLines.map((line, i) => (
              <LineReveal
                as="span"
                className={`founders-title-line founders-title-${i + 1}`}
                delay={0.08 * i}
                key={i}
              >
                {line}
              </LineReveal>
            ))}
          </h2>
          <div className="founders-link">
            <TextLink href={link.href} size="medium" icon="arrow-right" reveal>
              {link.label}
            </TextLink>
          </div>
        </div>

        <div className="founders-cards">
          {members.map((member) => (
            <div className="founders-slot" key={member.slug}>
              <div className="founders-frame">
                <TeamsCard member={member} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Where the cards land (see above). Hidden copies, so they take up
          exactly the cards' size. */}
      <div className="founders-targets" aria-hidden="true" inert>
        {members.map((member) => (
          <div className="founders-target" key={member.slug}>
            <TeamsCard member={member} />
          </div>
        ))}
      </div>
    </section>
  );
}
