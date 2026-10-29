import { Suspense } from "react";
import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import ClientIntakeForm from "@/components/forms/client-intake-form";
import { GLOSSARY, toLang } from "@/lib/glossary";

// Suisse Intl has no Arabic, so Arabic text on this page is set in IBM Plex
// Sans Arabic (see Arabic text in globals.css), in the weights the design
// system uses. Loaded here, so only this page downloads it.
const plexArabic = IBM_Plex_Sans_Arabic({
  weight: ["400", "500", "600"],
  subsets: ["arabic"],
  variable: "--font-plex-arabic",
  display: "swap",
});

// The tab's title in the page's language; the form changes it on switching.
// It streams in with the form, which waits for the language too.
export async function generateMetadata({ searchParams }: PageProps<"/client-intake">): Promise<Metadata> {
  const lang = toLang((await searchParams).lang);
  return { title: GLOSSARY[lang].intake.pageTitle };
}

// No Figma frame: designed from the old intake form's fields and the other
// pages' patterns. No hero, so the form is straight in reach. ?lang=ar opens
// it in Arabic, so the firm can send Arabic-speaking clients straight there.
// The language is only known at request time, so the form streams in behind
// an empty section in the page's colour.
export default function ClientIntake({ searchParams }: PageProps<"/client-intake">) {
  return (
    <main className={plexArabic.variable}>
      <Suspense fallback={<section className="intake" />}>
        {searchParams.then(({ lang }) => (
          <ClientIntakeForm initialLang={toLang(lang)} />
        ))}
      </Suspense>
    </main>
  );
}
