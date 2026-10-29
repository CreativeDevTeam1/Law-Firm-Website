import type { Metadata } from "next";
import HeroSection from "@/components/sections/hero-section";
import ImageReveal from "@/components/ui/image-reveal";
import PracticeAreasSection from "@/components/sections/practice-areas-section";
import WhoWeAreSection from "@/components/sections/who-we-are-section";
import { getAboutPage } from "@/content/queries";

export const metadata: Metadata = { title: "About" };

export default async function About() {
  const page = await getAboutPage();

  return (
    <main>
      <HeroSection hero={page.hero} />
      <WhoWeAreSection whoWeAre={page.whoWeAre} />
      <ImageReveal image={page.imageReveal} />
      <PracticeAreasSection practiceAreas={page.practiceAreas} />
    </main>
  );
}
