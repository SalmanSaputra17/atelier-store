import Image from "next/image";
import type { Product } from "@/lib/catalog";

// Swipeable rail on mobile, stacked full-width images on desktop.
export function ProductGallery({ product }: { product: Product }) {
  const { images } = product;

  if (images.length === 0) {
    return <div className="media-frame" />;
  }

  // A single image fills the width instead of leaving an empty peek on mobile.
  const slideWidth = images.length > 1 ? "w-[88%] sm:w-[60%]" : "w-full";

  return (
    <ul
      aria-label="Product images"
      tabIndex={images.length > 1 ? 0 : undefined}
      className="-mx-gutter flex snap-x snap-mandatory gap-1 overflow-x-auto scrollbar-none lg:mx-0 lg:grid lg:overflow-visible"
    >
      {images.map((image, index) => (
        <li key={image.src} className={`${slideWidth} shrink-0 snap-start lg:w-auto`}>
          <div className="media-frame">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              preload={index === 0}
              sizes="(min-width: 64rem) 60vw, (min-width: 40rem) 60vw, 88vw"
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
