"use client";

import { useRef, type ComponentProps, type ReactNode } from "react";
import Link from "next/link";
import { useLineReveal } from "@/hooks/use-line-reveal";

const SIZES = {
  small: "cta-small",
  medium: "cta-medium",
  big: "cta-big",
} as const;

type Icon = "arrow-up-right" | "arrow-right" | "arrow-up";

type TextLinkProps = ComponentProps<typeof Link> & {
  /** Text size, from the CTA text styles. Default "small". */
  size?: keyof typeof SIZES;
  /**
   * Adds an arrow icon. Links with an icon are underlined at rest and swap
   * the line on hover; links without one draw the line in on hover.
   */
  icon?: Icon;
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
//   <TextLink href="/contact" icon="arrow-up-right">Consult Us</TextLink>
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

  return (
    <Link ref={linkRef} className={textLinkClasses(size, icon, reveal && "text-link-reveal", className)} {...props}>
      {reveal ? (
        <span ref={labelRef} className="text-link-label line-reveal">
          {children}
        </span>
      ) : (
        children
      )}
      {icon && <TextLinkArrow icon={icon} />}
    </Link>
  );
}

type TextLinkLabelProps = {
  size?: keyof typeof SIZES;
  icon?: Icon;
  className?: string;
  children: ReactNode;
};

// A text link's look without the link, for inside something that is itself
// the link (a whole clickable card): its underline and arrow move when that
// link is hovered or focused.
//
//   <Link href="/team/…" className="teams-card">… <TextLinkLabel icon="arrow-right">Know more</TextLinkLabel></Link>
export function TextLinkLabel({ size = "small", icon, className = "", children }: TextLinkLabelProps) {
  return (
    <span className={textLinkClasses(size, icon, className)}>
      {children}
      {icon && <TextLinkArrow icon={icon} />}
    </span>
  );
}

const textLinkClasses = (size: keyof typeof SIZES, icon: Icon | undefined, ...extra: (string | false)[]) =>
  ["text-link", icon ? "text-link-with-icon link-underline-swap" : "link-underline", SIZES[size], ...extra]
    .filter(Boolean)
    .join(" ");

function TextLinkArrow({ icon }: { icon: Icon }) {
  return (
    <span className={`link-arrow link-${icon}`} aria-hidden="true">
      <span className={`text-link-icon text-link-icon-${icon}`} />
    </span>
  );
}
