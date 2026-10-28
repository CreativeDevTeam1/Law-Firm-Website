// Tracks the page intro (the opening loader animation) so other animations
// can wait for it. The intro only opens the site: it plays when the visit
// starts on the home page, and never on reaching it from another page. On
// pages without one, or once it has finished, callbacks run straight away.

let isDone = false;
const listeners = new Set<() => void>();

// The page the visit started on. This module loads with the navbar on the
// first page, so it is read before any navigation. (On the server: null.)
const startPath = typeof window === "undefined" ? null : window.location.pathname;

/**
 * True on the page the visit started on, until the intro has run. Takes the
 * router's path: the URL itself only changes after the new page renders.
 */
export function canIntroPlay(pathname: string) {
  return !isDone && (startPath === null || pathname === startPath);
}

/** Runs the callback when the intro has finished. Returns a cancel function. */
export function whenIntroDone(callback: () => void) {
  if (isDone || !document.querySelector(".intro")) {
    callback();
    return () => {};
  }

  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function completeIntro() {
  if (isDone) return;
  isDone = true;
  listeners.forEach((callback) => callback());
  listeners.clear();
}
