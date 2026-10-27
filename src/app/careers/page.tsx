import CareersClosingSection from "@/components/careers-closing-section";
import CareersIntroSection from "@/components/careers-intro-section";
import CareersRolesSection from "@/components/careers-roles-section";
import HeroSection from "@/components/hero-section";
import HiringProcessSection from "@/components/hiring-process-section";

// No Figma frame: designed from the other pages' patterns.
export default function Careers() {
  return (
    <main>
      <HeroSection />
      <CareersIntroSection />
      <CareersRolesSection />
      <HiringProcessSection />
      <CareersClosingSection />
    </main>
  );
}
