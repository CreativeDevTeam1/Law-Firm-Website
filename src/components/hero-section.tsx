import Image from "next/image";
import LineReveal from "@/components/line-reveal";

export default function HeroSection() {
  return (
    <section className="hero" data-intro-target>
      <Image
        className="hero-image"
        data-intro-image
        src="/images/home-page/shady-elbarkoky.webp"
        alt="Shady El-Barkoky seated in an armchair in his office"
        fill
        sizes="100vw"
        loading="eager"
        fetchPriority="high"
      />

      <div className="hero-screen">
        <LineReveal as="h1" className="hero-title header-1" play="load" delay={0.2}>
          Excellence in Law. Commitment Beyond Representation.
        </LineReveal>
      </div>

      <div className="hero-intro">
        <LineReveal className="hero-quote header-2-medium">
          &quot;Legal excellence is not measured by words—it is demonstrated
          through preparation, integrity, and unwavering commitment to every
          client we represent.&quot;
        </LineReveal>
        <LineReveal className="hero-description body" delay={0.15}>
          Providing comprehensive legal services across a broad spectrum of
          practice areas, Shady El-Barkoky Law Firm serves individuals,
          corporations, investors, entrepreneurs, and institutions with
          dedication, professionalism, and strategic legal insight.
        </LineReveal>
      </div>
    </section>
  );
}
