import Image from "next/image";
import LineBreaks from "@/components/ui/line-breaks";
import LineReveal from "@/components/ui/line-reveal";
import type { Hero } from "@/content/types";

type HeroSectionProps = { hero: Hero };

// A page's opening: a full-screen photo with the title over it, then the
// quote and a paragraph. On the home page the intro opens onto it
// (data-intro-target).
export default function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section className="hero" data-intro-target>
      <div className="hero-media">
        <Image
          className="hero-image"
          data-intro-image
          src={hero.image.src}
          alt={hero.image.alt}
          fill
          sizes="115vw"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      <div className="hero-screen">
        <LineReveal as="h1" className="hero-title header-1" play="load" delay={0.2}>
          <LineBreaks text={hero.title} />
        </LineReveal>
      </div>

      <div className="hero-intro">
        <LineReveal className="hero-quote header-2-medium">&quot;{hero.quote}&quot;</LineReveal>
        <LineReveal className="hero-description body" delay={0.15}>
          {hero.description}
        </LineReveal>
      </div>
    </section>
  );
}
