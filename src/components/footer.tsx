"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { useLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LineReveal from "@/components/line-reveal";
import TextLink from "@/components/text-link";

gsap.registerPlugin(ScrollTrigger);

const NAVIGATE = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
  { href: "/news", label: "News & Insight" },
  { href: "/contact", label: "Contact" },
];

// The firm's profile links aren't known yet.
const SOCIAL = [
  { href: "#", label: "LinkedIn" },
  { href: "#", label: "Instagram" },
];

const CONTACT = [
  { href: "mailto:info@shadyelbarkoky.com", label: "Info@shadyelbarkoky.com" },
  { href: "tel:+201066563089", label: "+20 1066563089" },
];

const LEGAL = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-use", label: "Terms of Use" },
  { href: "/faq", label: "FAQ" },
];

/** Seconds between one group's reveal and the next, and between links. */
const GROUP_STAGGER = 0.08;
const LINK_STAGGER = 0.04;

// Site footer — Figma "footter-section" (Web) and "footer-section" (Mobile).
// At least a screen tall, with the heading at the top and the links at the
// bottom.
//
// It's revealed like sunnybonnell.com's, at every screen size (the reference
// only does it on desktop): the dark footer scrolls up with the page as
// usual, but its content starts 30% of its height higher (hidden behind the
// page above, since the footer clips it) and settles into place as you
// scroll, over twice the height of the top block. So the content seems to
// rise out from under the page more slowly than the page itself.
//
// As they come into view, the divider draws in from the left and the
// texts slide up line by line, group after group. "Back to top" scrolls
// smoothly back up. Visitors who prefer reduced motion get none of this.
export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const inner = footer.querySelector<HTMLElement>(".footer-inner")!;
    const top = footer.querySelector<HTMLElement>(".footer-top")!;
    const divider = footer.querySelector<HTMLElement>(".footer-divider")!;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        divider,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.6,
          ease: "power4.inOut",
          // Not once: true, which can crash ScrollTrigger (use-line-reveal.ts).
          scrollTrigger: { trigger: divider, start: "top 90%", toggleActions: "play none none none" },
        },
      );

      gsap.fromTo(
        inner,
        { yPercent: -30 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: footer,
            start: "top bottom",
            end: () => `+=${2 * top.offsetHeight}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    });

    return () => mm.revert();
  }, []);

  const backToTop = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (lenis) lenis.scrollTo(0, { duration: reduce ? 0 : 1.6, immediate: reduce });
    else window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  // One group's links, revealed one after another after the group's title.
  const links = (items: { href: string; label: string }[], group: number, external = false) => (
    <ul className="footer-links">
      {items.map((link, i) => (
        <li key={link.label}>
          <TextLink
            href={link.href}
            reveal
            revealDelay={group * GROUP_STAGGER + (i + 1) * LINK_STAGGER}
            {...(external && { target: "_blank", rel: "noopener noreferrer" })}
          >
            {link.label}
          </TextLink>
        </li>
      ))}
    </ul>
  );

  return (
    <footer className="footer" ref={footerRef}>
      <div className="footer-inner">
        <div className="footer-top">
          <LineReveal as="h2" className="footer-title header-1">
            Your Trusted Legal Partner, Every Step of the Way
          </LineReveal>
          <div className="footer-cta">
            <TextLink href="/contact" size="big" icon="arrow-up-right" reveal revealDelay={0.15}>
              Let&rsquo;s Talk
            </TextLink>
          </div>
        </div>

        <span className="footer-divider" aria-hidden="true" />

        <div className="footer-lower">
          <div className="footer-content">
            <nav className="footer-group footer-navigate" aria-labelledby="footer-navigate">
              <LineReveal as="h3" id="footer-navigate" className="footer-group-title header-3-semibold">
                Navigate
              </LineReveal>
              {links(NAVIGATE, 0)}
            </nav>

            <div className="footer-group footer-social">
              <LineReveal as="h3" className="footer-group-title header-3-semibold" delay={GROUP_STAGGER}>
                Social
              </LineReveal>
              {links(SOCIAL, 1, true)}
            </div>

            <div className="footer-group footer-contact">
              <LineReveal as="h3" className="footer-group-title header-3-semibold" delay={2 * GROUP_STAGGER}>
                For Inquiries
              </LineReveal>
              {links(CONTACT, 2)}
            </div>

            <div className="footer-group footer-location">
              <LineReveal as="h3" className="footer-group-title header-3-semibold" delay={3 * GROUP_STAGGER}>
                Location
              </LineReveal>
              <LineReveal
                as="address"
                className="footer-address header-4"
                delay={3 * GROUP_STAGGER + LINK_STAGGER}
                stagger={LINK_STAGGER}
              >
                Shady ElBarkoky Law Firm
                <br />
                4th Floor, 52 HQ Mall
                <br />
                North 90 Road, Fifth Settlement
                <br />
                New Cairo, Egypt
              </LineReveal>
            </div>
          </div>

          <div className="footer-bottom">
            <ul className="footer-legal">
              {LEGAL.map((link, i) => (
                <li key={link.href}>
                  <TextLink href={link.href} reveal revealDelay={i * LINK_STAGGER} revealStart="top bottom">
                    {link.label}
                  </TextLink>
                </li>
              ))}
            </ul>
            <TextLink
              href="#top"
              icon="arrow-up"
              className="footer-back-to-top"
              onClick={backToTop}
              reveal
              revealDelay={3 * LINK_STAGGER}
              revealStart="top bottom"
            >
              Back to top
            </TextLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
