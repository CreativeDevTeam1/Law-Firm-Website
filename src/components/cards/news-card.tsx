import Image from "next/image";
import Link from "next/link";
import { TextLinkLabel } from "@/components/ui/text-link";
import type { Article } from "@/content/types";
import { formatDate } from "@/lib/format";

type NewsCardProps = { article: Article; className?: string };

// An article card — Figma "Team Member Card" (news variant): image, date,
// title (cut to three lines) and "Know more". As with the teams card, the
// whole card is the link to the article; "Know more" is its label, and its
// underline and arrow move as the card is hovered or focused. The image is
// left out of the link's name (the title is already in it).
//
//   <NewsCard article={article} />
export default function NewsCard({ article, className = "" }: NewsCardProps) {
  return (
    <Link href={`/news/${article.slug}`} className={`news-card ${className}`.trim()}>
      <div className="news-card-photo">
        <Image
          src={article.image.src}
          alt=""
          fill
          sizes="(min-width: 64rem) 25vw, (min-width: 30rem) 50vw, 100vw"
        />
      </div>
      <div className="news-card-info">
        <p className="news-card-date body">
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        </p>
        <h3 className="news-card-title header-3-semibold">{article.title}</h3>
        <TextLinkLabel icon="arrow-right">Know more</TextLinkLabel>
      </div>
    </Link>
  );
}
