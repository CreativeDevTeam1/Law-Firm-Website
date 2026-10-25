"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { completeIntro, hasIntroPlayed } from "@/lib/intro";

gsap.registerPlugin(SplitText);

const EASE = "expo.inOut";
const PHASE = 1.8; // seconds for each of the two opening phases

// Opening loader for the home page. The firm's name is set in large type,
// split around the middle of the screen. The name lines rise in, the two
// halves part, and the hero opens out from a small window between them to
// fill the screen, covering the name. The hero headline reveal then plays.
//
// The hero section is the element marked data-intro-target; its photo is
// data-intro-image. Plays once per visit, and not for visitors who prefer
// reduced motion.
export default function Intro() {
  const [isActive, setIsActive] = useState(() => !hasIntroPlayed());
  const rootRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // Lock scrolling while the intro plays.
  useEffect(() => {
    if (!lenis) return;
    if (isActive) lenis.stop();
    else lenis.start();
  }, [lenis, isActive]);

  useEffect(() => {
    const root = rootRef.current;
    const hero = document.querySelector<HTMLElement>("[data-intro-target]");
    const image = hero?.querySelector<HTMLElement>("[data-intro-image]");

    if (
      !isActive ||
      !root ||
      !hero ||
      !image ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      completeIntro();
      setIsActive(false);
      return;
    }

    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const top = root.querySelector(".intro-top");
    const bottom = root.querySelector(".intro-bottom");
    const windowMarker = root.querySelector<HTMLElement>(".intro-window")!;
    let timeline: gsap.core.Timeline | undefined;
    let isCancelled = false;

    // Clip-path insets that leave only a given rectangle of the hero visible.
    const clipTo = (rect: { top: number; right: number; bottom: number; left: number }) => {
      const box = hero.getBoundingClientRect();
      return `inset(${rect.top - box.top}px ${box.right - rect.right}px ${box.bottom - rect.bottom}px ${rect.left - box.left}px)`;
    };

    const start = async () => {
      // Wait for the fonts (so the name splits correctly) and the photo,
      // but never more than 3 seconds.
      const photo = image instanceof HTMLImageElement ? image.decode().catch(() => {}) : null;
      await Promise.race([
        Promise.all([document.fonts.ready, photo]),
        new Promise((resolve) => setTimeout(resolve, 3000)),
      ]);
      if (isCancelled) return;

      const split = SplitText.create(root.querySelectorAll(".intro-text"), {
        type: "lines",
        mask: "lines",
      });
      gsap.set(root, { visibility: "visible" });

      const win = windowMarker.getBoundingClientRect();
      const centerX = win.left + win.width / 2;
      const centerY = win.top + win.height / 2;
      const seam = clipTo({ top: centerY, right: centerX, bottom: centerY, left: centerX });
      const windowClip = clipTo(win);
      const fullClip = "inset(0px 0px 0px 0px)";

      gsap.set(hero, { clipPath: seam });
      gsap.set(image, { transformOrigin: `50% ${centerY - hero.getBoundingClientRect().top}px` });

      timeline = gsap
        .timeline({
          defaults: { ease: EASE, duration: PHASE },
          onComplete: () => {
            split.revert();
            setIsActive(false);
          },
        })
        // 1. The name rises in, line by line.
        .from(split.lines, { yPercent: 100, duration: 1, ease: "power4.out", stagger: 0.1 })
        // 2. The halves part and the hero opens into the window between them.
        .addLabel("open", "+=0.3")
        .to(top, { yPercent: -100 }, "open")
        .to(bottom, { yPercent: 100 }, "open")
        .fromTo(hero, { clipPath: seam }, { clipPath: windowClip }, "open")
        .fromTo(image, { scale: 0.35 }, { scale: 0.7 }, "open")
        // 3. The window grows to fill the screen, covering the name.
        // Explicit start: the browser reports a clip with equal sides in
        // short form (3 values), which GSAP would pair up wrongly. Not
        // rendered up front, or the window would show before step 2.
        .addLabel("fill")
        .fromTo(
          hero,
          { clipPath: windowClip },
          { clipPath: fullClip, immediateRender: false },
          "fill",
        )
        .to(image, { scale: 1 }, "fill")
        // Let the hero headline start while the window settles.
        .call(completeIntro, [], `fill+=${PHASE - 0.6}`);
    };

    start();

    return () => {
      isCancelled = true;
      timeline?.kill();
      gsap.set([hero, image], { clearProps: "clipPath,transform,transformOrigin" });
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div ref={rootRef} className="intro" aria-hidden="true">
      <div className="intro-top">
        <p className="intro-text">Shady</p>
        <p className="intro-text">El-Barkoky</p>
      </div>
      <div className="intro-window" />
      <div className="intro-bottom">
        <p className="intro-text">Law Firm</p>
      </div>
    </div>
  );
}
