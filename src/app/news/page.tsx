import type { Metadata } from "next";
import HeroSection from "@/components/sections/hero-section";
import NewsListSection from "@/components/sections/news-list-section";
import { getNewsPage } from "@/content/queries";

export const metadata: Metadata = { title: "News & Insight" };

export default async function News() {
  const news = await getNewsPage();

  return (
    <main>
      <HeroSection hero={news.hero} />
      <NewsListSection news={news} />
    </main>
  );
}
