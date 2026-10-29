import LineReveal from "@/components/ui/line-reveal";
import SectionHeading from "@/components/ui/section-heading";
import type { CareersPage } from "@/content/types";

type CareersIntroSectionProps = { intro: CareersPage["intro"] };

// Careers page opening — designed from the About page's patterns (there's
// no Figma frame). The Page header, with "(Careers)" set into the heading.
// The reasons to join come after the open positions
// (careers-reasons-section.tsx).
export default function CareersIntroSection({ intro }: CareersIntroSectionProps) {
  return (
    <section className="careers-intro" aria-labelledby="careers-title">
      <div className="page-header careers-header">
        <SectionHeading id="careers-title" label={intro.heading.label} className="page-heading careers-heading">
          {intro.heading.title}
        </SectionHeading>
        <LineReveal className="page-intro body" delay={0.1}>
          {intro.text}
        </LineReveal>
      </div>
    </section>
  );
}
