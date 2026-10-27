export type RoleGroup = "corporate" | "litigation" | "support";

export type Role = {
  /** The role's page: /careers/{slug}. */
  slug: string;
  title: string;
  group: RoleGroup;
  /** e.g. "5+ years" or "Law students". */
  level: string;
  location: string;
  type: "Full-time" | "Internship";
  /** The opening paragraph on the role's page. */
  summary: string;
  responsibilities: string[];
  requirements: string[];
};

export const ROLE_GROUPS: { id: RoleGroup; label: string; name: string }[] = [
  { id: "corporate", label: "(Corporate & Commercial)", name: "Corporate & Commercial" },
  { id: "litigation", label: "(Litigation & Disputes)", name: "Litigation & Disputes" },
  { id: "support", label: "(Business Support)", name: "Business Support" },
];

/** What every role comes with, shown on each role's page. */
export const ROLE_OFFER = [
  "Close mentorship from the firm’s founders and partners.",
  "Meaningful work and client contact from your first months.",
  "Sponsored courses, internal training and time set aside to learn.",
  "A competitive package, reviewed every year.",
  "A modern office in New Cairo and a close, collegial team.",
];

// TODO: placeholders until the firm's real openings arrive. "Apply" goes to
// the contact page until there's an application flow.
export const ROLES: Role[] = [
  {
    slug: "senior-associate-corporate",
    title: "Senior Associate",
    group: "corporate",
    level: "6+ years",
    location: "New Cairo",
    type: "Full-time",
    summary:
      "We’re looking for a Senior Associate to lead corporate and commercial matters for local and international clients, from structuring and negotiation through to completion, and to help develop the associates around them.",
    responsibilities: [
      "Lead mergers, acquisitions, joint ventures and restructurings, managing each matter end to end.",
      "Draft and negotiate shareholder agreements, commercial contracts and transaction documents.",
      "Advise clients’ boards and management on corporate governance and regulatory compliance.",
      "Supervise and review the work of associates and paralegals, and take part in their training.",
      "Build lasting client relationships and contribute to the growth of the practice.",
    ],
    requirements: [
      "A law degree and membership of the Egyptian Bar Association.",
      "Six or more years of corporate and commercial experience, at a firm or in-house.",
      "A track record of leading transactions with minimal supervision.",
      "Excellent legal drafting in Arabic and English.",
      "Sound judgment, discretion and the confidence to advise senior clients.",
    ],
  },
  {
    slug: "associate-corporate",
    title: "Associate",
    group: "corporate",
    level: "3–5 years",
    location: "New Cairo",
    type: "Full-time",
    summary:
      "As an Associate in our Corporate & Commercial practice, you’ll work on transactions and advisory matters across sectors, taking real responsibility for drafting, research and client communication.",
    responsibilities: [
      "Draft and review commercial contracts, corporate resolutions and transaction documents.",
      "Carry out legal due diligence and prepare clear, practical reports for clients.",
      "Research corporate, commercial and investment law questions and present your findings.",
      "Handle company formations, amendments and filings with the relevant authorities.",
      "Take part in client meetings and negotiations alongside the firm’s partners.",
    ],
    requirements: [
      "A law degree and membership of the Egyptian Bar Association.",
      "Three to five years of corporate or commercial experience.",
      "Strong drafting and research skills in Arabic and English.",
      "Careful attention to detail and the ability to manage several matters at once.",
    ],
  },
  {
    slug: "associate-litigation",
    title: "Associate",
    group: "litigation",
    level: "3–5 years",
    location: "New Cairo",
    type: "Full-time",
    summary:
      "We’re looking for a litigation Associate to represent clients before Egyptian courts and arbitral tribunals in commercial, civil and administrative disputes.",
    responsibilities: [
      "Prepare pleadings, memoranda and submissions in commercial, civil and administrative cases.",
      "Attend hearings and represent clients before courts and arbitral tribunals.",
      "Analyse case files, build legal strategy and advise clients on the strength of their position.",
      "Manage case timelines, filings and correspondence with courts and opposing counsel.",
      "Support pre-litigation negotiations and settlements.",
    ],
    requirements: [
      "A law degree and membership of the Egyptian Bar Association, with rights of audience.",
      "Three to five years of litigation experience.",
      "Persuasive written and oral advocacy in Arabic; good English is a strong advantage.",
      "Composure under pressure and a rigorous approach to preparation.",
    ],
  },
  {
    slug: "junior-associate-litigation",
    title: "Junior Associate",
    group: "litigation",
    level: "0–2 years",
    location: "New Cairo",
    type: "Full-time",
    summary:
      "A first step in litigation alongside experienced advocates: as a Junior Associate you’ll learn how disputes are built and won, from research and drafting to the courtroom.",
    responsibilities: [
      "Research legal questions and case law to support the litigation team.",
      "Draft first versions of pleadings, notices and memoranda for review.",
      "Attend hearings with senior lawyers and follow up on court procedures and filings.",
      "Organise case files, evidence and deadlines.",
    ],
    requirements: [
      "A law degree, with membership of the Egyptian Bar Association or close to it.",
      "Up to two years of experience; strong graduates are welcome to apply.",
      "Clear writing in Arabic and a working command of English.",
      "Curiosity, reliability and a willingness to learn quickly.",
    ],
  },
  {
    slug: "paralegal",
    title: "Paralegal",
    group: "support",
    level: "2+ years",
    location: "New Cairo",
    type: "Full-time",
    summary:
      "Our Paralegal keeps matters moving across the firm, supporting lawyers in every practice with research, documents and filings.",
    responsibilities: [
      "Prepare, format and proofread legal documents, contracts and correspondence.",
      "Assist with due diligence, document review and legal research.",
      "Handle filings and follow-ups with courts, registries and government authorities.",
      "Maintain organised, confidential case files and matter records.",
    ],
    requirements: [
      "A degree in law or a related field.",
      "Two or more years of experience as a paralegal or in a similar role.",
      "Excellent organisation and accuracy, with strong Arabic and English.",
      "Discretion with confidential client information.",
    ],
  },
  {
    slug: "legal-secretary",
    title: "Legal Secretary",
    group: "support",
    level: "2+ years",
    location: "New Cairo",
    type: "Full-time",
    summary:
      "As Legal Secretary you’ll be at the centre of the firm’s day, supporting the partners and making sure every client is received and looked after properly.",
    responsibilities: [
      "Manage the partners’ calendars, meetings and correspondence.",
      "Prepare and format documents, letters and presentations.",
      "Welcome clients and visitors and handle calls with professionalism.",
      "Keep records, files and the firm’s document system in order.",
    ],
    requirements: [
      "Two or more years of experience as a secretary or executive assistant, ideally at a law firm.",
      "Fluent Arabic and English, written and spoken.",
      "Excellent organisation and confidence with office software.",
      "A calm, courteous manner and complete discretion.",
    ],
  },
  {
    slug: "summer-legal-intern",
    title: "Summer Legal Intern",
    group: "support",
    level: "Law students",
    location: "New Cairo",
    type: "Internship",
    summary:
      "A summer at the firm for law students who want to see how legal practice really works, rotating across our practice groups with a lawyer to guide you.",
    responsibilities: [
      "Support lawyers with legal research and first drafts.",
      "Attend client meetings and court hearings as an observer.",
      "Take part in training sessions led by the firm’s lawyers.",
      "Present a short research project at the end of the summer.",
    ],
    requirements: [
      "Currently studying law, in your third year or above.",
      "Good academic standing and clear writing in Arabic and English.",
      "Curiosity about legal practice and a professional attitude.",
    ],
  },
];

export const getRole = (slug: string) => ROLES.find((role) => role.slug === slug);

/** The role's practice group, as ROLE_GROUPS has it. */
export const roleGroup = (role: Role) => ROLE_GROUPS.find((group) => group.id === role.group)!;

/** Every other opening, the role's own group first. */
export const otherRoles = (role: Role) => [
  ...ROLES.filter((other) => other.group === role.group && other.slug !== role.slug),
  ...ROLES.filter((other) => other.group !== role.group),
];
