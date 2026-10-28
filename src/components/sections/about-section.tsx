import LineReveal from "@/components/ui/line-reveal";
import TextLink from "@/components/ui/text-link";

export default function AboutSection() {
  return (
    <section className="about" aria-labelledby="about-title">
      <div className="about-heading">
        <LineReveal className="about-label cta-medium">(About)</LineReveal>
        <LineReveal as="h2" id="about-title" className="about-title header-1">
          An Egyptian law firm combining rigorous preparation, commercial
          judgment, and committed representation across every stage of a
          matter.
        </LineReveal>
      </div>

      <LineReveal as="h3" className="about-subtitle header-3-medium">
        Counsel shaped around the matter at hand.
      </LineReveal>

      <div className="about-content">
        <LineReveal className="about-text body">
          Based in New Cairo, Shady El-Barkoky Law Firm advises businesses,
          institutions, investors, and individuals across corporate,
          commercial, dispute, and private-client matters. Each engagement
          begins with a clear understanding of the legal position, the
          client&apos;s objectives, and the wider context in which decisions are
          made.
        </LineReveal>
        <LineReveal className="about-text body" delay={0.1}>
          Working across disciplines allows the firm to address immediate
          legal questions without losing sight of their practical and
          commercial consequences. From preventive advice and negotiations to
          complex proceedings, we deliver focused strategies designed to
          protect our clients&apos; interests and support confident decisions.
        </LineReveal>
        <TextLink href="/about" size="medium" icon="arrow-right" reveal>
          More about the firm
        </TextLink>
      </div>
    </section>
  );
}
