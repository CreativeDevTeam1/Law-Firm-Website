export type TeamGroup = "founders" | "partners" | "seniors";

export type TeamMember = {
  /** The member's page: /team/{slug}. */
  slug: string;
  name: string;
  role: string;
  group: TeamGroup;
  photo: string;
  /** Crop of the photo on cards (CSS object-position), e.g. "21% 0". */
  photoPosition?: string;
  /** The heading next to their name on their page. */
  statement: string;
  bio: string[];
  linkedin?: string;
  instagram?: string;
};

export const TEAM_GROUPS: { id: TeamGroup; label: string }[] = [
  { id: "founders", label: "(Founders)" },
  { id: "partners", label: "(Partners)" },
  { id: "seniors", label: "(Seniors)" },
];

const PHOTOS = [
  { photo: "/images/home-page/founders/founder-1.png", photoPosition: "21% 0" },
  { photo: "/images/home-page/founders/founder-2.png", photoPosition: "70% 0" },
  { photo: "/images/home-page/founders/founder-3.png", photoPosition: "39% 0" },
  { photo: "/images/home-page/founders/founder-4.png", photoPosition: "41% 0" },
];

const PLACEHOLDER_BIO =
  "Providing comprehensive legal services across a broad spectrum of practice areas, Shady El-Barkoky Law Firm serves individuals, corporations, investors, entrepreneurs, and institutions with dedication, professionalism, and strategic legal insight.";

// TODO: Figma's placeholders until the real team arrives: every member is
// "Shady el Barkoky" with the persona page's statement and its one bio
// paragraph six times over, the four founder photos cycle, and the social
// links point at the networks themselves. Slugs are by group and position
// until there are real names to build them from.
const placeholders = (group: TeamGroup, prefix: string, role: string, count: number): TeamMember[] =>
  Array.from({ length: count }, (_, i) => ({
    slug: `${prefix}-${i + 1}`,
    name: "Shady el Barkoky",
    role,
    group,
    ...PHOTOS[i % PHOTOS.length],
    statement: "Meet Shady el Barkoky, bestselling author, strategist, and bold idea thinker",
    bio: Array.from({ length: 6 }, () => PLACEHOLDER_BIO),
    linkedin: "https://www.linkedin.com/",
    instagram: "https://www.instagram.com/",
  }));

// Each group is a multiple of four, so its last row is full at four
// columns (and at two) on the Team page.
export const TEAM: TeamMember[] = [
  ...placeholders("founders", "founder", "Counselor & Co-Founder", 4),
  ...placeholders("partners", "partner", "Partner", 4),
  ...placeholders("seniors", "senior", "Senior Associate", 8),
];

export const getMember = (slug: string) => TEAM.find((member) => member.slug === slug);

/** Everyone else, the member's own group first. */
export const relatedMembers = (member: TeamMember) => [
  ...TEAM.filter((other) => other.group === member.group && other.slug !== member.slug),
  ...TEAM.filter((other) => other.group !== member.group),
];
