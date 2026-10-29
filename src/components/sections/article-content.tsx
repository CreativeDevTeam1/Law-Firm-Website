import Image from "next/image";
import RichText from "@/components/ui/rich-text";
import PersonaMarquee from "@/components/ui/persona-marquee";
import SectionHeading from "@/components/ui/section-heading";
import type { Article } from "@/content/types";
import { formatDate } from "@/lib/format";

type ArticleContentProps = { article: Article };

// An article's page — Figma "news-page" › "persona-page"
// ("persona-content-wrapper"), opened like a team member's page with the
// firm's logo looping across the screen (persona-marquee.tsx) and the photo
// rising over it. Then the photo (columns 2–11 from 1024px), the
// headline with the date set into its first line where Figma leaves the
// indent for a label (as the home headings do), and the body in columns
// 6–10. On phones it all stacks.
export default function ArticleContent({ article }: ArticleContentProps) {
  return (
    <article className="article" aria-labelledby="article-title">
      <PersonaMarquee />

      <div className="article-photo">
        <Image
          src={article.image.src}
          alt={article.image.alt}
          fill
          sizes="(min-width: 64rem) 77vw, 100vw"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      <SectionHeading
        as="h1"
        id="article-title"
        label={formatDate(article.publishedAt)}
        className="article-headline"
      >
        {article.headline}
      </SectionHeading>

      <div className="article-body">
        <RichText value={article.body} />
      </div>
    </article>
  );
}
