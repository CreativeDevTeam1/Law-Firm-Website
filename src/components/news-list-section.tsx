"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LineReveal from "@/components/line-reveal";
import NewsCard, { type NewsCardProps } from "@/components/news-card";
import SectionHeading from "@/components/section-heading";

gsap.registerPlugin(ScrollTrigger);

type Article = Pick<NewsCardProps, "date" | "title" | "image" | "href">;

const IMAGES = [
  "/images/home-page/news/article-1.png",
  "/images/home-page/news/article-2.png",
  "/images/home-page/news/article-3.png",
  "/images/home-page/news/article-4.png",
];

// TODO: Figma's placeholder article, twelve times over, until the real
// ones arrive (Figma has thirteen; twelve keeps every row full at one to
// four columns). "Know more" points at this page until articles have pages.
const ARTICLES: Article[] = Array.from({ length: 12 }, (_, i) => ({
  date: "16 May 2026",
  title: "Shady el-Barkoky acted as legal counsel to Coca-Cola HBC",
  image: IMAGES[i % IMAGES.length],
  href: "/news",
}));

// News page — Figma "news-page" (its "team-section" frame). The heading
// and paragraph are laid out like the Team page's (see Page header in
// globals.css); Figma reuses the Team page's copy there, so the heading is
// the home page's News one. Then every article as a card (news-card.tsx):
// one column on small phones, two from 480px, three from 768px and four
// from 1024px. The cards slide up and fade in a row at a time, as on the
// home page.
export default function NewsListSection() {
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
    <section className="news-list" aria-labelledby="news-list-title">
      <div className="page-header">
        <SectionHeading id="news-list-title" label="(News & Articles)" className="page-heading news-list-heading">
          Stay Informed with Our Latest Legal News &amp; Expert Insights
        </SectionHeading>
        <LineReveal className="page-intro body" delay={0.1}>
          Built upon professionalism, integrity, and client-focused
          representation, the firm serves individuals, corporations,
          investors, entrepreneurs, and institutions seeking dependable legal
          counsel in an increasingly complex legal and commercial environment.
        </LineReveal>
      </div>

      <ul className="news-list-grid" ref={gridRef}>
        {ARTICLES.map((article, i) => (
          <NewsCard as="li" key={i} {...article} />
        ))}
      </ul>
    </section>
  );
}
