import { NAVIGATION_START_EVENT } from "@/lib/navigation-progress";

// Fires at the start of every App Router navigation: <Link> clicks, next/form
// submissions, router.push/replace and browser back/forward.
export function onRouterTransitionStart(
  url: string,
  navigationType: "push" | "replace" | "traverse",
) {
  // Links to the current page (or a #hash on it) never change the route, so the
  // progress bar would have nothing to finish on. Back/forward has already updated
  // location by the time this runs, so it's always reported.
  if (navigationType !== "traverse") {
    const target = new URL(url, window.location.href);
    if (target.pathname === window.location.pathname && target.search === window.location.search) {
      return;
    }
  }
  window.dispatchEvent(new CustomEvent(NAVIGATION_START_EVENT));
}
