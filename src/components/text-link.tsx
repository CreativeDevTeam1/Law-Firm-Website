import Link from "next/link";
import type { ComponentProps } from "react";

const SIZES = {
  small: "cta-small",
  medium: "cta-medium",
  big: "cta-big",
} as const;

type TextLinkProps = ComponentProps<typeof Link> & {
  /** Text size, from the CTA text styles. Default "small". */
  size?: keyof typeof SIZES;
  /**
   * Adds the arrow icon. Links with an icon are underlined at rest and swap
   * the line on hover; links without one draw the line in on hover.
   */
  icon?: boolean;
};

// The site's text link, in two variants that share one look at any size:
//
//   <TextLink href="/about">About</TextLink>
//   <TextLink href="/contact" icon>Let's Talk</TextLink>
//   <TextLink href="/team" size="big">Meet the team</TextLink>
//
// The icon scales with the text size.
export default function TextLink({
  size = "small",
  icon = false,
  className = "",
  children,
  ...props
}: TextLinkProps) {
  const classes = [
    "text-link",
    icon ? "text-link-with-icon link-underline-swap" : "link-underline",
    SIZES[size],
    className,
  ];

  return (
    <Link className={classes.filter(Boolean).join(" ")} {...props}>
      {children}
      {icon && (
        <span className="link-arrow" aria-hidden="true">
          <span className="text-link-icon" />
        </span>
      )}
    </Link>
  );
}
