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
// Over the hero's photo the logo and links are light. Once the hero has
// scrolled up past them they turn dark, for the light sections below, and
// light again over the dark footer. Pages without a hero are dark until the
// footer.
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
    const logo = logoRef.current;
    if (!navbar || !logo) return;

    // Dark once past the hero (or throughout, without one), and light again
    // over the dark footer.
    let pastHero = false;
    let overFooter = false;
    const update = () => {
      const dark = pastHero && !overFooter;
      navbar.classList.toggle("navbar-dark", dark);
      logo.classList.toggle("navbar-dark", dark);
    };

    // Each switches when the element's edge reaches the middle of the bar,
    // and back only when scrolling up past it again. (A start-to-end range
    // would count the very bottom of the page as leaving it.)
    const middle = () => `${navbar.offsetHeight / 2}px`;
    const triggers: ScrollTrigger[] = [];

    const hero = document.querySelector(".hero");
    if (hero) {
      triggers.push(
        ScrollTrigger.create({
          trigger: hero,
          start: () => `bottom ${middle()}`,
          onEnter: () => {
            pastHero = true;
            update();
          },
          onLeaveBack: () => {
            pastHero = false;
            update();
          },
        }),
      );
    } else {
      pastHero = true;
    }

    const footer = document.querySelector(".footer");
    if (footer) {
      triggers.push(
        ScrollTrigger.create({
          trigger: footer,
          start: () => `top ${middle()}`,
          onEnter: () => {
            overFooter = true;
            update();
          },
          onLeaveBack: () => {
            overFooter = false;
            update();
          },
        }),
      );
    }

    // Loading or refreshing partway down the page doesn't fire onEnter.
    if (hero) pastHero = triggers[0].scroll() > triggers[0].start;
    if (footer) {
      const footerTrigger = triggers[triggers.length - 1];
      overFooter = footerTrigger.scroll() > footerTrigger.start;
    }
    update();

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      navbar.classList.remove("navbar-dark");
      logo.classList.remove("navbar-dark");
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
