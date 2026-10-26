import Image from "next/image";
import TextLink from "@/components/text-link";

export type TeamsCardProps = {
  /** Cut to three lines with an ellipsis if longer. */
  name: string;
  /** The person's role, e.g. "Managing Partner". */
  role: string;
  photo: string;
  /** Crop of the photo (CSS object-position), e.g. "21% 0". Default centred. */
  photoPosition?: string;
  href: string;
  className?: string;
};

// A team member card — Figma "Team Member Card": photo, name, role and a
// "Know more" link. The photo's alt text is the person's name.
//
//   <TeamsCard name="Shady el Barkoky" role="Founding Partner" photo="/images/…" href="/team/…" />
export default function TeamsCard({
  name,
  role,
  photo,
  photoPosition,
  href,
  className = "",
}: TeamsCardProps) {
  return (
    <article className={`teams-card ${className}`.trim()}>
      <div className="teams-card-photo">
        <Image
          src={photo}
          alt={name}
          fill
          sizes="(min-width: 64rem) 25vw, (min-width: 40rem) 50vw, 100vw"
          style={photoPosition ? { objectPosition: photoPosition } : undefined}
        />
      </div>
      <div className="teams-card-info">
        <h3 className="teams-card-name header-3-semibold">{name}</h3>
        <p className="teams-card-role body">{role}</p>
        <TextLink href={href} icon="arrow-right">
          Know more
        </TextLink>
      </div>
    </article>
  );
}
