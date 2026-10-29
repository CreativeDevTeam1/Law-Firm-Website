import type { Ref } from "react";
import Image from "next/image";
import LineReveal from "@/components/ui/line-reveal";
import type { IndexItem } from "@/content/types";
import { indexNumber } from "@/lib/format";

type ValuesIndexProps = {
  ref?: Ref<HTMLOListElement>;
  items: IndexItem[];
  /** Prefix for the panels' ids, e.g. "core-value". */
  idPrefix: string;
  /** The open row, or -1 for none. */
  openIndex: number;
  onOpenChange: (index: number) => void;
  /** Heading level of each row: one below the heading above the index. Default "h3". */
  headingAs?: "h3" | "h4";
  /** Text style of the titles. Default "header-1". */
  titleClassName?: string;
  /**
   * An open row shows its photo above its description (the practice areas)
   * instead of its number in display type beside it.
   */
  withPhotos?: boolean;
  className?: string;
};

// The editorial index on the About and Careers pages (the values-index
// styles): a row per item between hairline rules, with its number, title
// and a (+). Clicking a row opens its description and closes the one
// before; clicking it again closes it. The parent holds which row is open
// and reveals the rows (use-index-reveal.ts).
//
//   const [openIndex, setOpenIndex] = useState(-1);
//   <ValuesIndex items={values} idPrefix="core-value" openIndex={openIndex} onOpenChange={setOpenIndex} />
export default function ValuesIndex({
  ref,
  items,
  idPrefix,
  openIndex,
  onOpenChange,
  headingAs: Heading = "h3",
  titleClassName = "header-1",
  withPhotos = false,
  className = "",
}: ValuesIndexProps) {
  return (
    <ol className={`values-index ${className}`.trim()} ref={ref}>
      {items.map((item, i) => {
        const number = indexNumber(i);
        const isOpen = i === openIndex;
        return (
          <li className={`values-index-item${isOpen ? " is-open" : ""}`} key={item.title}>
            <span className="values-index-rule" aria-hidden="true" />
            <Heading className="values-index-heading">
              <button
                type="button"
                className="values-index-toggle"
                aria-expanded={isOpen}
                aria-controls={`${idPrefix}-${i}`}
                onClick={() => onOpenChange(isOpen ? -1 : i)}
              >
                <span className="values-index-number cta-medium">
                  <span>{number}</span>
                </span>
                <LineReveal as="span" className={`values-index-title ${titleClassName}`} delay={0.3}>
                  {item.title}
                </LineReveal>
                {/* A + whose upright turns flat into a − as the row opens. */}
                <span className="values-index-sign cta-medium" aria-hidden="true">
                  <span>
                    (<span className="values-index-plus" />)
                  </span>
                </span>
              </button>
            </Heading>
            <div className="values-index-panel" id={`${idPrefix}-${i}`} inert={!isOpen}>
              <div className="values-index-panel-inner">
                <div className="values-index-body">
                  {withPhotos && item.image && (
                    <div className="practice-index-photo">
                      <Image src={item.image.src} alt={item.image.alt} fill sizes="100vw" />
                    </div>
                  )}
                  <p className="values-index-text body">{item.description}</p>
                  {!withPhotos && (
                    <span className="values-index-big display-header-2" aria-hidden="true">
                      {number}.
                    </span>
                  )}
                </div>
              </div>
            </div>
            {i === items.length - 1 && <span className="values-index-rule" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}
