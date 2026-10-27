import HeroSection from "@/components/hero-section";
import ImageReveal from "@/components/image-reveal";
import PracticeAreasSection from "@/components/practice-areas-section";
import WhoWeAreSection from "@/components/who-we-are-section";

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
