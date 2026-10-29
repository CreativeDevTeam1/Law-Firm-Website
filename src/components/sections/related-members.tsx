import RelatedCarousel from "@/components/ui/related-carousel";
import TeamsCard from "@/components/cards/teams-card";
import type { TeamMember } from "@/content/types";

type RelatedMembersProps = { members: TeamMember[] };

// The end of a team member's page: "(Related Members)" and the rest of
// the team as cards in the related carousel (related-carousel.tsx).
export default function RelatedMembers({ members }: RelatedMembersProps) {
  return (
    <RelatedCarousel id="related-members" label="(Related Members)" itemName="member">
      {members.map((member) => (
        <li className="related-item" key={member.slug}>
          <TeamsCard member={member} />
        </li>
      ))}
    </RelatedCarousel>
  );
}
