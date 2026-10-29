import NewsCard from "@/components/cards/news-card";
import RelatedCarousel from "@/components/ui/related-carousel";
import type { Article } from "@/content/types";

type RelatedArticlesProps = { articles: Article[] };

// The end of an article's page: "(Related Articles)" and the other
// articles as cards in the related carousel (related-carousel.tsx).
export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  return (
    <RelatedCarousel id="related-articles" label="(Related Articles)" itemName="article">
      {articles.map((article) => (
        <li className="related-item" key={article.slug}>
          <NewsCard article={article} />
        </li>
      ))}
    </RelatedCarousel>
  );
}
