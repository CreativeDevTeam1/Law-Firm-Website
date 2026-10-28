"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import TextLink from "@/components/ui/text-link";

type MobileMenuProps = {
  id: string;
  links: readonly { href: string; label: string }[];
  pathname: string;
  isOpen: boolean;
  onClose: () => void;
};

// Full-screen menu for screens under 1024px, opened by the navbar's Menu
// button. Movement copied from sunnybonnell.com's menu: the panel slides
// down from the top while its contents slide up from the bottom (1s,
// expo.out), so the links seem to stay put as the panel uncovers them; then
// each link rises out of its row, tilted 10° and straightening (0.9s,
// power3.out, 0.04s apart, after 0.1s). Closing reverses the panel only.
//
// A link to another page leaves the menu open: the page transition's
// curtain covers it, and the new page brings a fresh, closed navbar.
export default function MobileMenu({ id, links, pathname, isOpen, onClose }: MobileMenuProps) {
  const menuRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const isFirstRun = useRef(true);

  useEffect(() => {
    const menu = menuRef.current;
    const inner = innerRef.current;
    if (!menu || !inner) return;
    const items = menu.querySelectorAll(".mobile-menu-item-inner");

    if (isFirstRun.current) {
      isFirstRun.current = false;
      gsap.set(menu, { yPercent: -100 });
      gsap.set(inner, { yPercent: 100 });
      return;
    }

    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1;
    gsap.killTweensOf([menu, inner, ...items]);

    if (isOpen) {
      gsap.set(menu, { visibility: "visible" });
      gsap.to([menu, inner], { yPercent: 0, duration, ease: "expo.out" });
      if (duration) {
        gsap.fromTo(
          items,
          { y: "150%", rotation: 10 },
          { y: 0, rotation: 0, duration: 0.9, ease: "power3.out", stagger: 0.04, delay: 0.1 },
        );
      }
    } else {
      gsap.to(menu, {
        yPercent: -100,
        duration,
        ease: "expo.out",
        onComplete: () => gsap.set(menu, { visibility: "hidden" }),
      });
      gsap.to(inner, { yPercent: 100, duration, ease: "expo.out" });
    }
  }, [isOpen]);

  // Only a link to the page already showing closes the menu (see above).
  const closeIfCurrent = (href: string) => () => {
    if (href === pathname) onClose();
  };

  return (
    <nav
      ref={menuRef}
      id={id}
      className="mobile-menu"
      aria-label="Main"
      inert={!isOpen}
      data-lenis-prevent
    >
      <div ref={innerRef} className="mobile-menu-inner">
        <ul className="mobile-menu-list">
          {links.map((link) => (
            <li key={link.href} className="mobile-menu-item">
              <div className="mobile-menu-item-inner">
                <Link
                  href={link.href}
                  className="mobile-menu-link header-2-semibold"
                  aria-current={link.href === pathname ? "page" : undefined}
                  onClick={closeIfCurrent(link.href)}
                >
                  {link.label}
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <div className="mobile-menu-item mobile-menu-cta">
          <div className="mobile-menu-item-inner">
            <TextLink
              href="/client-intake"
              size="medium"
              icon="arrow-up-right"
              onClick={closeIfCurrent("/client-intake")}
            >
              Consult Us
            </TextLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
