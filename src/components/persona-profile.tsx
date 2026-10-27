import Image from "next/image";
import LineReveal from "@/components/line-reveal";
import PersonaMarquee from "@/components/persona-marquee";
import type { TeamMember } from "@/lib/team";

type PersonaProfileProps = { member: TeamMember };

// A team member's page — Figma "persona-page" ("persona-content-wrapper"),
// opened like wearemotto.com's founder pages with the firm's logo looping
// across the screen (persona-marquee.tsx) and the photo rising over it.
// Then their name, role and social links (columns 2–4 from 1024px), and the
// statement and bio beside them (columns 6–10); on phones it all stacks.
export default function PersonaProfile({ member }: PersonaProfileProps) {
  const socials = [
    { href: member.linkedin, label: "LinkedIn", icon: "linkedin" },
    { href: member.instagram, label: "Instagram", icon: "instagram" },
  ].filter((social) => social.href);

  return (
    <section className="persona" aria-labelledby="persona-name">
      <PersonaMarquee />

      <div className="persona-photo">
        <Image
          src={member.photo}
          alt={member.name}
          fill
          sizes="(min-width: 64rem) 77vw, 100vw"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      <div className="persona-meta">
        <LineReveal as="h1" id="persona-name" className="persona-name header-3-semibold">
          {member.name}
        </LineReveal>
        <LineReveal className="persona-role header-3-medium" delay={0.08}>
          {member.role}
        </LineReveal>
        {socials.length > 0 && (
          <ul className="persona-socials">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  className="persona-social"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} on ${social.label}`}
                >
                  <span className={`persona-social-icon persona-social-${social.icon}`} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <LineReveal as="h2" className="persona-statement header-2-semibold">
        {member.statement}
      </LineReveal>

      <div className="persona-bio">
        {member.bio.map((paragraph, i) => (
          <LineReveal className="body-big" key={i}>
            {paragraph}
          </LineReveal>
        ))}
      </div>
    </section>
  );
}
