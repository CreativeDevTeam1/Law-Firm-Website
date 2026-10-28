import type { ReactNode } from "react";
import Image from "next/image";
import LineReveal from "@/components/ui/line-reveal";

type HeroSectionProps = {
  image?: string;
  imageAlt?: string;
  title?: ReactNode; // a <br /> sets where its lines break
  quote?: string;
  description?: string;
};

export default function HeroSection({
  image = "/images/home-page/shady-elbarkoky-reframed-4x3-2896x2172.webp",
  imageAlt = "Shady El-Barkoky seated in an armchair in his office",
  title = "Excellence in Law. Commitment Beyond Representation.",
  quote = "Legal excellence is measured not by words, but by preparation, integrity, and unwavering commitment to every client we represent.",
  description = "Shady El-Barkoky Law Firm advises individuals, businesses, investors, and institutions across a broad range of legal matters, combining careful analysis with practical, strategically informed counsel.",
}: HeroSectionProps = {}) {
  return (
    <section className="hero" data-intro-target>
      <div className="hero-media">
        <Image
          className="hero-image"
          data-intro-image
          src={image}
          alt={imageAlt}
          fill
          sizes="115vw"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      <div className="hero-screen">
        <LineReveal as="h1" className="hero-title header-1" play="load" delay={0.2}>
          {title}
        </LineReveal>
      </div>

      <div className="hero-intro">
        <LineReveal className="hero-quote header-2-medium">
          &quot;{quote}&quot;
        </LineReveal>
        <LineReveal className="hero-description body" delay={0.15}>
          {description}
        </LineReveal>
      </div>
    </section>
  );
}
