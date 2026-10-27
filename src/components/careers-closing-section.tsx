import SectionHeading from "@/components/section-heading";

// The end of the Careers page, just before the footer's "Let's Talk": one
// large statement with "(Join us)" set into its first line.
export default function CareersClosingSection() {
  return (
    <section className="careers-closing" aria-label="Join us">
      <SectionHeading as="p" label="(Join us)" className="careers-closing-heading">
        Don’t see your role? We’re always glad to meet exceptional people who
        share our standards.
      </SectionHeading>
    </section>
  );
}
