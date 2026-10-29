import AboutSection from "@/components/sections/about-section";
import ClientsSection from "@/components/sections/clients-section";
import FoundersSection from "@/components/sections/founders-section";
import HeroSection from "@/components/sections/hero-section";
import NewsSection from "@/components/sections/news-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
import Intro from "@/components/layout/intro";
import { getHomePage } from "@/content/queries";

export default async function Home() {
  const page = await getHomePage();

  return (
    <main>
      <Intro />
      <HeroSection hero={page.hero} />
      <AboutSection about={page.about} />
      <ClientsSection clients={page.clients} />
      <FoundersSection partners={page.partners} />
      <NewsSection news={page.news} />
      <TestimonialsSection testimonials={page.testimonials} />
    </main>
  );
}
