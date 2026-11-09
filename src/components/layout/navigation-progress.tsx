"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useEffectEvent, useRef, useState } from "react";
import { NAVIGATION_START_EVENT } from "@/lib/navigation-progress";

// Navigations that commit faster than this never show the bar (no flash on
// prefetched, instant routes).
const SHOW_DELAY_MS = 120;
const TRICKLE_INTERVAL_MS = 300;
// Gives up if a navigation never commits (e.g. it was superseded or failed).
const FAILSAFE_MS = 15_000;

/**
 * Thin bar at the very top of the viewport while a client-side navigation is in
 * flight. Starts on the NAVIGATION_START_EVENT from instrumentation-client.ts,
 * trickles towards 90%, and completes when the URL's path or query changes.
 * Decorative only (aria-hidden): Next's route announcer already reads out the
 * new page to screen readers.
 */
export function NavigationProgress() {
  const [progress, setProgress] = useState(0); // 0..1
  const [visible, setVisible] = useState(false);
  const loading = useRef(false);
  const shown = useRef(false);
  const timers = useRef<number[]>([]);
  const trickle = useRef<number | undefined>(undefined);

  const clearTimers = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    window.clearInterval(trickle.current);
  };
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const finish = () => {
    if (!loading.current) return;
    loading.current = false;
    clearTimers();
    if (!shown.current) return; // finished before it was ever shown
    setProgress(1);
    later(() => {
      setVisible(false);
      shown.current = false;
      later(() => setProgress(0), 300); // reset once faded out
    }, 250);
  };

  const start = () => {
    clearTimers();
    loading.current = true;
    if (shown.current) {
      // A new navigation superseded a visible one: keep the bar and carry on.
      setProgress((p) => Math.min(p, 0.6));
    } else {
      setProgress(0);
    }
    later(() => {
      shown.current = true;
      setVisible(true);
      setProgress((p) => Math.max(p, 0.15));
      // Ease towards 90%; the last stretch is reserved for the commit.
      trickle.current = window.setInterval(
        () => setProgress((p) => p + (0.9 - p) * 0.12),
        TRICKLE_INTERVAL_MS,
      );
    }, SHOW_DELAY_MS);
    later(finish, FAILSAFE_MS);
  };

  const onStart = useEffectEvent(start);
  useEffect(() => {
    const listener = () => onStart();
    window.addEventListener(NAVIGATION_START_EVENT, listener);
    return () => {
      window.removeEventListener(NAVIGATION_START_EVENT, listener);
      clearTimers();
    };
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        // Difference blending keeps the bar visible on the black announcement strip,
        // the white header and photography alike.
        className={`pointer-events-none fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-canvas mix-blend-difference transition-[transform,opacity] duration-300 ease-out ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ transform: `scaleX(${progress})` }}
      />
      {/* useSearchParams is request data under Cache Components, so it sits behind Suspense. */}
      <Suspense fallback={null}>
        <RouteChangeObserver onChange={finish} />
      </Suspense>
    </>
  );
}

function RouteChangeObserver({ onChange }: { onChange: () => void }) {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const route = `${pathname}?${search}`;
  const previous = useRef(route);
  const onRouteChange = useEffectEvent(onChange);

  useEffect(() => {
    if (previous.current === route) return;
    previous.current = route;
    onRouteChange();
  }, [route]);

  return null;
}
