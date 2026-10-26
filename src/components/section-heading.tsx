import type { ReactNode } from "react";
import LineReveal from "@/components/line-reveal";

type SectionHeadingProps = {
  id: string;
  label: string;
  className?: string;
  children: ReactNode;
};

// Shared overlaid section heading used when an eyebrow occupies the opening
// space on the title's first line. Each section supplies only its own indent.
export default function SectionHeading({
  id,
  label,
  className = "",
  children,
}: SectionHeadingProps) {
  return (
    <div className={`section-heading ${className}`.trim()}>
      <LineReveal className="section-heading-label cta-medium">{label}</LineReveal>
      <LineReveal as="h2" id={id} className="section-heading-title header-1">
        {children}
      </LineReveal>
    </div>
  );
}
