import type { Metadata } from "next";
import localFont from "next/font/local";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import PageTransition from "@/components/layout/page-transition";
import SmoothScroll from "@/components/layout/smooth-scroll";
import { getSiteSettings } from "@/content/queries";
import { SanityLive } from "@/sanity/live";
import "./globals.css";

// Only the weights the design system uses (--font-weight-book/medium/semibold).
const suisseIntl = localFont({
  src: [
    {
      path: "../fonts/SuisseIntlTrial-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/SuisseIntlTrial-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/SuisseIntlTrial-Semibold.otf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-suisse-intl",
  display: "swap",
});

// Pages set their own title; it's followed by the firm's name in the tab.
export async function generateMetadata(): Promise<Metadata> {
  const { firmName, description } = await getSiteSettings();
  return { title: { default: firmName, template: `%s | ${firmName}` }, description };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className={suisseIntl.variable}>
      {/* Browser extensions (e.g. ColorZilla) add attributes to <body> before
          React loads; this ignores those attribute differences on <body> only. */}
      <body suppressHydrationWarning>
        <SmoothScroll>
          <PageTransition>
            <Navbar firmName={settings.firmName} links={settings.mainNav} cta={settings.cta} />
            {children}
            <Footer settings={settings} />
          </PageTransition>
        </SmoothScroll>
        {/* Refreshes the cached content when it's published in Sanity. */}
        <SanityLive includeDrafts={false} />
      </body>
    </html>
  );
}
