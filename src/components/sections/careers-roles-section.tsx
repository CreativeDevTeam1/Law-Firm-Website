"use client";

import { useRef } from "react";
import LineReveal from "@/components/ui/line-reveal";
import RoleRow from "@/components/cards/role-row";
import SectionHeading from "@/components/ui/section-heading";
import type { CareersPage } from "@/content/types";
import { useBatchReveal } from "@/hooks/use-batch-reveal";
import { useDividerReveal } from "@/hooks/use-divider-reveal";

type CareersRolesSectionProps = { openings: CareersPage["openings"] };

// Careers "Open positions" — the heading with its label set into the first
// line, then a group per practice: a divider that draws in (as on the Team
// page), the group's label in columns 1–4 and its roles in columns 6–12.
// Each role is a row linking to its page (role-row.tsx). The rows slide up
// and fade in a few at a time, as the cards do. A group with no openings
// is left out.
export default function CareersRolesSection({ openings: { heading, groups } }: CareersRolesSectionProps) {
  const groupsRef = useRef<HTMLDivElement>(null);
  useDividerReveal(groupsRef, ".careers-group-divider");
  useBatchReveal(groupsRef, ".careers-role", { rise: 60, stagger: 0.08 });

  return (
    <section className="careers-roles" id="open-positions" aria-labelledby="careers-roles-title">
      <SectionHeading id="careers-roles-title" label={heading.label} className="careers-roles-heading">
        {heading.title}
      </SectionHeading>

      <div className="careers-groups" ref={groupsRef}>
        {groups
          .filter((group) => group.roles.length > 0)
          .map((group, i) => (
            <section className="careers-group" key={group.name} aria-labelledby={`careers-group-${i}`}>
              <span className="careers-group-divider" aria-hidden="true" />
              <LineReveal as="h3" id={`careers-group-${i}`} className="careers-group-label cta-medium">
                ({group.name})
              </LineReveal>
              <ul className="careers-role-list">
                {group.roles.map((role) => (
                  <li key={role.slug}>
                    <RoleRow role={role} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
      </div>
    </section>
  );
}
