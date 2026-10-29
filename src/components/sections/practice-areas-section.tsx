"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIndexReveal } from "@/hooks/use-index-reveal";
import SectionHeading from "@/components/ui/section-heading";
import ValuesIndex from "@/components/ui/values-index";
import type { AboutPage } from "@/content/types";
import { indexNumber } from "@/lib/format";

gsap.registerPlugin(ScrollTrigger, CustomEase);

type PracticeAreasSectionProps = { practiceAreas: AboutPage["practiceAreas"] };

// justgowiththeflow.com's "primary-ease" and reveal length, for the photo
// opening as it scrolls in; a swap between photos is quicker.
const REVEAL_EASE = CustomEase.create("practice-reveal", "0.62, 0.05, 0.01, 0.99");
const REVEAL_DURATION = 1.47;
const SWAP_DURATION = 1.1;

// How long the mouse and the page have to be still before the photo of the
// row under the pointer is shown, so rows passing under it while moving or
// scrolling don't each swap theirs in.
const HOVER_DELAY = 150; // ms

// About page "Practice area" — a split index, after Harvey's product list
// and Koto's services. The heading, then the areas as the same editorial
// index as the Core values above (values-index.tsx and use-index-reveal.ts):
// a row per area between hairline rules, with its number, title and a (+);
// clicking a row opens its description and closes the one before. The
// first opens as part of its reveal.
//
// From 1024px the index takes columns 6–12, as Core values, and a photo
// frame stays pinned in columns 1–4 beside it, showing the open area's
// photo (or, with a mouse, the area the pointer rests on) with its number
// under it. The frame opens once as it scrolls in (a cover in the section's
// colour shrinks up off it while the photo settles from 150% scale); each
// new photo then wipes up over the last while settling from 125%. Under
// 1024px there's no frame: an open row shows its photo above its
// description. With reduced motion the photos simply change.
export default function PracticeAreasSection({ practiceAreas: { heading, areas } }: PracticeAreasSectionProps) {
  const indexRef = useRef<HTMLOListElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const layerZ = useRef(1);
  const [openIndex, setOpenIndex] = useState(-1);
  const [hoverIndex, setHoverIndex] = useState(-1);

  useIndexReveal(indexRef, setOpenIndex);

  // With a mouse, the row the pointer rests on: once the mouse and the page
  // have both been still for HOVER_DELAY, the row under the pointer (or
  // none) is looked up. Scrolling moves rows under a still pointer without
  // reliable pointer events, so this asks the page rather than waiting on
  // each row's.
  useEffect(() => {
    const index = indexRef.current;
    if (!index) return;

    let pointer: { x: number; y: number } | null = null;
    let timer: number | undefined;

    const settle = () => {
      const row = pointer && document.elementFromPoint(pointer.x, pointer.y)?.closest(".values-index-item");
      setHoverIndex(row && index.contains(row) ? [...index.children].indexOf(row) : -1);
    };
    const schedule = () => {
      window.clearTimeout(timer);
      if (pointer) timer = window.setTimeout(settle, HOVER_DELAY);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer = { x: e.clientX, y: e.clientY };
      schedule();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", schedule);
    };
  }, []);

  // The frame's first opening.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({
          defaults: { ease: REVEAL_EASE, duration: REVEAL_DURATION },
          // Not once: true, which can crash ScrollTrigger (use-line-reveal.ts).
          scrollTrigger: { trigger: frame, start: "top 90%", toggleActions: "play none none none" },
        })
        .fromTo(frame.querySelector(".practice-frame-cover"), { scaleY: 1 }, { scaleY: 0 }, 0)
        .fromTo(frame.querySelector(".practice-frame-photos"), { scale: 1.5 }, { scale: 1 }, 0);
    });

    return () => mm.revert();
  }, []);

  const shownIndex = hoverIndex !== -1 ? hoverIndex : Math.max(openIndex, 0);

  // Brings the shown area's photo to the top of the frame, wiping it in
  // unless it's the first or motion is reduced.
  useEffect(() => {
    const layer = frameRef.current?.querySelectorAll<HTMLElement>(".practice-frame-photo")[shownIndex];
    if (!layer || layer.style.zIndex === String(layerZ.current)) return;

    const isFirst = layerZ.current === 1 && shownIndex === 0;
    layer.style.zIndex = String(++layerZ.current);
    if (isFirst || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.fromTo(
      layer,
      { clipPath: "inset(100% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: SWAP_DURATION, ease: REVEAL_EASE, overwrite: true },
    );
    gsap.fromTo(
      layer.firstElementChild,
      { scale: 1.25 },
      { scale: 1, duration: SWAP_DURATION, ease: REVEAL_EASE, overwrite: true },
    );
  }, [shownIndex]);

  return (
    <section className="practice-areas" aria-labelledby="practice-areas-title">
      <SectionHeading id="practice-areas-title" label={heading.label} className="practice-areas-heading">
        {heading.title}
      </SectionHeading>

      <div className="practice-areas-split" data-navbar-blend>
        <div className="practice-frame" aria-hidden="true">
          <div className="practice-frame-media" ref={frameRef}>
            <div className="practice-frame-photos">
              {areas.map((area) => (
                <div className="practice-frame-photo" key={area.title}>
                  {area.image && <Image src={area.image.src} alt="" fill sizes="40vw" />}
                </div>
              ))}
            </div>
            <div className="practice-frame-cover" />
          </div>
          <p className="practice-frame-caption cta-medium">
            <span className="practice-frame-count">{indexNumber(shownIndex)}</span>
            <span>/{String(areas.length).padStart(2, "0")}</span>
          </p>
        </div>

        <ValuesIndex
          ref={indexRef}
          items={areas}
          idPrefix="practice-area"
          openIndex={openIndex}
          onOpenChange={setOpenIndex}
          titleClassName="header-2-medium"
          className="practice-index"
          withPhotos
        />
      </div>
    </section>
  );
}
