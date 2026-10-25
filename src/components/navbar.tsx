"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextLink from "@/components/text-link";
import { whenIntroDone } from "@/lib/intro";

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/careers", label: "Careers" },
  { href: "/news", label: "News & Insight" },
];

// Site navigation — Figma "Navigation" (Web) and "Mobile". Pinned over the
// top of the page. On pages with an intro it waits off-screen and drops in
// once the intro finishes.
//
// Over the hero's dark photo the links are plain light text. Once the hero
// has scrolled up past them, they blend with the page like the logo, so they
// turn dark over light sections. Pages without a hero blend throughout.
//
// The logo is pinned on its own, outside the <header>: it blends with the
// page behind it, and an element inside the fixed header could only blend
// with the header itself.
export default function Navbar() {
  const navbarRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const navbar = navbarRef.current;
    const logo = logoRef.current;
    if (!navbar || !logo || !document.querySelector(".intro")) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Lift both above the screen by the navbar's height. Setting y and
      // yPercent explicitly stops GSAP reading the CSS hiding offset.
      gsap.set([navbar, logo], { yPercent: 0, y: -navbar.offsetHeight });
      const cancelWait = whenIntroDone(() => {
        gsap.to([navbar, logo], { y: 0, duration: 1.2, ease: "expo.out" });
      });

      return cancelWait;
    });

    return () => mm.revert();
  }, []);

  useEffect(() => {
    const navbar = navbarRef.current;
    if (!navbar) return;

    const hero = document.querySelector(".hero");
    if (!hero) {
      navbar.classList.add("navbar-blend");
      return () => navbar.classList.remove("navbar-blend");
    }

    // Switches when the hero's bottom edge reaches the middle of the bar.
    const trigger = ScrollTrigger.create({
      trigger: hero,
      start: () => `bottom ${navbar.offsetHeight / 2}px`,
      end: "max",
      onToggle: (self) => navbar.classList.toggle("navbar-blend", self.isActive),
    });

    return () => {
      trigger.kill();
      navbar.classList.remove("navbar-blend");
    };
  }, [pathname]);

  return (
    <>
      <Link
        ref={logoRef}
        href="/"
        className="navbar-logo"
        aria-label="Shady El-Barkoky Law Firm, home"
      >
        <span className="navbar-logo-full" />
        <span className="navbar-logo-short" />
      </Link>

      <header ref={navbarRef} className="navbar">
        <nav className="navbar-menu" aria-label="Main">
          <ul>
            {LINKS.map((link) => (
              <li key={link.href}>
                <TextLink href={link.href}>{link.label}</TextLink>
              </li>
            ))}
          </ul>
        </nav>

        <TextLink href="/contact" icon="arrow-up-right" className="navbar-cta">
          Let&apos;s Talk
        </TextLink>

        {/* The open menu isn't designed yet, so this button doesn't open anything. */}
        <button type="button" className="navbar-menu-button cta-small" aria-expanded="false">
          Menu
          <span className="navbar-icon navbar-icon-menu" aria-hidden="true" />
        </button>
      </header>
    </>
  );
}
