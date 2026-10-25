"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useLineReveal, type LineRevealOptions } from "@/hooks/use-line-reveal";

type LineRevealProps = LineRevealOptions & {
  /** Element to render, e.g. "h1", "h2", "p", "blockquote". Default "p". */
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

// Text that reveals line by line, by default when it scrolls into view.
//
//   <LineReveal as="h2" className="header-1">Our Practice Areas</LineReveal>
//   <LineReveal as="h1" play="load" delay={0.2}>…</LineReveal>
//   <LineReveal stagger={0.12} start="top 70%">…</LineReveal>
export default function LineReveal({
  as: Tag = "p",
  className = "",
  children,
  ...options
}: LineRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useLineReveal(ref, options);

  return (
    <Tag ref={ref} className={`line-reveal ${className}`.trim()}>
      {children}
    </Tag>
  );
}
