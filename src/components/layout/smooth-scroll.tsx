"use client";

import { useEffect, useRef } from "react";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Site-wide Lenis smooth scrolling. GSAP's ticker drives Lenis (instead of
// Lenis running its own requestAnimationFrame loop), so scroll and GSAP
// animations update on the same frame and ScrollTrigger stays in sync.
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useLenis(ScrollTrigger.update);

  useEffect(() => {
    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000); // GSAP time is in seconds
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  // ScrollTrigger measures where things sit on the page once, and on its own
  // only measures again when the window resizes or the page loads. Content
  // that arrives or changes size later (streamed sections, photos, a page
  // change) moves everything below it, which left the navbar switching colour
  // far from where sections really start. So measure again whenever the
  // page's height changes, once it settles. The height after each refresh is
  // the new baseline, so the space pinned sections add doesn't set it off
  // again.
  useEffect(() => {
    const body = document.body;
    let height = body.offsetHeight;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const onRefresh = () => {
      height = body.offsetHeight;
    };
    const observer = new ResizeObserver(() => {
      if (body.offsetHeight === height) return;
      height = body.offsetHeight;
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 150);
    });

    ScrollTrigger.addEventListener("refresh", onRefresh);
    observer.observe(body);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      ScrollTrigger.removeEventListener("refresh", onRefresh);
    };
  }, []);

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      {children}
    </ReactLenis>
  );
}
