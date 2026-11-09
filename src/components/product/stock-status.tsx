import { getStockState } from "@/lib/stock";

export function StockStatus({ stock }: { stock: number }) {
  const state = getStockState(stock);

  const { label, dot, text } = {
    in_stock: { label: "In stock", dot: "bg-success", text: "text-ink" },
    low_stock: { label: `Only ${stock} left`, dot: "bg-warning", text: "text-warning" },
    sold_out: { label: "Sold out", dot: "bg-ink-subtle", text: "text-ink-muted" },
  }[state];

  return (
    <p className={`flex items-center gap-2 text-caption ${text}`}>
      <span aria-hidden="true" className={`size-1.5 ${dot}`} />
      {label}
    </p>
  );
}
