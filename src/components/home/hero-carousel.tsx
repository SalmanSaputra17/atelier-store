"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useSyncExternalStore } from "react";
import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from "@/components/icons";
import type { HeroSlide } from "@/lib/content";

const SWIPE_THRESHOLD_PX = 50;

// Reduced motion disables autoplay entirely (the slide timer is a CSS animation,
// which the global reduced-motion rule would otherwise shorten to ~0ms).
const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeToMotion(onChange: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Full-bleed homepage carousel. Slides crossfade; the active slide's progress bar
 * is a CSS animation whose end advances to the next slide, so the bar and the
 * timer can't drift. Autoplay pauses on hover, keyboard focus or the pause button.
 */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeToMotion,
    () => window.matchMedia(motionQuery).matches,
    () => true, // server: render without autoplay; the client takes over on hydration
  );
  const swipeStart = useRef<number | null>(null);

  const count = slides.length;
  const canAutoplay = !reducedMotion && count > 1;
  const running = canAutoplay && playing && !hovered && !focused;
  const goTo = (next: number) => setIndex((next + count) % count);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured"
      className="relative h-[85svh] min-h-[34rem] max-h-[60rem] touch-pan-y overflow-hidden bg-ink"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      // Keyboard focus only: a mouse click on a control shouldn't leave autoplay paused.
      onFocus={(event) => setFocused(event.target.matches(":focus-visible"))}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
      onPointerDown={(event) => {
        if (event.pointerType === "touch") swipeStart.current = event.clientX;
      }}
      onPointerUp={(event) => {
        if (swipeStart.current === null) return;
        const distance = event.clientX - swipeStart.current;
        swipeStart.current = null;
        if (Math.abs(distance) > SWIPE_THRESHOLD_PX) goTo(index + (distance < 0 ? 1 : -1));
      }}
      onPointerCancel={() => (swipeStart.current = null)}
    >
      {/* Announce slide changes only when the user drives them. */}
      <div aria-live={running ? "off" : "polite"}>
        {slides.map((slide, i) => {
          const active = i === index;
          // One h1 per page: the first slide carries it.
          const Heading = i === 0 ? "h1" : "h2";
          return (
            <div
              key={slide.title}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              inert={!active}
              className={`absolute inset-0 transition-opacity duration-1000 ease-luxe ${
                active ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.image.src}
                alt={slide.image.alt}
                fill
                preload={i === 0}
                sizes="100vw"
                style={{ objectPosition: slide.image.position }}
                // Slow push-in on the active slide; disabled by reduced motion.
                className={`object-cover transition-transform duration-[8s] ease-out ${
                  active ? "scale-100" : "scale-105"
                }`}
              />
              <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/30 via-45% to-transparent" />
              <div className="tone-inverse absolute inset-x-0 bottom-0 container-page pb-32 md:pb-20">
                <div className="max-w-3xl">
                  <p className="label-caps">{slide.eyebrow}</p>
                  <Heading className="mt-4 font-display text-display">{slide.title}</Heading>
                  <p className="mt-5 max-w-md text-body-lg text-canvas/85">{slide.body}</p>
                  <Link href={slide.cta.href} className="btn btn-inverse mt-8">
                    {slide.cta.label}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 container-page flex justify-end pb-gutter md:pb-20">
          <div className="tone-inverse glass-inverse pointer-events-auto flex items-center border border-canvas/20">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => goTo(index - 1)}
              className="inline-flex size-11 items-center justify-center transition-colors hover:bg-canvas/10"
            >
              <ChevronLeftIcon />
            </button>

            <div className="flex items-center gap-3 px-2">
              <span className="label-caps tabular-nums" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex">
                {slides.map((slide, i) => (
                  <button
                    key={slide.title}
                    type="button"
                    aria-label={`Show slide ${i + 1}: ${slide.title}`}
                    aria-current={i === index ? "true" : undefined}
                    onClick={() => goTo(i)}
                    className="group flex h-11 w-7 items-center px-1 sm:w-10"
                  >
                    <span
                      className={`relative block h-px w-full overflow-hidden transition-colors group-hover:bg-canvas/70 ${
                        i === index ? "bg-canvas/60" : "bg-canvas/30"
                      }`}
                    >
                      {i === index &&
                        (canAutoplay ? (
                          <span
                            // Remount per slide so each slide's timer starts from zero.
                            key={index}
                            onAnimationEnd={() => goTo(index + 1)}
                            style={{ animationPlayState: running ? "running" : "paused" }}
                            className="absolute inset-0 origin-left animate-hero-progress bg-canvas"
                          />
                        ) : (
                          <span className="absolute inset-0 bg-canvas" />
                        ))}
                    </span>
                  </button>
                ))}
              </div>
              <span className="label-caps tabular-nums text-canvas/60" aria-hidden="true">
                {String(count).padStart(2, "0")}
              </span>
            </div>

            <button
              type="button"
              aria-label="Next slide"
              onClick={() => goTo(index + 1)}
              className="inline-flex size-11 items-center justify-center transition-colors hover:bg-canvas/10"
            >
              <ChevronRightIcon />
            </button>

            {canAutoplay && (
              <button
                type="button"
                aria-label={playing ? "Pause slideshow" : "Play slideshow"}
                onClick={() => setPlaying(!playing)}
                className="inline-flex size-11 items-center justify-center border-l border-canvas/20 transition-colors hover:bg-canvas/10"
              >
                {playing ? <PauseIcon width={16} height={16} /> : <PlayIcon width={16} height={16} />}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
