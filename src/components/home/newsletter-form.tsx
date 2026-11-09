"use client";

import { useState } from "react";

// UI only: not connected to a mailing list provider yet.
export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p role="status" className="text-body-lg lg:pb-3">
        Thank you — you&rsquo;re on the list.
      </p>
    );
  }

  return (
    <form
      className="flex flex-col gap-4 sm:flex-row sm:items-end"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <label className="flex flex-1 flex-col gap-2 text-left">
        <span className="label-caps text-ink-muted">Email address</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="h-12 border-0 border-b border-ink bg-transparent text-body-lg placeholder:text-ink-subtle"
        />
      </label>
      <button type="submit" className="btn btn-primary">
        Subscribe
      </button>
    </form>
  );
}
