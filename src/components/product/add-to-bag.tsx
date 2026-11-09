"use client";

import { useState } from "react";

// UI only: the cart isn't built yet, so this just confirms the click.
export function AddToBag({ soldOut }: { soldOut: boolean }) {
  const [added, setAdded] = useState(false);

  if (soldOut) {
    return (
      <button type="button" disabled className="btn btn-primary btn-block">
        Sold out
      </button>
    );
  }

  return (
    <div>
      <button
        type="button"
        className="btn btn-primary btn-block"
        onClick={() => setAdded(true)}
      >
        {added ? "Added to bag" : "Add to bag"}
      </button>
      <p role="status" className="mt-3 min-h-[1lh] text-caption text-ink-muted">
        {added ? "This piece is now in your bag." : ""}
      </p>
    </div>
  );
}
