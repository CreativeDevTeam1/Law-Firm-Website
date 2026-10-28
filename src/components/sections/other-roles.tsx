import RoleRow from "@/components/cards/role-row";
import TextLink from "@/components/ui/text-link";
import type { Role } from "@/lib/careers";

type OtherRolesProps = { roles: Role[] };

// The end of a role's page, static like the rest of it: a divider and
// "(Other openings)" (the Related styles), then the other roles as rows
// (role-row.tsx) across the page, and a link back to every opening on the
// Careers page.
export default function OtherRoles({ roles }: OtherRolesProps) {
  return (
    <section className="related other-roles" aria-labelledby="other-roles-title">
      <span className="related-divider" aria-hidden="true" />
      <h2 id="other-roles-title" className="related-label cta-medium">
        (Other openings)
      </h2>

      <ul className="careers-role-list other-roles-list">
        {roles.map((role) => (
          <li key={role.slug}>
            <RoleRow role={role} titleAs="h3" />
          </li>
        ))}
      </ul>

      <TextLink href="/careers#open-positions" size="medium" icon="arrow-right" className="other-roles-link">
        View all openings
      </TextLink>
    </section>
  );
}
