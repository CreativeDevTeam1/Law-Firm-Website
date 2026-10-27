import type { Metadata } from "next";
import NotFoundSection from "@/components/not-found-section";

export const metadata: Metadata = { title: "Page not found" };

// Shown for any URL without a page, and wherever a page calls notFound()
// (an unknown team member, article or role). No Figma frame: modelled on
// justgowiththeflow.com/404.
export default function NotFound() {
  return (
    <main>
      <NotFoundSection />
    </main>
  );
}
