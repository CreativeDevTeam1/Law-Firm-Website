import HeroSection from "@/components/sections/hero-section";
import TeamSection from "@/components/sections/team-section";

export default function Team() {
  return (
    <main>
      <HeroSection
        image="/images/about-page/boardroom.png"
        imageAlt="Lawyers reviewing case files around a boardroom table"
        title={
          <>
            The People Behind
            <br />
            Every Matter.
          </>
        }
        quote="Sound legal judgment is built by people who listen carefully, prepare thoroughly, and stay accountable from the first meeting to the final outcome."
        description="Our partners, associates, and legal professionals bring together experience across corporate, disputes, investment, and regulatory work, so every client is served by the right expertise at each stage of a matter."
      />
      <TeamSection />
    </main>
  );
}
