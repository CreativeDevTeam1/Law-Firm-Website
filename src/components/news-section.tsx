"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NewsCard from "@/components/news-card";
import SectionHeading from "@/components/section-heading";
import TextLink from "@/components/text-link";
import { ARTICLES } from "@/lib/news";

gsap.registerPlugin(ScrollTrigger);

// Home page "News & Articles" — Figma "news-&-articles-section": the
// latest four articles (src/lib/news.ts). The heading works like the
// Clients one; the cards slide up and fade in a row at a time as they
// scroll into view, as the Clients cards do.
export default function NewsSection() {
  const gridRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = gsap.utils.toArray<HTMLElement>(".news-card", grid);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const reveal = ScrollTrigger.batch(cards, {
        start: "top bottom",
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { yPercent: 100, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, duration: 1.2, ease: "power3.out", stagger: 0.1 },
          ),
      });

      return () => reveal.forEach((trigger) => trigger.kill());
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="news" aria-labelledby="news-title">
      <SectionHeading id="news-title" label="(News & Articles)" className="news-heading">
        Stay Informed with Our Latest Legal News &amp; Expert Insights
      </SectionHeading>

      <div className="news-link">
        <TextLink href="/news" size="medium" icon="arrow-right" reveal>
          Browse all our news
        </TextLink>
      </div>

      <ul className="news-grid" ref={gridRef}>
        {ARTICLES.slice(0, 4).map((article) => (
          <li key={article.slug}>
            <NewsCard date={article.date} title={article.title} image={article.image} href={`/news/${article.slug}`} />
          </li>
        ))}
      </ul>
    </section>
  );
}
