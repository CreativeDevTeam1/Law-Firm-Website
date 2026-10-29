import type { ElementType, ReactNode } from "react";
import LineReveal from "@/components/ui/line-reveal";

type SectionHeadingProps = {
  id?: string;
  /** Shown in brackets, e.g. "News & Articles" as "(News & Articles)". */
  label: string;
  className?: string;
  /** Element for the title. Default "h2". */
  as?: ElementType;
  /** Element for the label. Default "p". */
  labelAs?: ElementType;
  /** Text style of the title. Default "header-1". */
  titleClassName?: string;
  /** Text style of the label. Default "cta-medium". */
  labelClassName?: string;
  children: ReactNode;
};

// Shared overlaid section heading used when an eyebrow occupies the opening
// space on the title's first line. Each section supplies only its own indent
// (and, for other text styles, the --section-heading-*-size variables).
//
//   <SectionHeading id="news-title" label="News & Articles">…</SectionHeading>
//   <SectionHeading as="p" labelAs="h3" label="Our Mission"
//     titleClassName="header-2-semibold" labelClassName="header-4">…</SectionHeading>
export default function SectionHeading({
  id,
  label,
  className = "",
  as = "h2",
  labelAs = "p",
  titleClassName = "header-1",
  labelClassName = "cta-medium",
  children,
}: SectionHeadingProps) {
  return (
    <div className={`section-heading ${className}`.trim()}>
      <LineReveal as={labelAs} className={`section-heading-label ${labelClassName}`}>
        ({label})
      </LineReveal>
      <LineReveal as={as} id={id} className={`section-heading-title ${titleClassName}`}>
        {children}
      </LineReveal>
    </div>
  );
}
