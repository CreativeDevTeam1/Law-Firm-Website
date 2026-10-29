import LineReveal from "@/components/ui/line-reveal";
import TextLink from "@/components/ui/text-link";
import type { HomePage } from "@/content/types";

type AboutSectionProps = { about: HomePage["about"] };

// Home page "(About)": the heading with its label above it, a subtitle,
// then the paragraphs and a link to the About page.
export default function AboutSection({ about }: AboutSectionProps) {
  return (
    <section className="about" aria-labelledby="about-title">
      <div className="about-heading">
        <LineReveal className="about-label cta-medium">({about.heading.label})</LineReveal>
        <LineReveal as="h2" id="about-title" className="about-title header-1">
          {about.heading.title}
        </LineReveal>
      </div>

      <LineReveal as="h3" className="about-subtitle header-3-medium">
        {about.subtitle}
      </LineReveal>

      <div className="about-content">
        {about.paragraphs.map((paragraph, i) => (
          <LineReveal className="about-text body" delay={0.1 * i} key={i}>
            {paragraph}
          </LineReveal>
        ))}
        <TextLink href={about.link.href} size="medium" icon="arrow-right" reveal>
          {about.link.label}
        </TextLink>
      </div>
    </section>
  );
}
