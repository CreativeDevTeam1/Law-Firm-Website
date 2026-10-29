import type { Metadata } from "next";
import HeroSection from "@/components/sections/hero-section";
import TeamSection from "@/components/sections/team-section";
import { getTeamPage } from "@/content/queries";

export const metadata: Metadata = { title: "Team" };

export default async function Team() {
  const directory = await getTeamPage();

  return (
    <main>
      <HeroSection hero={directory.hero} />
      <TeamSection directory={directory} />
    </main>
  );
}
