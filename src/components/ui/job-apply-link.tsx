"use client";

import { useLenis } from "lenis/react";
import TextLink from "@/components/ui/text-link";

// "Apply for this role": glides down to the application form at the end of
// the page (job-application.tsx) with the site's smooth scrolling, rather
// than jumping there.
export default function JobApplyLink() {
  const lenis = useLenis();

  return (
    <TextLink
      href="#apply"
      size="medium"
      icon="arrow-right"
      className="job-apply"
      onClick={(event) => {
        if (!lenis) return;
        event.preventDefault();
        lenis.scrollTo("#apply");
      }}
    >
      Apply for this role
    </TextLink>
  );
}
