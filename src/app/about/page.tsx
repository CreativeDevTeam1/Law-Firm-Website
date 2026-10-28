import HeroSection from "@/components/sections/hero-section";
import ImageReveal from "@/components/ui/image-reveal";
import PracticeAreasSection from "@/components/sections/practice-areas-section";
import WhoWeAreSection from "@/components/sections/who-we-are-section";

export default function About() {
  return (
    <main>
      <HeroSection />
      <WhoWeAreSection />
      <ImageReveal
        src="/images/about-page/boardroom.png"
        alt="Lawyers reviewing case files around a boardroom table"
      />
      <PracticeAreasSection />
    </main>
  );
}
