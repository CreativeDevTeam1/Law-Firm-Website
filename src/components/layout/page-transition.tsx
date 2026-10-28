"use client";

import { useLayoutEffect, ViewTransition } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

// Page change curtain, as on sunnybonnell.com: a dark panel wipes up over
// the old page, then wipes off upwards to show the new one. The firm's name
// rises in on the curtain line by line, set as in the opening loader
// (intro.tsx), and rises out as the curtain lifts.
//
// Runs on the browser's View Transition API through React's <ViewTransition>.
// Both boundaries are keyed by the path, so each navigation swaps them out:
// the old page leaves as "page-old", the new one arrives as "page-new", and
// an empty full-screen element arrives as "page-curtain" for the curtain to
// be drawn on. globals.css times the three. (The page has to sit inside a
// boundary: React hides the root snapshot when nothing outside one changes.)
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenis = useLenis();

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

  return (
    <>
      <ViewTransition key={`page:${pathname}`} enter="page-new" exit="page-old" default="none">
        {children}
      </ViewTransition>
      <ViewTransition key={`curtain:${pathname}`} enter="page-curtain" exit="none" default="none">
        <div className="page-curtain" aria-hidden="true">
          <p className="page-curtain-text">Shady</p>
          <p className="page-curtain-text">El-Barkoky</p>
          <p className="page-curtain-text">Law Firm</p>
        </div>
      </ViewTransition>
    </>
  );
}
