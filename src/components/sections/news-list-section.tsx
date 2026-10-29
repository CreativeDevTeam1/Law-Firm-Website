"use client";

import { useRef } from "react";
import LineReveal from "@/components/ui/line-reveal";
import NewsCard from "@/components/cards/news-card";
import SectionHeading from "@/components/ui/section-heading";
import type { NewsPage } from "@/content/types";
import { useBatchReveal } from "@/hooks/use-batch-reveal";

type NewsListSectionProps = { news: NewsPage };

// News page — Figma "news-page" (its "team-section" frame). The heading
// and paragraph are laid out like the Team page's (see Page header in
// globals.css). Then every article as a card (news-card.tsx): one column
// on small phones, two from 480px, three from 768px and four from 1024px.
// The cards slide up and fade in a row at a time, as on the home page.
export default function NewsListSection({ news: { heading, intro, articles } }: NewsListSectionProps) {
  const gridRef = useRef<HTMLUListElement>(null);
  useBatchReveal(gridRef, ".news-card");

  return (
    <section className="news-list" aria-labelledby="news-list-title">
      <div className="page-header">
        <SectionHeading id="news-list-title" label={heading.label} className="page-heading news-list-heading">
          {heading.title}
        </SectionHeading>
        <LineReveal className="page-intro body" delay={0.1}>
          {intro}
        </LineReveal>
      </div>

      <ul className="news-list-grid" ref={gridRef}>
        {articles.map((article) => (
          <li key={article.slug}>
            <NewsCard article={article} />
          </li>
        ))}
      </ul>
    </section>
  );
}
