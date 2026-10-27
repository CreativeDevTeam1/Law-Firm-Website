export type Article = {
  /** The article's page: /news/{slug}. */
  slug: string;
  /** Shown as written, e.g. "16 May 2026". */
  date: string;
  /** The short title on cards. */
  title: string;
  /** The full title at the top of the article's page. */
  headline: string;
  image: string;
  body: string[];
};

const IMAGES = [
  "/images/home-page/news/article-1.png",
  "/images/home-page/news/article-2.png",
  "/images/home-page/news/article-3.png",
  "/images/home-page/news/article-4.png",
];

const PLACEHOLDER_PARAGRAPH =
  "Providing comprehensive legal services across a broad spectrum of practice areas, Shady El-Barkoky Law Firm serves individuals, corporations, investors, entrepreneurs, and institutions with dedication, professionalism, and strategic legal insight.";

// TODO: Figma's placeholder article, twelve times over, until the real
// ones arrive (Figma has thirteen on the News page; twelve keeps every row
// full at one to four columns): its card title, the article page's
// headline and its one paragraph six times over, with the four news photos
// cycling. Slugs are by position until there are real titles.
export const ARTICLES: Article[] = Array.from({ length: 12 }, (_, i) => ({
  slug: `article-${i + 1}`,
  date: "16 May 2026",
  title: "Shady el-Barkoky acted as legal counsel to Coca-Cola HBC",
  headline:
    "Shady el-Barkoky acted as legal counsel to Coca-Cola HBC on the establishment of its new Digital Hub in Egypt",
  image: IMAGES[i % IMAGES.length],
  body: Array.from({ length: 6 }, () => PLACEHOLDER_PARAGRAPH),
}));

export const getArticle = (slug: string) => ARTICLES.find((article) => article.slug === slug);

/** Every other article, the ones after it first, so each page shows different ones up front. */
export const relatedArticles = (article: Article) => {
  const i = ARTICLES.indexOf(article);
  return [...ARTICLES.slice(i + 1), ...ARTICLES.slice(0, i)];
};
