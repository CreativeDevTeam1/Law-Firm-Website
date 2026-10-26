import Image from "next/image";
import TextLink from "@/components/text-link";

export type NewsCardProps = {
  /** Shown as written, e.g. "16 May 2026". */
  date: string;
  /** Cut to three lines with an ellipsis if longer. */
  title: string;
  image: string;
  /** Alt text for the image. Leave empty when it's only decorative. */
  imageAlt?: string;
  href: string;
  /** Element to render the card as, e.g. "li" inside a list. Default "article". */
  as?: "article" | "li";
  className?: string;
};

// An article card — Figma "Team Member Card" (news variant): image, date,
// title and a "Know more" link.
//
//   <NewsCard date="16 May 2026" title="…" image="/images/…" href="/news/…" />
export default function NewsCard({
  date,
  title,
  image,
  imageAlt = "",
  href,
  as: Tag = "article",
  className = "",
}: NewsCardProps) {
  return (
    <Tag className={`news-card ${className}`.trim()}>
      <div className="news-card-photo">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(min-width: 64rem) 25vw, (min-width: 40rem) 50vw, 100vw"
        />
      </div>
      <div className="news-card-info">
        <p className="news-card-date body">{date}</p>
        <h3 className="news-card-title header-3-semibold">{title}</h3>
        <TextLink href={href} icon="arrow-right">
          Know more
        </TextLink>
      </div>
    </Tag>
  );
}
