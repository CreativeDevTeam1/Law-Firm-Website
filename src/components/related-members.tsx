import RelatedCarousel from "@/components/related-carousel";
import TeamsCard from "@/components/teams-card";
import type { TeamMember } from "@/lib/team";

type RelatedMembersProps = { members: TeamMember[] };

// The end of a team member's page: "(Related Members)" and the rest of
// the team as cards in the related carousel (related-carousel.tsx).
export default function RelatedMembers({ members }: RelatedMembersProps) {
  return (
    <RelatedCarousel id="related-members" label="(Related Members)" itemName="member">
      {members.map((member) => (
        <li className="related-item" key={member.slug}>
          <TeamsCard
            name={member.name}
            role={member.role}
            photo={member.photo}
            photoPosition={member.photoPosition}
            href={`/team/${member.slug}`}
          />
        </li>
      ))}
    </RelatedCarousel>
  );
}
