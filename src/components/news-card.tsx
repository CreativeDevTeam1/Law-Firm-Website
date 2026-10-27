import Image from "next/image";
import Link from "next/link";
import { TextLinkLabel } from "@/components/text-link";

export type NewsCardProps = {
  /** Shown as written, e.g. "16 May 2026". */
  date: string;
  /** Cut to three lines with an ellipsis if longer. */
  title: string;
  image: string;
  href: string;
  className?: string;
};

// An article card — Figma "Team Member Card" (news variant): image, date,
// title and "Know more". As with the teams card, the whole card is the link
// to the article; "Know more" is its label, and its underline and arrow
// move as the card is hovered or focused. The image is left out of the
// link's name (the title is already in it).
//
//   <NewsCard date="16 May 2026" title="…" image="/images/…" href="/news/…" />
export default function NewsCard({ date, title, image, href, className = "" }: NewsCardProps) {
  return (
    <Link href={href} className={`news-card ${className}`.trim()}>
      <div className="news-card-photo">
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 64rem) 25vw, (min-width: 40rem) 50vw, 100vw"
        />
      </div>
      <div className="news-card-info">
        <p className="news-card-date body">{date}</p>
        <h3 className="news-card-title header-3-semibold">{title}</h3>
        <TextLinkLabel icon="arrow-right">Know more</TextLinkLabel>
      </div>
    </Link>
  );
}
