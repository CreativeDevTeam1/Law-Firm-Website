"use client";

import { useEffect, useState, type RefObject } from "react";
import { gsap } from "gsap";

// Where the row scrolls to for each item (its start lined up with the
// first item's), capped at the end of the row.
const positionsOf = (list: HTMLElement) => {
  const items = Array.from(list.children) as HTMLElement[];
  const start = items[0].offsetLeft;
  const max = list.scrollWidth - list.clientWidth;
  return items.map((item) => Math.min(item.offsetLeft - start, max));
};

// The item whose position is nearest a scroll position.
const nearestIndex = (list: HTMLElement, scroll: number) => {
  const positions = positionsOf(list);
  return positions.reduce(
    (nearest, position, i) =>
      Math.abs(position - scroll) < Math.abs(positions[nearest] - scroll) ? i : nearest,
    0,
  );
};

// GSAP animates the scroll rather than the browser's smooth scrolling, which
// some browsers skip; snapping is paused meanwhile so it can't pull the row
// back partway.
const slideTo = (list: HTMLElement, index: number) => {
  const positions = positionsOf(list);
  const target = positions[Math.max(0, Math.min(positions.length - 1, index))];

  gsap.killTweensOf(list);
  list.style.scrollSnapType = "none";
  gsap.to(list, {
    scrollLeft: target,
    duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.8,
    ease: "power3.out",
    onComplete: () => list.style.removeProperty("scroll-snap-type"),
  });
};

// A row of items that scrolls sideways (the "carousel" class in
// globals.css): swiped on touch screens, dragged with a mouse, or moved one
// item at a time by step(), for arrow buttons. canScroll says whether
// there's anything further back or forward, to switch the buttons off.
//
//   const listRef = useRef<HTMLUListElement>(null);
//   const { canScroll, step } = useCarousel(listRef);
//   <ul className="carousel" ref={listRef}>…</ul>
//   <button disabled={!canScroll.forward} onClick={() => step(1)}>…</button>
export function useCarousel(listRef: RefObject<HTMLElement | null>) {
  const [canScroll, setCanScroll] = useState({ back: false, forward: false });

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const update = () =>
      setCanScroll({
        back: list.scrollLeft > 1,
        forward: list.scrollLeft + list.clientWidth < list.scrollWidth - 1,
      });

    update();
    list.addEventListener("scroll", update, { passive: true });
    const resize = new ResizeObserver(update);
    resize.observe(list);

    return () => {
      list.removeEventListener("scroll", update);
      resize.disconnect();
    };
  }, [listRef]);

  // Mouse dragging (touch screens already swipe the row natively). The row
  // follows the pointer; on release it carries on the way it was thrown and
  // settles on the nearest item, as step() does.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    let drag: { id: number; x: number; scroll: number; moved: boolean } | null = null;
    let samples: { x: number; t: number }[] = [];

    const down = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      gsap.killTweensOf(list);
      list.style.scrollSnapType = "none";
      drag = { id: event.pointerId, x: event.clientX, scroll: list.scrollLeft, moved: false };
      samples = [{ x: event.clientX, t: event.timeStamp }];
    };

    const move = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x;
      // A few pixels of slack so a plain click (or selecting text) isn't a drag.
      if (!drag.moved && Math.abs(dx) < 4) return;
      if (!drag.moved) {
        drag.moved = true;
        list.setPointerCapture(drag.id);
        list.classList.add("is-dragging");
      }
      list.scrollLeft = drag.scroll - dx;
      samples = [...samples, { x: event.clientX, t: event.timeStamp }].filter(
        (sample) => event.timeStamp - sample.t < 100,
      );
    };

    const up = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) return;
      const { moved } = drag;
      drag = null;
      list.classList.remove("is-dragging");
      if (!moved) {
        list.style.removeProperty("scroll-snap-type");
        return;
      }

      // Pixels per millisecond over the last tenth of a second, thrown on for
      // a quarter of a second's worth before settling.
      const first = samples[0];
      const last = samples[samples.length - 1];
      const velocity = last && first && last.t > first.t ? (last.x - first.x) / (last.t - first.t) : 0;
      slideTo(list, nearestIndex(list, list.scrollLeft - velocity * 250));
    };

    // A drag that ends on a link inside the row mustn't also follow it.
    const click = (event: MouseEvent) => {
      if (list.dataset.dragged) {
        event.preventDefault();
        event.stopPropagation();
        delete list.dataset.dragged;
      }
    };
    const markDragged = () => {
      if (list.classList.contains("is-dragging")) list.dataset.dragged = "true";
    };

    // No native drag of a selection, image or link out of the row.
    const noNativeDrag = (event: DragEvent) => event.preventDefault();

    list.addEventListener("pointerdown", down);
    list.addEventListener("pointermove", move);
    list.addEventListener("pointerup", markDragged, { capture: true });
    list.addEventListener("pointerup", up);
    list.addEventListener("pointercancel", up);
    list.addEventListener("click", click, { capture: true });
    list.addEventListener("dragstart", noNativeDrag);

    return () => {
      list.removeEventListener("pointerdown", down);
      list.removeEventListener("pointermove", move);
      list.removeEventListener("pointerup", markDragged, { capture: true });
      list.removeEventListener("pointerup", up);
      list.removeEventListener("pointercancel", up);
      list.removeEventListener("click", click, { capture: true });
      list.removeEventListener("dragstart", noNativeDrag);
    };
  }, [listRef]);

  // Slides to the previous or next item: from the item nearest the row's
  // start, one step back or forward, stopping at either end.
  const step = (direction: -1 | 1) => {
    const list = listRef.current;
    if (!list) return;
    slideTo(list, nearestIndex(list, list.scrollLeft) + direction);
  };

  return { canScroll, step };
}
