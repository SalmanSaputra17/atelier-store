import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/catalog";
import { getStockState } from "@/lib/stock";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="media-frame">
          {product.image && (
            <Image
              src={product.image.src}
              alt={product.image.alt}
              fill
              sizes="(min-width: 64rem) 25vw, (min-width: 48rem) 33vw, 50vw"
              className="transition-transform duration-700 ease-luxe group-hover:scale-[1.03]"
            />
          )}
          {product.badge && (
            <span className="glass absolute top-3 left-3 border border-canvas/60 px-2 py-1 label-caps">
              {product.badge}
            </span>
          )}
        </div>
        <div className="mt-3 flex flex-col gap-1 pr-2">
          <h3 className="text-body">{product.name}</h3>
          <p className="text-caption text-ink-muted">{formatPrice(product.price)}</p>
          {getStockState(product.stock) === "sold_out" && (
            <p className="text-caption text-ink-subtle">Sold out</p>
          )}
        </div>
      </Link>
    </article>
  );
}
