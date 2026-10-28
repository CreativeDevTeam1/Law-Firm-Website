import Image from "next/image";
import Link from "next/link";
import { TextLinkLabel } from "@/components/ui/text-link";

export type TeamsCardProps = {
  /** Cut to three lines with an ellipsis if longer. */
  name: string;
  /** The person's role, e.g. "Managing Partner". */
  role: string;
  photo: string;
  /** Crop of the photo (CSS object-position), e.g. "21% 0". Default centred. */
  photoPosition?: string;
  href: string;
  /** Heading level of the name: one below the heading above the card. Default "h3". */
  nameAs?: "h3" | "h4";
  className?: string;
};

// A team member card — Figma "Team Member Card": photo, name, role and
// "Know more". The whole card is the link to the member's page; "Know
// more" is its label, and its underline and arrow move as the card is
// hovered or focused. The photo is left out of the link's name (the name
// is already in it).
//
//   <TeamsCard name="Shady el Barkoky" role="Founding Partner" photo="/images/…" href="/team/…" />
export default function TeamsCard({
  name,
  role,
  photo,
  photoPosition,
  href,
  nameAs: Name = "h3",
  className = "",
}: TeamsCardProps) {
  return (
    <Link href={href} className={`teams-card ${className}`.trim()}>
      <div className="teams-card-photo">
        <Image
          src={photo}
          alt=""
          fill
          sizes="(min-width: 64rem) 25vw, (min-width: 40rem) 50vw, 100vw"
          style={photoPosition ? { objectPosition: photoPosition } : undefined}
        />
      </div>
      <div className="teams-card-info">
        <Name className="teams-card-name header-3-semibold">{name}</Name>
        <p className="teams-card-role body">{role}</p>
        <TextLinkLabel icon="arrow-right">Know more</TextLinkLabel>
      </div>
    </Link>
  );
}
