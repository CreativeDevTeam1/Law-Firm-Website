"use client";

import { Fragment, useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import { gsap } from "gsap";

/** Seconds the curtain stays down, at least, with the firm's name on it. */
const HOLD = 0.5;
/** Seconds to wait for a new page before loading it the ordinary way. */
const GIVE_UP = 8;

type Phase = "idle" | "covering" | "waiting" | "lifting";

// Page change curtain, as on sunnybonnell.com: a dark panel wipes up over
// the old page, then wipes off upwards to show the new one. The firm's name
// rises in on the curtain line by line, set as in the opening loader
// (intro.tsx), and rises out as the curtain lifts.
//
//   0–1s      the curtain wipes up over the old page, which dims to 70%
//   1s        the new page is asked for, out of sight
//   1–1.5s    held (for longer if the new page takes longer)
//   1.5–2.5s  the curtain wipes off upwards; the new page brightens back
//
// It's a real element animated with GSAP, not the browser's View Transition
// API, which plays differently in each browser: Firefox showed the name
// before the curtain, and WebKit crashed. The name is inside the panel, so
// the panel's clip means it can't show before the panel does.
//
// A click on a link to another page is caught before Next.js sees it, and
// the page only changes once the screen is covered. A page change that
// wasn't a click (back and forward) has happened by the time it's noticed,
// so the curtain starts down and just lifts. Visitors who prefer reduced
// motion get neither: the page just changes.
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const lenis = useLenis();
  const curtainRef = useRef<HTMLDivElement>(null);
  const shownPath = useRef(pathname);
  const phase = useRef<Phase>("idle");
  const coveredAt = useRef(0);
  const giveUp = useRef<ReturnType<typeof setTimeout>>(undefined);
  const timeline = useRef<gsap.core.Timeline>(undefined);

  // Next.js moves the new page to the top (or the browser restores the
  // position on back/forward) in a layout effect further down the tree,
  // which runs before this one. If Lenis was still gliding from a scroll on
  // the old page, it would carry on towards that old target and drag the
  // new page down with it, so its animation is stopped and it takes the
  // new position as its own.
  useLayoutEffect(() => {
    if (!lenis || lenis.isStopped) return;
    lenis.resize();
    // Stopping and starting resets it: no glide, and its target is the
    // current position.
    lenis.stop();
    lenis.start();
  }, [lenis, pathname]);

  // The new page has arrived: lift the curtain.
  useLayoutEffect(() => {
    if (pathname === shownPath.current) return;
    shownPath.current = pathname;

    const curtain = curtainRef.current;
    if (!curtain || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const panel = curtain.querySelector(".page-curtain-panel");
    const dim = curtain.querySelector(".page-curtain-dim");
    const lines = curtain.querySelectorAll(".page-curtain-text");

    // Not from a click, or a click cut short: down at once, before this paints.
    const wasCovered = phase.current === "waiting";
    clearTimeout(giveUp.current);
    timeline.current?.kill();
    gsap.set(curtain, { visibility: "visible", pointerEvents: "auto" });
    gsap.set(panel, { clipPath: "inset(0% 0% 0% 0%)" });
    gsap.set(dim, { opacity: 0.3 });
    gsap.set(lines, { yPercent: 0 });

    phase.current = "lifting";
    const held = (performance.now() - coveredAt.current) / 1000;
    timeline.current = gsap
      .timeline({
        delay: wasCovered ? Math.max(0, HOLD - held) : HOLD,
        onStart: () => {
          lenis?.resize();
          lenis?.start();
        },
        onComplete: () => {
          gsap.set(curtain, { clearProps: "visibility,pointerEvents" });
          phase.current = "idle";
        },
      })
      .to(lines, { yPercent: -100, duration: 0.5, ease: "power3.in" }, 0)
      .fromTo(
        panel,
        { clipPath: "inset(0% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: "power4.inOut" },
        0,
      )
      .to(dim, { opacity: 0, duration: 1, ease: "power1.inOut" }, 0);
  }, [pathname, lenis]);

  // A click on a link to another page: cover the screen, then go there.
  useEffect(() => {
    const curtain = curtainRef.current;
    if (!curtain) return;

    const panel = curtain.querySelector(".page-curtain-panel");
    const dim = curtain.querySelector(".page-curtain-dim");
    const lines = curtain.querySelectorAll(".page-curtain-text");

    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      if (link.hasAttribute("download") || (link.target && link.target !== "_self")) return;

      const url = new URL(link.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Stops next/link, which leaves a click that's already been handled.
      event.preventDefault();
      if (phase.current !== "idle") return;

      const href = url.pathname + url.search + url.hash;
      phase.current = "covering";
      lenis?.stop();
      gsap.set(curtain, { visibility: "visible", pointerEvents: "auto" });
      timeline.current = gsap
        .timeline({
          onComplete: () => {
            phase.current = "waiting";
            coveredAt.current = performance.now();
            giveUp.current = setTimeout(() => window.location.assign(href), GIVE_UP * 1000);
            router.push(href);
          },
        })
        .fromTo(
          panel,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power3.inOut" },
          0,
        )
        .fromTo(dim, { opacity: 0 }, { opacity: 0.3, duration: 0.8, ease: "power3.inOut" }, 0)
        // The first line starts once the curtain has passed it.
        .fromTo(lines, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: "power4.out", stagger: 0.1 }, 0.55);
    };

    // Capture: before React's handlers, so next/link sees it's been handled.
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [router, lenis]);

  useEffect(
    () => () => {
      clearTimeout(giveUp.current);
      timeline.current?.kill();
    },
    [],
  );

  // Keyed by the path, so each page starts with a fresh navbar and footer
  // (a closed mobile menu, say), swapped while the curtain is down.
  return (
    <>
      <Fragment key={pathname}>{children}</Fragment>
      <div className="page-curtain" ref={curtainRef} aria-hidden="true">
        <div className="page-curtain-dim" />
        <div className="page-curtain-panel">
          <p className="page-curtain-line">
            <span className="page-curtain-text">Shady</span>
          </p>
          <p className="page-curtain-line">
            <span className="page-curtain-text">El-Barkoky</span>
          </p>
          <p className="page-curtain-line">
            <span className="page-curtain-text">Law Firm</span>
          </p>
        </div>
      </div>
    </>
  );
}
