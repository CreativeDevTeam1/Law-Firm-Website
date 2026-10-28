import Image from "next/image";
import LineReveal from "@/components/ui/line-reveal";

export default function HeroSection() {
  return (
    <section className="hero" data-intro-target>
      <div className="hero-media">
        <Image
          className="hero-image"
          data-intro-image
          src="/images/home-page/shady-elbarkoky-reframed-4x3-2896x2172.webp"
          alt="Shady El-Barkoky seated in an armchair in his office"
          fill
          sizes="115vw"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      <div className="hero-screen">
        <LineReveal as="h1" className="hero-title header-1" play="load" delay={0.2}>
          Excellence in Law. Commitment Beyond Representation.
        </LineReveal>
      </div>

      <div className="hero-intro">
        <LineReveal className="hero-quote header-2-medium">
          &quot;Legal excellence is measured not by words, but by preparation,
          integrity, and unwavering commitment to every client we
          represent.&quot;
        </LineReveal>
        <LineReveal className="hero-description body" delay={0.15}>
          Shady El-Barkoky Law Firm advises individuals, businesses, investors,
          and institutions across a broad range of legal matters, combining
          careful analysis with practical, strategically informed counsel.
        </LineReveal>
      </div>
    </section>
  );
}
