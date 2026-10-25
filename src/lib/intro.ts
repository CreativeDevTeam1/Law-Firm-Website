// Tracks the page intro (the opening loader animation) so other animations
// can wait for it. The intro plays once per visit; on pages without one, or
// once it has finished, callbacks run straight away.

let isDone = false;
const listeners = new Set<() => void>();

export function hasIntroPlayed() {
  return isDone;
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
