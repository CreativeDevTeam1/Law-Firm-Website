"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LineReveal from "@/components/line-reveal";
import TextLink from "@/components/text-link";

gsap.registerPlugin(ScrollTrigger);

type Client = { name: string; logo: string };

// Every client logo. The grid shows the first CARD_COUNT and swaps the rest
// in over time, so add logos here to have more clients rotate through.
const CLIENTS: Client[] = [
  { name: "Al Ahly SC", logo: "/images/home-page/clients/logo-wrapper.svg" },
];

const CARD_COUNT = 8;

/** Seconds between one round of logo swaps and the next. */
const SWAP_INTERVAL = 4;
/** How many cards change logo in each round. */
const SWAP_COUNT = 4;

export default function ClientsSection() {
  const gridRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = gsap.utils.toArray<HTMLElement>(".clients-card", grid);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Once a row's top edge comes onto the screen, its cards slide up by
      // their own height and fade in, one after another (as on
      // sunnybonnell.com). The cards stay put until then, so the triggers
      // are measured from where they really sit.
      const reveal = ScrollTrigger.batch(cards, {
        start: "top bottom",
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { yPercent: 100, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, duration: 1.2, ease: "power3.out", stagger: 0.1 },
          ),
      });

      // Every few seconds some cards fade their logo out and back in as a
      // different client. Only runs while the grid is on screen.
      const logos = cards.map((card) => card.querySelector("img")!);
      const shown = Array.from({ length: CARD_COUNT }, (_, i) => i % CLIENTS.length);

      const swap = () => {
        const picked = gsap.utils.shuffle([...logos.keys()]).slice(0, SWAP_COUNT);

        picked.forEach((cardIndex) => {
          // Prefer a client that isn't on screen; with too few clients for
          // that, any other one (or the same one, if there's only one).
          const hidden = [...CLIENTS.keys()].filter((i) => !shown.includes(i));
          const others = [...CLIENTS.keys()].filter((i) => i !== shown[cardIndex]);
          const pool = hidden.length ? hidden : others.length ? others : [shown[cardIndex]];
          const next = gsap.utils.random(pool);
          shown[cardIndex] = next;

          const img = logos[cardIndex];
          gsap
            .timeline()
            .to(img, { autoAlpha: 0, duration: 0.5 })
            .call(() => {
              img.src = CLIENTS[next].logo;
              img.alt = CLIENTS[next].name;
            })
            .to(img, { autoAlpha: 1, duration: 0.5 });
        });
      };

      const loop = gsap
        .delayedCall(SWAP_INTERVAL, () => {
          swap();
          loop.restart(true);
        })
        .pause();

      const visibility = ScrollTrigger.create({
        trigger: grid,
        start: "top bottom-=100",
        end: "bottom top+=100",
        onToggle: (self) => (self.isActive ? loop.restart(true) : loop.pause()),
      });

      return () => {
        reveal.forEach((trigger) => trigger.kill());
        visibility.kill();
        loop.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="clients" aria-labelledby="clients-title">
      <div className="clients-heading">
        <LineReveal className="clients-label cta-medium">(Our Clients)</LineReveal>
        <LineReveal as="h2" id="clients-title" className="clients-title header-1">
          Proudly Representing Clients Across Diverse Industries
        </LineReveal>
      </div>

      <div className="clients-link">
        <TextLink href="/client-intake" size="medium" icon="arrow-right" reveal>
          Become one of our clients
        </TextLink>
      </div>

      <ul className="clients-grid" ref={gridRef}>
        {Array.from({ length: CARD_COUNT }, (_, i) => {
          const client = CLIENTS[i % CLIENTS.length];
          return (
            <li className="clients-card" key={i}>
              <Image
                className="clients-logo"
                src={client.logo}
                alt={client.name}
                width={144}
                height={144}
                unoptimized
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
