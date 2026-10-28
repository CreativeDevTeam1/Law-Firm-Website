"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ImageRevealProps = {
  src: string;
  /** Alt text for the image. Leave empty when it's only decorative. */
  alt?: string;
  className?: string;
};

// A full-screen image that opens up as it scrolls in — Figma "img-wrapper"
// (About page). It starts at Figma's size (columns 2–11, 547px tall) and
// grows to fill the screen by the time its top reaches the top of the
// screen. The section is a screen tall from the start and the image is only
// clipped smaller, so the page never changes height while it grows.
//
//   <ImageReveal src="/images/…" alt="…" />
export default function ImageReveal({ src, alt = "", className = "" }: ImageRevealProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        section,
        { "--image-reveal-progress": 0 },
        {
          "--image-reveal-progress": 1,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "top top", scrub: true },
        },
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <section className={`image-reveal ${className}`.trim()} ref={sectionRef} data-navbar-light>
      <div className="image-reveal-media">
        <Image src={src} alt={alt} fill sizes="100vw" />
      </div>
    </section>
  );
}
