"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LineReveal from "@/components/ui/line-reveal";
import TextLink from "@/components/ui/text-link";
import type { HomePage } from "@/content/types";
import { useBatchReveal } from "@/hooks/use-batch-reveal";

gsap.registerPlugin(ScrollTrigger);

type ClientsSectionProps = { clients: HomePage["clients"] };

const CARD_COUNT = 8;

/** Seconds between one round of logo swaps and the next. */
const SWAP_INTERVAL = 4;
/** How many cards change logo in each round. */
const SWAP_COUNT = 4;

// Home page "(Our Clients)": a grid of CARD_COUNT logo cards. Once a row's
// top edge comes onto the screen, its cards slide up by their own height and
// fade in, one after another (as on sunnybonnell.com). Every few seconds
// some cards then fade their logo out and back in as a different client,
// so with more clients than cards they all rotate through.
export default function ClientsSection({ clients: { heading, link, clients } }: ClientsSectionProps) {
  const gridRef = useRef<HTMLUListElement>(null);
  useBatchReveal(gridRef, ".clients-card");

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || clients.length === 0) return;

    const logos = gsap.utils.toArray<HTMLElement>(".clients-card", grid).map((card) => card.querySelector("img")!);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const shown = Array.from({ length: CARD_COUNT }, (_, i) => i % clients.length);

      const swap = () => {
        const picked = gsap.utils.shuffle([...logos.keys()]).slice(0, SWAP_COUNT);

        picked.forEach((cardIndex) => {
          // Prefer a client that isn't on screen; with too few clients for
          // that, any other one (or the same one, if there's only one).
          const hidden = [...clients.keys()].filter((i) => !shown.includes(i));
          const others = [...clients.keys()].filter((i) => i !== shown[cardIndex]);
          const pool = hidden.length ? hidden : others.length ? others : [shown[cardIndex]];
          const next = gsap.utils.random(pool);
          shown[cardIndex] = next;

          const img = logos[cardIndex];
          gsap
            .timeline()
            .to(img, { autoAlpha: 0, duration: 0.5 })
            .call(() => {
              img.src = clients[next].logo.src;
              img.alt = clients[next].logo.alt;
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

      // Only runs while the grid is on screen.
      const visibility = ScrollTrigger.create({
        trigger: grid,
        start: "top bottom-=100",
        end: "bottom top+=100",
        onToggle: (self) => (self.isActive ? loop.restart(true) : loop.pause()),
      });

      return () => {
        visibility.kill();
        loop.kill();
      };
    });

    return () => mm.revert();
  }, [clients]);

  return (
    <section className="clients" aria-labelledby="clients-title">
      <div className="clients-heading">
        <LineReveal className="clients-label cta-medium">({heading.label})</LineReveal>
        <LineReveal as="h2" id="clients-title" className="clients-title header-1">
          {heading.title}
        </LineReveal>
      </div>

      <div className="clients-link">
        <TextLink href={link.href} size="medium" icon="arrow-right" reveal>
          {link.label}
        </TextLink>
      </div>

      {clients.length > 0 && (
        <ul className="clients-grid" ref={gridRef}>
          {Array.from({ length: CARD_COUNT }, (_, i) => {
            const client = clients[i % clients.length];
            return (
              <li className="clients-card" key={i}>
                <Image
                  className="clients-logo"
                  src={client.logo.src}
                  alt={client.logo.alt}
                  width={144}
                  height={144}
                  unoptimized
                />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
