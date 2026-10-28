import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleContent from "@/components/sections/article-content";
import RelatedArticles from "@/components/sections/related-articles";
import { ARTICLES, getArticle, relatedArticles } from "@/lib/news";

// Every article's page is built ahead of time; any other slug is a 404
// (dynamicParams isn't available with Cache Components, so it's checked here).
export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const article = getArticle((await params).slug);
  return article ? { title: article.title } : {};
}

// As the team member pages: the slug is read inside Suspense, so the
// page's shell is the same for every article and navigating to one is
// instant. The placeholder holds a screen's height so the footer doesn't
// flash up meanwhile.
export default function NewsArticle({ params }: PageProps<"/news/[slug]">) {
  return (
    <main>
      <Suspense fallback={<div className="persona-placeholder" />}>
        <Entry params={params} />
      </Suspense>
    </main>
  );
}

async function Entry({ params }: Pick<PageProps<"/news/[slug]">, "params">) {
  const article = getArticle((await params).slug);
  if (!article) notFound();

  return (
    <>
      <ArticleContent article={article} />
      <RelatedArticles articles={relatedArticles(article)} />
    </>
  );
}
