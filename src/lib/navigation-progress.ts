// Window event that signals an App Router navigation has started. Dispatched from
// src/instrumentation-client.ts (a separate client entry, so a plain event rather
// than a shared module) and consumed by components/layout/navigation-progress.tsx.
export const NAVIGATION_START_EVENT = "aterlier:navigation-start";
