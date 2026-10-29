import Image from "next/image";
import type { Testimonial } from "@/content/types";

type TestimonialCardProps = { testimonial: Testimonial; className?: string };

// A testimonial card — Figma "testimonials-section" card: the client's photo
// (in a circle), name and role, then their quote.
//
//   <TestimonialCard testimonial={testimonial} />
export default function TestimonialCard({ testimonial, className = "" }: TestimonialCardProps) {
  return (
    <article className={`testimonial-card ${className}`.trim()}>
      <div className="testimonial-profile">
        <div className="testimonial-photo">
          <Image src={testimonial.photo.src} alt={testimonial.photo.alt} fill sizes="72px" />
        </div>
        <div className="testimonial-person">
          <h3 className="testimonial-name header-3-medium">{testimonial.name}</h3>
          <p className="testimonial-role body">{testimonial.role}</p>
        </div>
      </div>
      <blockquote className="testimonial-quote body">{testimonial.quote}</blockquote>
    </article>
  );
}
