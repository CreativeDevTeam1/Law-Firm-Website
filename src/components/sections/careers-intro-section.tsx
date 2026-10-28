import LineReveal from "@/components/ui/line-reveal";
import SectionHeading from "@/components/ui/section-heading";

// Careers page opening — designed from the About page's patterns (there's
// no Figma frame). The Page header, with "(Careers)" set into the heading.
// The reasons to join come after the open positions
// (careers-reasons-section.tsx).
export default function CareersIntroSection() {
  return (
    <section className="careers-intro" aria-labelledby="careers-title">
      <div className="page-header careers-header">
        <SectionHeading id="careers-title" label="(Careers)" className="page-heading careers-heading">
          Build a legal career grounded in integrity, rigour and purpose,
          alongside people who take both the law and each other seriously.
        </SectionHeading>
        <LineReveal className="page-intro body" delay={0.1}>
          We look for lawyers and professionals who care about the details,
          think strategically and want to grow. In return, we offer close
          mentorship, meaningful work from day one and a firm that invests in
          every member of its team.
        </LineReveal>
      </div>
    </section>
  );
}
