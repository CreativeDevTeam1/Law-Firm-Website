import CareersClosingSection from "@/components/sections/careers-closing-section";
import CareersIntroSection from "@/components/sections/careers-intro-section";
import CareersReasonsSection from "@/components/sections/careers-reasons-section";
import CareersRolesSection from "@/components/sections/careers-roles-section";
import HeroSection from "@/components/sections/hero-section";
import HiringProcessSection from "@/components/sections/hiring-process-section";

// No Figma frame: designed from the other pages' patterns.
export default function Careers() {
  return (
    <main>
      <HeroSection
        image="/images/home-page/news/cinematic-new-cairo.png"
        imageAlt="A lawyer walking past the firm's New Cairo offices at dusk"
        title={
          <>
            Practise Law with Purpose
            <br />
            and Precision.
          </>
        }
        quote="Strong lawyers are shaped by demanding work, honest feedback, and colleagues who hold themselves to the same standard."
        description="At Shady El-Barkoky Law Firm, lawyers and professionals grow through real responsibility, close mentorship, and exposure to matters across our practice areas, from our offices in New Cairo."
      />
      <CareersIntroSection />
      <CareersRolesSection />
      <CareersReasonsSection />
      <HiringProcessSection />
      <CareersClosingSection />
    </main>
  );
}
