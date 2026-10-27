import JobApplication from "@/components/job-application";
import JobApplyLink from "@/components/job-apply-link";
import { ROLE_OFFER, roleGroup, type Role } from "@/lib/careers";

type JobContentProps = { role: Role };

// A role's page — no Figma frame; kept simple and static (no marquee or
// scroll animations). On phones "(Open position)" is set into the title's
// first line and the details and "Apply" follow; from 1024px the label sits
// above the title with "Apply" level with it on the right, and the details
// spread across the page in one row. Then the summary and lists, each under
// a divider
// with its label on the left: the label in columns 1–4 and the text in
// columns 6–11 from 1024px, as How we hire. On phones it all stacks. Last,
// the application form "Apply" scrolls down to.
export default function JobContent({ role }: JobContentProps) {
  const group = roleGroup(role);

  const facts = [
    { term: "Practice", value: group.name },
    { term: "Experience", value: role.level },
    { term: "Location", value: role.location },
    { term: "Type", value: role.type },
  ];

  const sections = [
    { label: "(What you’ll do)", items: role.responsibilities },
    { label: "(What you’ll bring)", items: role.requirements },
    { label: "(What we offer)", items: ROLE_OFFER },
  ];

  return (
    <article className="job" aria-labelledby="job-title">
      <div className="section-heading job-heading">
        <p className="section-heading-label cta-medium">(Open position)</p>
        <h1 id="job-title" className="section-heading-title header-1">
          {role.title}
        </h1>
      </div>

      <div className="job-details">
        <dl className="job-facts">
          {facts.map((fact) => (
            <div className="job-fact" key={fact.term}>
              <dt className="job-fact-term body">{fact.term}</dt>
              <dd className="header-3-medium">{fact.value}</dd>
            </div>
          ))}
        </dl>
        <JobApplyLink />
      </div>

      <p className="job-summary header-2-medium">{role.summary}</p>

      {sections.map((section) => (
        <section className="job-section" key={section.label} aria-label={section.label.slice(1, -1)}>
          <h2 className="job-section-label cta-medium">{section.label}</h2>
          <ul className="job-list">
            {section.items.map((item) => (
              <li className="job-list-item body-big" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <JobApplication roleTitle={role.title} />
    </article>
  );
}
