"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MobileMenu from "@/components/layout/mobile-menu";
import TextLink from "@/components/ui/text-link";
import type { Link as NavLink } from "@/content/types";
import { whenIntroDone } from "@/lib/intro";

gsap.registerPlugin(ScrollTrigger);

type NavbarProps = {
  firmName: string;
  links: NavLink[];
  cta: NavLink;
};

// Whether a link's page is the one showing, or a page under it (a team
// member's page counts as Team, an article as News & Insight).
const isCurrentSection = (href: string, pathname: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

// Site navigation — Figma "Navigation" (Web) and "Mobile". Pinned over the
// top of the page, sliding away while scrolling down and back on scrolling
// up. On pages with an intro it waits off-screen and drops in once the
// intro finishes.
//
// Over the hero's photo the logo and links are light. Once the hero has
// scrolled up past them they turn dark, for the light sections below, and
// light again over the dark footer and over any section marked
// data-navbar-light (e.g. a full-screen photo). Over sections marked
// data-navbar-blend (half light, half photo) they're light and inverted
// against what's behind them. Pages without a hero are dark until the
// footer.
export default function Navbar({ firmName, links, cta }: NavbarProps) {
  const navbarRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const pathname = usePathname();
  const lenis = useLenis();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // While the menu is open: the page doesn't scroll, the bar and logo stay
  // light over it, and Escape or widening the screen to the full navbar
  // (1024px) closes it.
  useEffect(() => {
    const navbar = navbarRef.current;
    const logo = logoRef.current;
    if (!isMenuOpen || !navbar || !logo) return;

    lenis?.stop();
    navbar.classList.add("navbar-open");
    logo.classList.add("navbar-open");

    const close = () => setIsMenuOpen(false);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const wide = window.matchMedia("(min-width: 64rem)");
    document.addEventListener("keydown", onKeyDown);
    wide.addEventListener("change", close);

    return () => {
      lenis?.start();
      navbar.classList.remove("navbar-open");
      logo.classList.remove("navbar-open");
      document.removeEventListener("keydown", onKeyDown);
      wide.removeEventListener("change", close);
    };
  }, [isMenuOpen, lenis]);

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

  // Out of the way while reading: scrolling down slides the bar and logo up
  // off the screen, and scrolling back up (or reaching the top) brings them
  // back, so they never sit on top of a heading or photo for long. Small
  // scroll jitters are ignored. Keyboard focus inside them shows them too
  // (CSS :focus-within).
  useEffect(() => {
    const navbar = navbarRef.current;
    const logo = logoRef.current;
    if (!navbar || !logo) return;

    const TOLERANCE = 8;
    let anchor = window.scrollY;
    let hidden = false;
    const setHidden = (next: boolean) => {
      if (next === hidden) return;
      hidden = next;
      navbar.classList.toggle("navbar-hidden", next);
      logo.classList.toggle("navbar-hidden", next);
    };

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const scroll = self.scroll();
        // Always shown while the bar still overlaps where it started.
        if (scroll <= navbar.offsetHeight) {
          anchor = scroll;
          setHidden(false);
          return;
        }
        if (Math.abs(scroll - anchor) < TOLERANCE) return;
        setHidden(scroll > anchor);
        anchor = scroll;
      },
    });

    return () => {
      trigger.kill();
      navbar.classList.remove("navbar-hidden");
      logo.classList.remove("navbar-hidden");
    };
  }, [pathname]);

  useEffect(() => {
    const navbar = navbarRef.current;
    const logo = logoRef.current;
    if (!navbar || !logo) return;

    // Dark once past the hero (or throughout, without one), and light again
    // over the dark footer and data-navbar-light sections.
    let pastHero = false;
    let overFooter = false;
    const overLight = new Set<Element>();
    const overBlend = new Set<Element>();
    const update = () => {
      const blend = overBlend.size > 0;
      const dark = pastHero && !overFooter && overLight.size === 0 && !blend;
      navbar.classList.toggle("navbar-dark", dark);
      logo.classList.toggle("navbar-dark", dark);
      navbar.classList.toggle("navbar-blend", blend);
      logo.classList.toggle("navbar-blend", blend);
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

    // Light (or blended) while the bar's middle is anywhere over a marked
    // section. These sit mid-page, so unlike the footer they can be
    // scrolled past.
    const sectionTriggers = (
      [
        ["[data-navbar-light]", overLight],
        ["[data-navbar-blend]", overBlend],
      ] as const
    ).flatMap(([selector, over]) =>
      Array.from(document.querySelectorAll(selector), (section) => {
        const trigger = ScrollTrigger.create({
          trigger: section,
          start: () => `top ${middle()}`,
          end: () => `bottom ${middle()}`,
          onToggle: (self) => {
            if (self.isActive) over.add(section);
            else over.delete(section);
            update();
          },
        });
        if (trigger.isActive) over.add(section);
        return trigger;
      }),
    );
    update();

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      sectionTriggers.forEach((trigger) => trigger.kill());
      navbar.classList.remove("navbar-dark", "navbar-blend");
      logo.classList.remove("navbar-dark", "navbar-blend");
    };
  }, [pathname]);

  return (
    <>
      <Link
        ref={logoRef}
        href="/"
        className="navbar-logo"
        aria-label={`${firmName}, home`}
      >
        <span className="navbar-logo-full" />
        <span className="navbar-logo-short" />
      </Link>

      <header ref={navbarRef} className="navbar">
        <nav className="navbar-menu" aria-label="Main">
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <TextLink href={link.href} aria-current={isCurrentSection(link.href, pathname) ? "page" : undefined}>
                  {link.label}
                </TextLink>
              </li>
            ))}
          </ul>
        </nav>

        <TextLink href={cta.href} icon="arrow-up-right" className="navbar-cta">
          {cta.label}
        </TextLink>

        {/* "Menu" and "Close" are stacked; opening slides "Close" up into place. */}
        <button
          type="button"
          className={`navbar-menu-button cta-small${isMenuOpen ? " is-open" : ""}`}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="navbar-menu-label" aria-hidden="true">
            <span>Menu</span>
            <span>Close</span>
          </span>
          {/* Three lines (as menu.svg) that turn into an X while open. */}
          <span className="navbar-menu-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </header>

      <MobileMenu
        id="mobile-menu"
        links={links}
        cta={cta}
        pathname={pathname}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}
