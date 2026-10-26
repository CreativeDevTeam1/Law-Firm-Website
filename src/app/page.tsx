import AboutSection from "@/components/about-section";
import ClientsSection from "@/components/clients-section";
import HeroSection from "@/components/hero-section";
import Intro from "@/components/intro";

export default function Home() {
  return (
    <main>
      <Intro />
      <HeroSection />
      <AboutSection />
      <ClientsSection />
    </main>
  );
}
