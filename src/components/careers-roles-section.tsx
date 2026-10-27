"use client";

import { useRef } from "react";
import LineReveal from "@/components/line-reveal";
import RoleRow from "@/components/role-row";
import SectionHeading from "@/components/section-heading";
import { useBatchReveal } from "@/hooks/use-batch-reveal";
import { useDividerReveal } from "@/hooks/use-divider-reveal";
import { ROLE_GROUPS, ROLES } from "@/lib/careers";

// Careers "Open positions" — the heading with its label set into the first
// line, then a group per practice: a divider that draws in (as on the Team
// page), the group's label in columns 1–4 and its roles in columns 5–12.
// Each role is a row linking to its page (role-row.tsx). The rows slide up
// and fade in a few at a time, as the cards do. The roles are in
// src/lib/careers.ts.
export default function CareersRolesSection() {
  const groupsRef = useRef<HTMLDivElement>(null);
  useDividerReveal(groupsRef, ".careers-group-divider");
  useBatchReveal(groupsRef, ".careers-role", 60);

  return (
    <section className="careers-roles" id="open-positions" aria-labelledby="careers-roles-title">
      <SectionHeading id="careers-roles-title" label="(Open positions)" className="careers-roles-heading">
        Current openings across our practice groups and the teams that keep
        the firm running.
      </SectionHeading>

      <div className="careers-groups" ref={groupsRef}>
        {ROLE_GROUPS.map((group) => (
          <section className="careers-group" key={group.id} aria-labelledby={`careers-${group.id}`}>
            <span className="careers-group-divider" aria-hidden="true" />
            <LineReveal as="h3" id={`careers-${group.id}`} className="careers-group-label cta-medium">
              {group.label}
            </LineReveal>
            <ul className="careers-role-list">
              {ROLES.filter((role) => role.group === group.id).map((role) => (
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
