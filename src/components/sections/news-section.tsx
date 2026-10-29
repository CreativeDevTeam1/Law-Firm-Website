"use client";

import { useRef } from "react";
import NewsCard from "@/components/cards/news-card";
import SectionHeading from "@/components/ui/section-heading";
import TextLink from "@/components/ui/text-link";
import type { HomePage } from "@/content/types";
import { useBatchReveal } from "@/hooks/use-batch-reveal";

type NewsSectionProps = { news: HomePage["news"] };

// Home page "News & Articles" — Figma "news-&-articles-section": the
// latest articles. The heading works like the Clients one; the cards slide
// up and fade in a row at a time as they scroll into view, as the Clients
// cards do.
export default function NewsSection({ news: { heading, link, articles } }: NewsSectionProps) {
  const gridRef = useRef<HTMLUListElement>(null);
  useBatchReveal(gridRef, ".news-card");

  return (
    <section className="news" aria-labelledby="news-title">
      <SectionHeading id="news-title" label={heading.label} className="news-heading">
        {heading.title}
      </SectionHeading>

      <div className="news-link">
        <TextLink href={link.href} size="medium" icon="arrow-right" reveal>
          {link.label}
        </TextLink>
      </div>

      <ul className="news-grid" ref={gridRef}>
        {articles.map((article) => (
          <li key={article.slug}>
            <NewsCard article={article} />
          </li>
        ))}
      </ul>
    </section>
  );
}
