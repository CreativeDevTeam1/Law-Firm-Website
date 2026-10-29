import SectionHeading from "@/components/ui/section-heading";
import type { CareersPage } from "@/content/types";

type CareersClosingSectionProps = { closing: CareersPage["closing"] };

// The end of the Careers page, just before the footer's "Consult Us": one
// large statement with its label set into its first line.
export default function CareersClosingSection({ closing }: CareersClosingSectionProps) {
  return (
    <section className="careers-closing" aria-label={closing.label}>
      <SectionHeading as="p" label={closing.label} className="careers-closing-heading">
        {closing.title}
      </SectionHeading>
    </section>
  );
}
