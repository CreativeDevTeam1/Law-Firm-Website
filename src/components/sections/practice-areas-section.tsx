"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LineReveal from "@/components/ui/line-reveal";
import SectionHeading from "@/components/ui/section-heading";

gsap.registerPlugin(ScrollTrigger, CustomEase);

type PracticeArea = {
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
};

// TODO: Figma has a photo for Corporate & Commercial Law only; the rest
// cycle through the site's other photos until each area has its own.
// Three photos on a two-column grid, so cards side by side never match.
const IMAGES = [
  "/images/about-page/practice-corporate.png",
  "/images/about-page/boardroom.png",
  "/images/home-page/shady-elbarkoky.webp",
];

const PRACTICE_AREAS: PracticeArea[] = [
  {
    title: "Corporate & Commercial Law",
    description:
      "Legal support for companies, shareholders, entrepreneurs, commercial entities, and corporate governance matters.",
  },
  {
    title: "Litigation & Dispute Resolution",
    description:
      "Representation before courts of all levels in civil, commercial, administrative, labour, family, and other judicial proceedings.",
  },
  {
    title: "Criminal Law",
    description:
      "Comprehensive legal defence and representation throughout criminal investigations, prosecutions, and court proceedings.",
  },
  {
    title: "Arbitration",
    description:
      "Representation in domestic and international arbitration proceedings together with strategic dispute resolution services.",
  },
  {
    title: "Investment & Business Establishment",
    description:
      "Legal support for investors, business formation, corporate structuring, regulatory compliance, and investment projects.",
  },
  {
    title: "Oil & Gas",
    description:
      "Legal advisory services relating to commercial transactions, contractual matters, regulatory compliance, and sector-specific legal issues.",
  },
  {
    title: "Contract Drafting & Legal Documentation",
    description:
      "Preparation, review, negotiation, and legal analysis of contracts and commercial agreements.",
  },
  {
    title: "Employment & Labour Law",
    description:
      "Advising employers and employees regarding employment relationships, workplace regulations, contractual matters, and labour disputes.",
  },
  {
    title: "Real Estate & Property Law",
    description:
      "Legal services relating to property transactions, ownership matters, development projects, and real estate disputes.",
  },
  {
    title: "Banking & Financial Matters",
    description:
      "Legal assistance concerning financial transactions, banking relationships, and commercial finance documentation.",
  },
  {
    title: "Intellectual Property",
    description:
      "Protection and management of intellectual property rights, trademarks, copyrights, and related legal matters.",
  },
  {
    title: "Tax & Regulatory Compliance",
    description:
      "Legal guidance concerning compliance obligations and regulatory matters affecting businesses and individuals.",
  },
  {
    title: "General Legal Consultancy",
    description:
      "Ongoing legal advice tailored to the evolving legal and commercial needs of our clients.",
  },
].map((area, i) => ({ ...area, image: IMAGES[i % IMAGES.length] }));

// justgowiththeflow.com's "primary-ease" and reveal length.
const REVEAL_EASE = CustomEase.create("practice-reveal", "0.62, 0.05, 0.01, 0.99");
const REVEAL_DURATION = 1.47;

// About page "Practice area", laid out like justgowiththeflow.com's work grid
// (section-work-grid; its index.js and style.css): the heading, then a card
// per area — a 5:4 photo with the title and description under it.
// Two columns from 720px, one below.
//
// Each photo opens once as its card scrolls in (the reference's styled-media
// reveal): a cover in the section's colour shrinks up off it while the photo
// settles from 150% scale. The text slides up line by line (LineReveal).
// With reduced motion everything is simply shown.
export default function PracticeAreasSection() {
  const gridRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      grid.querySelectorAll<HTMLElement>(".practice-card-photo").forEach((photo) => {
        gsap
          .timeline({
            defaults: { ease: REVEAL_EASE, duration: REVEAL_DURATION },
            // Not once: true, which can crash ScrollTrigger (use-line-reveal.ts).
            scrollTrigger: { trigger: photo, start: "top 90%", toggleActions: "play none none none" },
          })
          .fromTo(photo.querySelector(".practice-card-cover"), { scaleY: 1 }, { scaleY: 0 }, 0)
          .fromTo(photo.querySelector(".practice-card-media"), { scale: 1.5 }, { scale: 1 }, 0);
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="practice-areas" aria-labelledby="practice-areas-title">
      <SectionHeading id="practice-areas-title" label="(Practice area)" className="practice-areas-heading">
        We provide legal services across a wide range of practice areas,
        enabling clients to obtain comprehensive legal support through a
        single trusted legal partner.
      </SectionHeading>

      <ul className="practice-areas-grid" ref={gridRef} data-navbar-blend>
        {PRACTICE_AREAS.map((area) => (
          <li className="practice-card" key={area.title}>
            <div className="practice-card-photo">
              <div className="practice-card-media">
                <Image
                  src={area.image}
                  alt={area.imageAlt ?? ""}
                  fill
                  sizes="(min-width: 45rem) 50vw, 100vw"
                />
              </div>
              <div className="practice-card-cover" />
            </div>
            <div className="practice-card-info">
              <LineReveal as="h3" className="practice-card-title header-3-medium">
                {area.title}
              </LineReveal>
              <LineReveal className="practice-card-text body" delay={0.07}>
                {area.description}
              </LineReveal>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
