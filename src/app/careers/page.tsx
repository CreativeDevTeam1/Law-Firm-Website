import type { Metadata } from "next";
import CareersClosingSection from "@/components/sections/careers-closing-section";
import CareersIntroSection from "@/components/sections/careers-intro-section";
import CareersReasonsSection from "@/components/sections/careers-reasons-section";
import CareersRolesSection from "@/components/sections/careers-roles-section";
import HeroSection from "@/components/sections/hero-section";
import HiringProcessSection from "@/components/sections/hiring-process-section";
import { getCareersPage } from "@/content/queries";

export const metadata: Metadata = { title: "Careers" };

// No Figma frame: designed from the other pages' patterns.
export default async function Careers() {
  const page = await getCareersPage();

  return (
    <main>
      <HeroSection hero={page.hero} />
      <CareersIntroSection intro={page.intro} />
      <CareersRolesSection openings={page.openings} />
      <CareersReasonsSection reasons={page.reasons} />
      <HiringProcessSection hiring={page.hiring} />
      <CareersClosingSection closing={page.closing} />
    </main>
  );
}
