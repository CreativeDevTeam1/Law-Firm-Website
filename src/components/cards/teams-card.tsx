import Image from "next/image";
import Link from "next/link";
import { TextLinkLabel } from "@/components/ui/text-link";
import type { TeamMember } from "@/content/types";

type TeamsCardProps = {
  member: TeamMember;
  /** Heading level of the name: one below the heading above the card. Default "h3". */
  nameAs?: "h3" | "h4";
  className?: string;
};

// A team member card — Figma "Team Member Card": photo, name (cut to three
// lines), role and "Know more". The whole card is the link to the member's
// page; "Know more" is its label, and its underline and arrow move as the
// card is hovered or focused. The photo is left out of the link's name
// (the name is already in it).
//
//   <TeamsCard member={member} />
export default function TeamsCard({ member, nameAs: Name = "h3", className = "" }: TeamsCardProps) {
  return (
    <Link href={`/team/${member.slug}`} className={`teams-card ${className}`.trim()}>
      <div className="teams-card-photo">
        <Image
          src={member.photo.src}
          alt=""
          fill
          sizes="(min-width: 64rem) 25vw, (min-width: 30rem) 50vw, 100vw"
          style={member.photo.position ? { objectPosition: member.photo.position } : undefined}
        />
      </div>
      <div className="teams-card-info">
        <Name className="teams-card-name header-3-semibold">{member.name}</Name>
        <p className="teams-card-role body">{member.role}</p>
        <TextLinkLabel icon="arrow-right">Know more</TextLinkLabel>
      </div>
    </Link>
  );
}
