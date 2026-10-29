import type {
  AboutPage,
  Article,
  ArticlePage,
  CareersPage,
  HomePage,
  NewsPage,
  Role,
  RolePage,
  SiteSettings,
  TeamMember,
  TeamMemberPage,
  TeamPage,
} from "@/content/types";
import { sanityFetch } from "@/sanity/live";
import {
  ABOUT_PAGE_QUERY,
  ARTICLE_PAGE_QUERY,
  ARTICLE_SLUGS_QUERY,
  CAREERS_PAGE_QUERY,
  HOME_PAGE_QUERY,
  NEWS_PAGE_QUERY,
  ROLE_PAGE_QUERY,
  ROLE_SLUGS_QUERY,
  SITE_SETTINGS_QUERY,
  TEAM_MEMBER_PAGE_QUERY,
  TEAM_MEMBER_SLUGS_QUERY,
  TEAM_PAGE_QUERY,
} from "@/sanity/queries";

// Every read of the site's content goes through these functions. Each runs
// its GROQ query (src/sanity/queries.ts) and returns the shape its type in
// src/content/types.ts describes, so pages and components don't know where
// content comes from.
//
// Each function is a 'use cache' boundary. sanityFetch tags the cache with
// what the query read and <SanityLive /> (root layout) refreshes it when
// that content is published, so the pages stay static yet up to date.

/** Runs a query on the published content and returns its result as `T`. */
async function fetchContent<T>(query: string, params: Record<string, string> = {}): Promise<T> {
  const { data } = await sanityFetch({ query, params, perspective: "published", stega: false });
  return data as T;
}

/** A singleton page, which the site can't render without. */
async function fetchPage<T>(query: string, id: string): Promise<T> {
  const page = await fetchContent<T | null>(query);
  if (!page) throw new Error(`The "${id}" document isn't published in Sanity yet.`);
  return page;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";
  return fetchPage<SiteSettings>(SITE_SETTINGS_QUERY, "siteSettings");
}

export async function getHomePage(): Promise<HomePage> {
  "use cache";
  return fetchPage<HomePage>(HOME_PAGE_QUERY, "homePage");
}

export async function getAboutPage(): Promise<AboutPage> {
  "use cache";
  return fetchPage<AboutPage>(ABOUT_PAGE_QUERY, "aboutPage");
}

export async function getTeamPage(): Promise<TeamPage> {
  "use cache";
  return fetchPage<TeamPage>(TEAM_PAGE_QUERY, "teamPage");
}

export async function getNewsPage(): Promise<NewsPage> {
  "use cache";
  return fetchPage<NewsPage>(NEWS_PAGE_QUERY, "newsPage");
}

export async function getCareersPage(): Promise<CareersPage> {
  "use cache";
  return fetchPage<CareersPage>(CAREERS_PAGE_QUERY, "careersPage");
}

export async function getTeamMemberSlugs(): Promise<string[]> {
  "use cache";
  return fetchContent<string[]>(TEAM_MEMBER_SLUGS_QUERY);
}

export async function getArticleSlugs(): Promise<string[]> {
  "use cache";
  return fetchContent<string[]>(ARTICLE_SLUGS_QUERY);
}

export async function getRoleSlugs(): Promise<string[]> {
  "use cache";
  return fetchContent<string[]>(ROLE_SLUGS_QUERY);
}

// The items in `groups` other than `slug`, the group holding it first,
// each listed once in page order.
const othersOwnGroupFirst = <T extends { slug: string }>(groups: T[][], slug: string) => {
  const own = groups.find((group) => group.some((item) => item.slug === slug)) ?? [];
  const ordered = [...own, ...groups.filter((group) => group !== own).flat()];
  return ordered.filter((item, i) => item.slug !== slug && ordered.findIndex((other) => other.slug === item.slug) === i);
};

/** A member and everyone else, their own group first; null for an unknown slug. */
export async function getTeamMemberPage(slug: string): Promise<TeamMemberPage | null> {
  "use cache";
  const { member, groups } = await fetchContent<{
    member: TeamMember | null;
    groups: { members: TeamMember[] }[] | null;
  }>(TEAM_MEMBER_PAGE_QUERY, { slug });
  if (!member) return null;
  return { member, related: othersOwnGroupFirst((groups ?? []).map((group) => group.members), slug) };
}

/**
 * An article and every other one, those after it first, so each page shows
 * different ones up front; null for an unknown slug.
 */
export async function getArticlePage(slug: string): Promise<ArticlePage | null> {
  "use cache";
  const { article, articles } = await fetchContent<{ article: Article | null; articles: Article[] }>(
    ARTICLE_PAGE_QUERY,
    { slug },
  );
  if (!article) return null;
  const i = articles.findIndex((other) => other.slug === slug);
  return { article, related: [...articles.slice(i + 1), ...articles.slice(0, Math.max(i, 0))] };
}

/** A role, its practice group and every other opening, its own group first; null for an unknown slug. */
export async function getRolePage(slug: string): Promise<RolePage | null> {
  "use cache";
  const { role, careers } = await fetchContent<{
    role: Role | null;
    careers: { offer: string[]; groups: { name: string; roles: Role[] }[] } | null;
  }>(ROLE_PAGE_QUERY, { slug });
  if (!role) return null;
  const groups = careers?.groups ?? [];
  return {
    role,
    groupName: groups.find((group) => group.roles.some((other) => other.slug === slug))?.name ?? "",
    offer: careers?.offer ?? [],
    otherRoles: othersOwnGroupFirst(
      groups.map((group) => group.roles),
      slug,
    ),
  };
}
