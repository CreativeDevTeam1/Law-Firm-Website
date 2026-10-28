import Link from "next/link";
import { TextLinkLabel } from "@/components/ui/text-link";
import type { Role } from "@/lib/careers";

type RoleRowProps = {
  role: Role;
  /** Heading level of the title: one below the heading above the row. Default "h4". */
  titleAs?: "h3" | "h4";
};

// An opening as one row and one link to its page (/careers/[slug]): title,
// level, location and type, and "View role". On hover its line fills in and
// the title edges right, while "View role" swaps its underline and its arrow
// passes through, as the cards' "Know more" does (see Careers in
// globals.css).
//
//   <li><RoleRow role={role} /></li>
export default function RoleRow({ role, titleAs: Title = "h4" }: RoleRowProps) {
  return (
    <Link href={`/careers/${role.slug}`} className="careers-role">
      <Title className="careers-role-title header-3-semibold">{role.title}</Title>
      <p className="careers-role-meta body">{[role.level, role.location, role.type].join(" · ")}</p>
      <TextLinkLabel icon="arrow-right" className="careers-role-apply">
        View role
      </TextLinkLabel>
    </Link>
  );
}
