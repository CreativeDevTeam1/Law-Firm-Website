import { defineQuery } from "next-sanity";

// The site's GROQ queries. Each projects a document into the shape its type
// in src/content/types.ts describes, so the components never see Sanity's
// own structures (asset references, _type, slugs as objects).

// An image as { src, alt, position }, its hotspot (where the editor put the
// focal point) as a CSS object-position.
const image = /* groq */ `{
  "src": asset->url,
  "alt": coalesce(alt, ""),
  "position": select(defined(hotspot) => string(round(hotspot.x * 100)) + "% " + string(round(hotspot.y * 100)) + "%")
}`;

const link = /* groq */ `{ href, label }`;

const heading = /* groq */ `{ label, title }`;

const hero = /* groq */ `{ "image": image${image}, title, quote, description }`;

const indexItem = /* groq */ `{ title, description, "image": image${image} }`;

const teamMember = /* groq */ `{
  "slug": slug.current,
  name,
  role,
  "photo": photo${image},
  statement,
  bio,
  linkedin,
  instagram
}`;

const article = /* groq */ `{
  "slug": slug.current,
  publishedAt,
  title,
  headline,
  "image": image${image},
  body
}`;

const role = /* groq */ `{
  "slug": slug.current,
  title,
  level,
  location,
  type,
  summary,
  responsibilities,
  requirements
}`;

const testimonial = /* groq */ `{ name, role, quote, "photo": photo${image} }`;

const client = /* groq */ `{ name, "logo": logo${image} }`;

const listingPage = /* groq */ `"hero": hero${hero}, "heading": heading${heading}, intro`;

const articlesByDate = /* groq */ `*[_type == "article" && defined(slug.current)] | order(publishedAt desc, _id asc)`;

export const SITE_SETTINGS_QUERY = defineQuery(/* groq */ `*[_id == "siteSettings"][0]{
  firmName,
  description,
  "mainNav": mainNav[]${link},
  "footerNav": footerNav[]${link},
  "cta": cta${link},
  footerTitle,
  "social": social[]${link},
  "contact": contact[]${link},
  address,
  "legal": legal[]${link}
}`);

export const HOME_PAGE_QUERY = defineQuery(/* groq */ `*[_id == "homePage"][0]{
  "hero": hero${hero},
  "about": about{ "heading": heading${heading}, subtitle, paragraphs, "link": link${link} },
  "clients": clients{ "heading": heading${heading}, "link": link${link}, "clients": clients[]->${client} },
  "partners": partners{ titleLines, "link": link${link}, "members": members[]->${teamMember} },
  "news": news{ "heading": heading${heading}, "link": link${link}, "articles": ${articlesByDate}[0...4]${article} },
  "testimonials": testimonials{ "heading": heading${heading}, "testimonials": testimonials[]->${testimonial} }
}`);

export const ABOUT_PAGE_QUERY = defineQuery(/* groq */ `*[_id == "aboutPage"][0]{
  "hero": hero${hero},
  "whoWeAre": whoWeAre{
    "heading": heading${heading},
    "mission": mission${heading},
    "vision": vision${heading},
    valuesLabel,
    "values": values[]${indexItem}
  },
  "imageReveal": imageReveal${image},
  "practiceAreas": practiceAreas{ "heading": heading${heading}, "areas": areas[]${indexItem} }
}`);

export const TEAM_PAGE_QUERY = defineQuery(/* groq */ `*[_id == "teamPage"][0]{
  ${listingPage},
  "groups": groups[]{ title, "members": members[]->${teamMember} }
}`);

export const NEWS_PAGE_QUERY = defineQuery(/* groq */ `*[_id == "newsPage"][0]{
  ${listingPage},
  "articles": ${articlesByDate}${article}
}`);

export const CAREERS_PAGE_QUERY = defineQuery(/* groq */ `*[_id == "careersPage"][0]{
  "hero": hero${hero},
  "intro": intro{ "heading": heading${heading}, text },
  "openings": openings{ "heading": heading${heading}, "groups": groups[]{ name, "roles": roles[]->${role} } },
  "reasons": reasons{ label, "items": items[]${indexItem} },
  "hiring": hiring{ "heading": heading${heading}, "steps": steps[]{ title, description } },
  "closing": closing${heading},
  offer
}`);

export const TEAM_MEMBER_SLUGS_QUERY = defineQuery(
  /* groq */ `*[_type == "teamMember" && defined(slug.current)].slug.current`,
);

export const ARTICLE_SLUGS_QUERY = defineQuery(/* groq */ `*[_type == "article" && defined(slug.current)].slug.current`);

export const ROLE_SLUGS_QUERY = defineQuery(/* groq */ `*[_type == "role" && defined(slug.current)].slug.current`);

// A member, and everyone else in the Team page's order: their own group
// first (the page lists each member once).
export const TEAM_MEMBER_PAGE_QUERY = defineQuery(/* groq */ `{
  "member": *[_type == "teamMember" && slug.current == $slug][0]${teamMember},
  "groups": *[_id == "teamPage"][0].groups[]{ "members": members[]->${teamMember} }
}`);

// An article, and every article by date, to pick the ones after it.
export const ARTICLE_PAGE_QUERY = defineQuery(/* groq */ `{
  "article": *[_type == "article" && slug.current == $slug][0]${article},
  "articles": ${articlesByDate}${article}
}`);

// A role, and the Careers page's groups, for its practice, what every role
// offers and the other openings.
export const ROLE_PAGE_QUERY = defineQuery(/* groq */ `{
  "role": *[_type == "role" && slug.current == $slug][0]${role},
  "careers": *[_id == "careersPage"][0]{ offer, "groups": openings.groups[]{ name, "roles": roles[]->${role} } }
}`);
