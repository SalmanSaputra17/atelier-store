// Drizzle schema entry point, used by both the client (src/db/index.ts) and drizzle.config.ts.
export * from "./catalog-schema";

// After `npm run auth:generate`, re-export the Better Auth tables:
//   export * from "./auth-schema";
