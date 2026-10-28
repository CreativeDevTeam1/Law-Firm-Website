import HeroSection from "@/components/sections/hero-section";
import NewsListSection from "@/components/sections/news-list-section";

export default function News() {
  return (
    <main>
      <HeroSection
        image="/images/home-page/news/cinematic-contract-review.png"
        imageAlt="A lawyer reviewing a contract at a desk overlooking the Nile and the Giza pyramids"
        title={
          <>
            Legal Insight for
            <br />
            the Decisions Ahead.
          </>
        }
        quote="Clients deserve to understand not only what the law says, but what it means for the choices in front of them."
        description="Our news and articles follow legislative change, court practice, and market developments in Egypt, explained clearly for the businesses, investors, and individuals we advise."
      />
      <NewsListSection />
    </main>
  );
}
