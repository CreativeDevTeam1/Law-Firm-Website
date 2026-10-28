import HeroSection from "@/components/sections/hero-section";
import ImageReveal from "@/components/ui/image-reveal";
import PracticeAreasSection from "@/components/sections/practice-areas-section";
import WhoWeAreSection from "@/components/sections/who-we-are-section";

export default function About() {
  return (
    <main>
      <HeroSection
        image="/images/about-page/about-hero-cinematic.png"
        imageAlt="A multidisciplinary legal team reviewing a matter in a New Cairo boardroom"
        title="A Firm Built on Judgment, Preparation, and Trust."
        quote="Effective legal counsel begins with understanding the client, the matter, and the decisions that shape what comes next."
        description="Based in New Cairo, Shady El-Barkoky Law Firm brings together multidisciplinary experience to advise businesses, institutions, investors, and individuals with clarity, discretion, and purpose."
      />
      <WhoWeAreSection />
      <ImageReveal
        src="/images/about-page/firm-corridor-cinematic-16x9.png"
        alt="A legal team walking through a contemporary Cairo office"
      />
      <PracticeAreasSection />
    </main>
  );
}
