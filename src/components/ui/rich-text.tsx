import { PortableText, type PortableTextComponents } from "next-sanity";
import LineReveal from "@/components/ui/line-reveal";
import type { RichText as RichTextValue } from "@/content/types";

type RichTextProps = {
  value: RichTextValue;
  /** Text style of each paragraph. Default "body-big". */
  paragraphClassName?: string;
};

// Rich text from the CMS (an article's body, a member's bio): each
// paragraph reveals line by line as it scrolls in, with bold, italics and
// links kept inside it.
//
//   <div className="article-body"><RichText value={article.body} /></div>
export default function RichText({ value, paragraphClassName = "body-big" }: RichTextProps) {
  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => <LineReveal className={paragraphClassName}>{children}</LineReveal>,
    },
    marks: {
      link: ({ value: link, children }) => {
        const href: string = link?.href ?? "";
        const external = /^https?:\/\//.test(href);
        return (
          <a href={href} {...(external && { target: "_blank", rel: "noopener noreferrer" })}>
            {children}
          </a>
        );
      },
    },
  };

  return <PortableText value={value} components={components} />;
}
