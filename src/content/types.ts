import type { PortableTextBlock } from "next-sanity";

// The site's content model: every piece of copy, image and list the pages
// show. Pages read it only through src/content/queries.ts, and pass it down
// to the components as props, so no component holds content of its own.
//
// It mirrors the Sanity schemas in ../studio-law-firm-website/schemaTypes,
// field for field. Shapes are what the components need once a query has
// resolved them: an image is its URL and alt text, not an asset reference,
// and a reference to another document is that document itself.

/** An image as the components use it: the asset's URL, its alt text, and its hotspot as a crop. */
export type ImageAsset = {
  src: string;
  /** Empty when the image is only decorative. */
  alt: string;
  /** Crop of the image (CSS object-position), e.g. "21% 0%". Default centred. */
  position?: string;
};

export type Link = { href: string; label: string };

/**
 * A heading with its label set into the first line, e.g. "About" (shown as
 * "(About)") and the title after it. A title can hold line breaks ("\n")
 * where the design sets them.
 */
export type Heading = { label: string; title: string };

/** A page's opening photo, title, quote and paragraph (hero-section.tsx). */
export type Hero = {
  image: ImageAsset;
  title: string;
  quote: string;
  description: string;
};

/** A row in an editorial index: a core value, a reason to join, a practice area. */
export type IndexItem = {
  title: string;
  description: string;
  image?: ImageAsset;
};

export type Step = { title: string; description: string };

/** Rich text from the CMS (Portable Text): paragraphs with bold, italics and links. */
export type RichText = PortableTextBlock[];

// Documents shared across the site

/** Singleton: the navbar, footer and contact details on every page. */
export type SiteSettings = {
  firmName: string;
  /** The default <meta name="description">. */
  description: string;
  mainNav: Link[];
  footerNav: Link[];
  /** The "Consult Us" call to action in the navbar, mobile menu and footer. */
  cta: Link;
  footerTitle: string;
  social: Link[];
  contact: Link[];
  /** One line per entry. */
  address: string[];
  legal: Link[];
};

export type Client = { name: string; logo: ImageAsset };

export type Testimonial = {
  name: string;
  /** The client's job title, e.g. "Founder & CEO". */
  role: string;
  quote: string;
  photo: ImageAsset;
};

export type TeamMember = {
  /** The member's page: /team/{slug}. */
  slug: string;
  name: string;
  role: string;
  photo: ImageAsset;
  /** The heading next to their name on their page. */
  statement: string;
  bio: RichText;
  linkedin?: string;
  instagram?: string;
};

export type Article = {
  /** The article's page: /news/{slug}. */
  slug: string;
  /** ISO date, e.g. "2026-10-21"; shown with formatDate(). */
  publishedAt: string;
  /** The short title on cards. */
  title: string;
  /** The full title at the top of the article's page. */
  headline: string;
  image: ImageAsset;
  body: RichText;
};

export type Role = {
  /** The role's page: /careers/{slug}. */
  slug: string;
  title: string;
  /** e.g. "5+ years" or "Law students". */
  level: string;
  location: string;
  type: "Full-time" | "Internship";
  /** The opening paragraph on the role's page. */
  summary: string;
  responsibilities: string[];
  requirements: string[];
};

/** A level of the firm on the Team page, e.g. "Founders", with its members in order. */
export type TeamGroup = { title: string; members: TeamMember[] };

/** A practice group on the Careers page, e.g. "Corporate & Commercial", with its openings in order. */
export type RoleGroup = { name: string; roles: Role[] };

// Page singletons

export type HomePage = {
  hero: Hero;
  about: {
    heading: Heading;
    subtitle: string;
    paragraphs: string[];
    link: Link;
  };
  clients: { heading: Heading; link: Link; clients: Client[] };
  /** The title's words, one line each, e.g. ["Partners", "Behind", "the Firm"]. */
  partners: { titleLines: string[]; link: Link; members: TeamMember[] };
  /** The latest articles are added by the query. */
  news: { heading: Heading; link: Link; articles: Article[] };
  testimonials: { heading: Heading; testimonials: Testimonial[] };
};

export type AboutPage = {
  hero: Hero;
  whoWeAre: {
    heading: Heading;
    mission: Heading;
    vision: Heading;
    valuesLabel: string;
    values: IndexItem[];
  };
  imageReveal: ImageAsset;
  practiceAreas: { heading: Heading; areas: IndexItem[] };
};

/** The Team and News pages: a hero, then a heading and paragraph over a list. */
export type ListingPage = {
  hero: Hero;
  heading: Heading;
  intro: string;
};

export type TeamPage = ListingPage & { groups: TeamGroup[] };

/** Every article, the newest first, is added by the query. */
export type NewsPage = ListingPage & { articles: Article[] };

export type CareersPage = {
  hero: Hero;
  intro: { heading: Heading; text: string };
  openings: { heading: Heading; groups: RoleGroup[] };
  reasons: { label: string; items: IndexItem[] };
  hiring: { heading: Heading; steps: Step[] };
  closing: Heading;
  /** What every role comes with, shown on each role's page. */
  offer: string[];
};

// What the detail pages get from their queries

export type TeamMemberPage = { member: TeamMember; related: TeamMember[] };

export type ArticlePage = { article: Article; related: Article[] };

export type RolePage = {
  role: Role;
  /** The practice group the role is listed under. */
  groupName: string;
  offer: string[];
  otherRoles: Role[];
};
