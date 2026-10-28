import Image from "next/image";

export type TestimonialCardProps = {
  name: string;
  /** The client's job title or role, e.g. "Founder & CEO". */
  role: string;
  quote: string;
  /** The client's photo, shown in a circle. */
  image: string;
  /** Alt text for the photo. Leave empty when the name beside it says it all. */
  imageAlt?: string;
  className?: string;
};

// A testimonial card — Figma "testimonials-section" card: the client's photo,
// name and role, then their quote.
//
//   <TestimonialCard name="…" role="…" quote="…" image="/images/…" />
export default function TestimonialCard({
  name,
  role,
  quote,
  image,
  imageAlt = "",
  className = "",
}: TestimonialCardProps) {
  return (
    <article className={`testimonial-card ${className}`.trim()}>
      <div className="testimonial-profile">
        <div className="testimonial-photo">
          <Image src={image} alt={imageAlt} fill sizes="72px" />
        </div>
        <div className="testimonial-person">
          <h3 className="testimonial-name header-3-medium">{name}</h3>
          <p className="testimonial-role body">{role}</p>
        </div>
      </div>
      <blockquote className="testimonial-quote body">{quote}</blockquote>
    </article>
  );
}
