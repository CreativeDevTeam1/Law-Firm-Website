"use client";

import { useRef, type ComponentProps } from "react";
import Link from "next/link";
import { useLineReveal } from "@/hooks/use-line-reveal";

const SIZES = {
  small: "cta-small",
  medium: "cta-medium",
  big: "cta-big",
} as const;

type TextLinkProps = ComponentProps<typeof Link> & {
  /** Text size, from the CTA text styles. Default "small". */
  size?: keyof typeof SIZES;
  /**
   * Adds an arrow icon. Links with an icon are underlined at rest and swap
   * the line on hover; links without one draw the line in on hover.
   */
  icon?: "arrow-up-right" | "arrow-right" | "arrow-up";
  /**
   * Reveals the link when it scrolls into view: the text slides up (like
   * <LineReveal>), then the underline draws in and the arrow slides in.
   */
  reveal?: boolean;
  /** Seconds to wait before the reveal starts, to stagger several links. */
  revealDelay?: number;
  /**
   * ScrollTrigger start for the reveal (default "top 85%"). Links at the
   * very end of the page need "top bottom": they can't scroll any higher.
   */
  revealStart?: string;
};

// The site's text link, in two variants that share one look at any size:
//
//   <TextLink href="/about">About</TextLink>
//   <TextLink href="/contact" icon="arrow-up-right">Let's Talk</TextLink>
//   <TextLink href="/about" size="medium" icon="arrow-right" reveal>More about the firm</TextLink>
//
// The icon scales with the text size.
export default function TextLink({
  size = "small",
  icon,
  reveal = false,
  revealDelay = 0,
  revealStart,
  className = "",
  children,
  ...props
}: TextLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  // Without `reveal` the label has no ref, so the hook does nothing.
  useLineReveal(labelRef, {
    delay: revealDelay,
    ...(revealStart && { start: revealStart }),
    onRevealed: () => linkRef.current?.classList.add("text-link-revealed"),
  });

  const classes = [
    "text-link",
    icon ? "text-link-with-icon link-underline-swap" : "link-underline",
    SIZES[size],
    reveal && "text-link-reveal",
    className,
  ];

  return (
    <Link ref={linkRef} className={classes.filter(Boolean).join(" ")} {...props}>
      {reveal ? (
        <span ref={labelRef} className="text-link-label line-reveal">
          {children}
        </span>
      ) : (
        children
      )}
      {icon && (
        <span className={`link-arrow link-${icon}`} aria-hidden="true">
          <span className={`text-link-icon text-link-icon-${icon}`} />
        </span>
      )}
    </Link>
  );
}
