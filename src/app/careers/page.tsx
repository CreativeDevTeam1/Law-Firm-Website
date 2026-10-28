import CareersClosingSection from "@/components/sections/careers-closing-section";
import CareersIntroSection from "@/components/sections/careers-intro-section";
import CareersRolesSection from "@/components/sections/careers-roles-section";
import HeroSection from "@/components/sections/hero-section";
import HiringProcessSection from "@/components/sections/hiring-process-section";

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
