import LineReveal from "@/components/line-reveal";
import TextLink from "@/components/text-link";

export default function AboutSection() {
  return (
    <section className="about" aria-labelledby="about-title">
      <div className="about-heading">
        <LineReveal className="about-label cta-medium">(About)</LineReveal>
        <LineReveal as="h2" id="about-title" className="about-title header-1">
          Shady El-Barkoky Law Firm is a full-service Egyptian law firm based in
          New Cairo, providing legal representation, consultation, and strategic
          solutions across all major areas of law.
        </LineReveal>
      </div>

      <LineReveal as="h3" className="about-subtitle header-3-medium">
        As laws evolve
      </LineReveal>

      <div className="about-content">
        <LineReveal className="about-text body">
          Built upon professionalism, integrity, and client-focused
          representation, the firm serves individuals, corporations, investors,
          entrepreneurs, and institutions seeking dependable legal counsel in an
          increasingly complex legal and commercial environment.
        </LineReveal>
        <LineReveal className="about-text body" delay={0.1}>
          Our multidisciplinary approach enables us to address legal matters
          from both practical and strategic perspectives. Every instruction
          entrusted to our firm is handled with meticulous preparation, careful
          analysis, and unwavering dedication to protecting our clients&apos;
          legal and commercial interests.
        </LineReveal>
        <TextLink href="/about" size="medium" icon="arrow-right" reveal>
          More about the firm
        </TextLink>
      </div>
    </section>
  );
}
