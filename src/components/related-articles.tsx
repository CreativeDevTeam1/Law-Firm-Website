import NewsCard from "@/components/news-card";
import RelatedCarousel from "@/components/related-carousel";
import type { Article } from "@/lib/news";

type RelatedArticlesProps = { articles: Article[] };

// The end of an article's page: "(Related Articles)" and the other
// articles as cards in the related carousel (related-carousel.tsx).
export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  return (
    <RelatedCarousel id="related-articles" label="(Related Articles)" itemName="article">
      {articles.map((article) => (
        <li className="related-item" key={article.slug}>
          <NewsCard date={article.date} title={article.title} image={article.image} href={`/news/${article.slug}`} />
        </li>
      ))}
    </RelatedCarousel>
  );
}
