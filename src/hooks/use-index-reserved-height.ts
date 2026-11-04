"use client";

import { useEffect, type RefObject } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Keeps an editorial index (.values-index inside `ref`) as tall as it is with
// its tallest row open, so opening or closing a row never moves what's below
// the index. Measured again when the index changes width, as text rewraps.
//
//   useIndexReservedHeight(indexRef);
export function useIndexReservedHeight(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const index = ref.current?.querySelector<HTMLElement>(".values-index");
    if (!index) return;

    const measure = () => {
      let closedRows = 0;
      let tallestBody = 0;
      index.querySelectorAll<HTMLElement>(".values-index-item").forEach((item) => {
        const panel = item.querySelector<HTMLElement>(".values-index-panel");
        const body = item.querySelector<HTMLElement>(".values-index-body");
        if (!panel || !body) return;
        closedRows += item.getBoundingClientRect().height - panel.getBoundingClientRect().height;
        tallestBody = Math.max(tallestBody, body.getBoundingClientRect().height);
      });

      const height = `${Math.ceil(closedRows + tallestBody)}px`;
      if (index.style.minHeight === height) return;
      index.style.minHeight = height;
      // The page's height changed, so what's below starts somewhere new.
      ScrollTrigger.refresh();
    };

    let width = -1;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width === width) return;
      width = entry.contentRect.width;
      measure();
    });
    observer.observe(index);
    document.fonts.ready.then(measure);

    return () => {
      observer.disconnect();
      index.style.minHeight = "";
    };
  }, [ref]);
}
