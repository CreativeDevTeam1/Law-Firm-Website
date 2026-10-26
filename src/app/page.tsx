import AboutSection from "@/components/about-section";
import ClientsSection from "@/components/clients-section";
import FoundersSection from "@/components/founders-section";
import HeroSection from "@/components/hero-section";
import Intro from "@/components/intro";

export default function Home() {
  return (
    <main>
      <Intro />
      <HeroSection />
      <AboutSection />
      <ClientsSection />
      <FoundersSection />
    </main>
  );
}
