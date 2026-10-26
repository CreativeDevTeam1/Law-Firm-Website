"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LineReveal from "@/components/line-reveal";
import TeamsCard, { type TeamsCardProps } from "@/components/teams-card";
import TextLink from "@/components/text-link";

gsap.registerPlugin(ScrollTrigger);

// Names and roles are Figma's placeholders until the real ones arrive. The
// photo positions are Figma's crops.
const FOUNDERS: TeamsCardProps[] = [
  { name: "Shady el Barkoky", role: "16 May 2026", photo: "/images/home-page/founders/founder-1.png", photoPosition: "21% 0", href: "/team" },
  { name: "Shady el Barkoky", role: "16 May 2026", photo: "/images/home-page/founders/founder-2.png", photoPosition: "70% 0", href: "/team" },
  { name: "Shady el Barkoky", role: "16 May 2026", photo: "/images/home-page/founders/founder-3.png", photoPosition: "39% 0", href: "/team" },
  { name: "Shady el Barkoky", role: "16 May 2026", photo: "/images/home-page/founders/founder-4.png", photoPosition: "41% 0", href: "/team" },
];

// Home page "Partners Behind the Firm" — Figma "founders-section".
//
// From 1024px it plays like sunnybonnell.com's keynote cards: the heading
// pins to the screen, the founder cards slide up over it one at a time
// (each pinned in its own screen-tall slot) and settle into a fanned stack,
// then fly into a row of four as the row's spot scrolls in. The row's spot
// is held by invisible copies of the cards (.founders-targets), so each card
// knows exactly where to land. On phones, and without motion, the cards are
// a plain grid.
export default function FoundersSection() {
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
      let zoom = 1;
      const measureZoom = () => {
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
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="founders" aria-labelledby="founders-title">
      <div className="founders-stack" ref={stackRef}>
        <div className="founders-head">
          <h2 id="founders-title" className="founders-title display-header">
            <LineReveal as="span" className="founders-title-line founders-title-1">
              Partners
            </LineReveal>
            <LineReveal as="span" className="founders-title-line founders-title-2" delay={0.08}>
              Behind
            </LineReveal>
            <LineReveal as="span" className="founders-title-line founders-title-3" delay={0.16}>
              the Firm
            </LineReveal>
          </h2>
          <div className="founders-link">
            <TextLink href="/team" size="medium" icon="arrow-right" reveal>
              See the full team
            </TextLink>
          </div>
        </div>

        <div className="founders-cards">
          {FOUNDERS.map((founder, i) => (
            <div className="founders-slot" key={i}>
              <div className="founders-frame">
                <TeamsCard {...founder} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Where the cards land (see above). Hidden copies, so they take up
          exactly the cards' size. */}
      <div className="founders-targets" aria-hidden="true" inert>
        {FOUNDERS.map((founder, i) => (
          <div className="founders-target" key={i}>
            <TeamsCard {...founder} />
          </div>
        ))}
      </div>
    </section>
  );
}
