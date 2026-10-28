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
  /** Crop of the image (CSS object-position), e.g. "35% 50%". Default centred. */
  position?: string;
  className?: string;
};

// An image that opens up as it scrolls in — Figma "img-wrapper" (About
// page). From 1024px the section is a screen tall: the image starts at
// Figma's size (columns 2–11, 547px tall) and grows to fill the screen by
// the time its top reaches the top of the screen. Below 1024px the section
// is landscape instead (see globals.css): the image starts inside the page
// padding and runs to the screen edges by the time the whole section is in
// view. Either way it's only clipped smaller, so the page never changes
// height while it grows.
//
//   <ImageReveal src="/images/…" alt="…" position="35% 50%" />
export default function ImageReveal({ src, alt = "", position, className = "" }: ImageRevealProps) {
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
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            // A section shorter than the screen is fully open once it's all in view.
            end: () => (section.offsetHeight < window.innerHeight ? "bottom bottom" : "top top"),
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    });

    return () => mm.revert();
  }, []);

  // The image covers a box that can be much wider than it is tall, so it's
  // drawn wider than the screen: twice the screen's width is asked for.
  return (
    <section className={`image-reveal ${className}`.trim()} ref={sectionRef} data-navbar-light>
      <div className="image-reveal-media">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="200vw"
          style={position ? { objectPosition: position } : undefined}
        />
      </div>
    </section>
  );
}
