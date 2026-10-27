import Image from "next/image";
import LineReveal from "@/components/line-reveal";
import PersonaMarquee from "@/components/persona-marquee";
import SectionHeading from "@/components/section-heading";
import type { Article } from "@/lib/news";

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
          src={article.image}
          alt=""
          fill
          sizes="(min-width: 64rem) 77vw, 100vw"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      <SectionHeading
        as="h1"
        id="article-title"
        label={`(${article.date})`}
        className="article-headline"
      >
        {article.headline}
      </SectionHeading>

      <div className="article-body">
        {article.body.map((paragraph, i) => (
          <LineReveal className="body-big" key={i}>
            {paragraph}
          </LineReveal>
        ))}
      </div>
    </article>
  );
}
