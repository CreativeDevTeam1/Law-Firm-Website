type CarouselControlsProps = {
  /** The carousel's id, for aria-controls. */
  controls: string;
  canScroll: { back: boolean; forward: boolean };
  step: (direction: -1 | 1) => void;
  /** What one step moves by, e.g. "value" makes "Previous value". */
  itemName: string;
  className?: string;
};

// The back and forward arrows for a carousel (use-carousel.ts), shown from
// 1024px (see Carousel in globals.css).
//
//   const { canScroll, step } = useCarousel(listRef);
//   <CarouselControls controls="core-values-list" canScroll={canScroll} step={step} itemName="value" />
export default function CarouselControls({
  controls,
  canScroll,
  step,
  itemName,
  className = "",
}: CarouselControlsProps) {
  return (
    <div className={`carousel-controls ${className}`.trim()}>
      <button
        type="button"
        className="carousel-button"
        aria-label={`Previous ${itemName}`}
        aria-controls={controls}
        disabled={!canScroll.back}
        onClick={() => step(-1)}
      >
        <span className="carousel-icon carousel-icon-back" aria-hidden="true" />
      </button>
      <button
        type="button"
        className="carousel-button"
        aria-label={`Next ${itemName}`}
        aria-controls={controls}
        disabled={!canScroll.forward}
        onClick={() => step(1)}
      >
        <span className="carousel-icon carousel-icon-forward" aria-hidden="true" />
      </button>
    </div>
  );
}
