"use client";

import { useRef } from "react";
import { AvatarStack } from "@/components/ui/AvatarStack";
import { RevealPortrait } from "./RevealPortrait";
import { StatCards } from "./StatCards";
import { display } from "./fonts";

const WORD = "WEBSITES";

/**
 * Hero for the Website Development page. Layers, bottom to top: yellow field
 * with a warm glow, halftone dots, the giant word, the portrait (which hides
 * the word's middle letters and is lit by the cursor), then the UI.
 */
export function WebHero() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section
      ref={ref}
      className="relative isolate h-[100svh] min-h-[620px] overflow-hidden bg-[#F6B70A]"
    >
      <h1 className="sr-only">Website Development</h1>

      {/* 1. Glow behind the head */}
      <div
        aria-hidden
        className="absolute inset-0 animate-fade-in bg-[radial-gradient(45vw_45vw_at_50%_58%,rgba(255,120,40,0.75),transparent)] md:bg-[radial-gradient(45vw_45vw_at_50%_47%,rgba(255,120,40,0.75),transparent)]"
      />
      {/* 2. Halftone, denser towards the edges */}
      <div
        aria-hidden
        className="web-halftone absolute inset-0 animate-fade-in opacity-50 [mask-image:radial-gradient(ellipse_at_center,rgba(0,0,0,0.2)_0%,#000_75%)]"
      />

      {/* 3. The giant word, level with the eyes */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 md:top-[47%]"
      >
        <div
          // Parallax: drifts against the cursor, for depth behind the portrait.
          style={{
            transform: "translate3d(calc(var(--px, 0) * -1.2vw), calc(var(--py, 0) * -0.8vw), 0)",
          }}
          className={`${display.className} overflow-hidden whitespace-nowrap text-[22vw] leading-none tracking-[-0.02em] md:text-[19vw]`}
        >
          {WORD.split("").map((letter, i) => (
            <span
              key={i}
              className="web-letter"
              style={{ animationDelay: `${200 + i * 40}ms` }}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>

      {/* 4 + 5. Portrait: silhouette with the lit version revealed by the cursor */}
      <div className="absolute bottom-0 left-1/2 aspect-[1122/1402] h-[70%] -translate-x-1/2 md:h-[92%]">
        <RevealPortrait heroRef={ref} />
      </div>

      {/* Keeps the white nav and bottom text readable on the yellow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/20 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/25 to-transparent"
      />

      {/* 6. UI */}
      <div className="absolute inset-x-5 bottom-6 flex animate-fade-up flex-col gap-5 [animation-delay:1600ms] md:inset-x-8 md:bottom-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-[440px] text-white">
          <div className="flex items-center gap-3">
            <AvatarStack count={3} />
            <p className="text-sm leading-tight text-white/90">
              Rated 4.9/5 by
              <br />
              300+ scaled brands.
            </p>
          </div>
          <p className="mt-4 text-[17px] font-medium leading-tight md:text-[22px]">
            We design and build conversion-focused, lightning-fast websites that work as hard as
            your sales team.
          </p>
        </div>

        <StatCards />
      </div>
    </section>
  );
}
