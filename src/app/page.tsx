import AboutSection from "@/components/sections/about-section";
import ClientsSection from "@/components/sections/clients-section";
import FoundersSection from "@/components/sections/founders-section";
import HeroSection from "@/components/sections/hero-section";
import NewsSection from "@/components/sections/news-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
import Intro from "@/components/layout/intro";

export default function Home() {
  return (
    <main>
      <Intro />
      <HeroSection />
      <AboutSection />
      <ClientsSection />
      <FoundersSection />
      <NewsSection />
      <TestimonialsSection />
    </main>
  );
}
