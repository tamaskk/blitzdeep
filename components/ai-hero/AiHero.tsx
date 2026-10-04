"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { grotesk } from "@/components/ai-page/fonts";

// three.js and the shaders load in their own chunk, after hydration.
const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

/**
 * "pending"  — waiting for WebGL; text hidden so it doesn't flash
 * "gl"       — WebGL draws the visuals; the DOM text stays for a11y / clicks
 *              but is painted transparent
 * "fallback" — no WebGL; plain DOM hero with a CSS orb
 * The matching styles live in globals.css under `.ai-hero`.
 */
type State = "pending" | "gl" | "fallback";

const BUTTON =
  "inline-flex h-10 items-center justify-center rounded-lg px-6 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/**
 * Hero for the AI Automation page: a liquid 3D orb on a vivid blue field, with
 * a cursor-driven fluid distortion over everything except the nav.
 * `level` (0–1) makes the orb pulse, e.g. from a mic AnalyserNode.
 */
export function AiHero({ level }: { level?: number }) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<State>("pending");

  const onReady = useCallback(() => setState("gl"), []);
  const onFail = useCallback(() => setState("fallback"), []);

  // If the WebGL chunk never arrives, don't leave the hero blank. Once it has
  // mounted the timer is dropped: a background tab renders no frames, and that
  // must not be mistaken for a failure.
  const timer = useRef(0);
  const onMount = useCallback(() => window.clearTimeout(timer.current), []);
  useEffect(() => {
    timer.current = window.setTimeout(
      () => setState((s) => (s === "pending" ? "fallback" : s)),
      4000
    );
    return () => window.clearTimeout(timer.current);
  }, []);

  return (
    <section
      ref={ref}
      data-state={state}
      className="ai-hero relative isolate flex min-h-[100svh] flex-col items-center overflow-hidden px-5 pb-16 pt-[max(22svh,6.5rem)] text-center"
    >
      <noscript>
        <style>{`.ai-hero[data-state="pending"] [data-gl],.ai-hero[data-state="pending"] .ai-orb{opacity:1 !important}`}</style>
      </noscript>

      {state !== "fallback" && (
        <HeroCanvas heroRef={ref} level={level} onMount={onMount} onReady={onReady} onFail={onFail} />
      )}

      <div className="relative z-10 flex w-full flex-col items-center">
        <div
          data-orb
          aria-hidden
          className="ai-orb aspect-square w-[60vw] max-w-[340px] md:w-[min(26vw,340px,38svh)]"
        />

        <h1
          className={`${grotesk.className} mt-6 text-[clamp(2rem,9vw,2.5rem)] font-bold leading-none tracking-[-0.04em] text-white md:text-[64px]`}
        >
          <span data-gl data-gl-group="0" className="block">
            Your AI Automation,
          </span>
          <span data-gl data-gl-group="1" className="block">
            Always{" "}
            <em className="font-serif text-[1.08em] font-normal italic tracking-[-0.02em] text-[#5CF2B0]">
              Ready To Work
            </em>
          </span>
        </h1>

        <p data-gl data-gl-group="2" className="mt-4 max-w-md text-base leading-snug text-white/90">
          We map your workflows and add AI exactly where it saves the most time, so your team can
          focus on the work that moves the needle.
        </p>

        <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/#contact"
            data-gl
            data-gl-group="3"
            data-gl-bg="#0B3BFF"
            data-gl-bg-hover="#0930D6"
            className={`${BUTTON} bg-[#0B3BFF] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] hover:bg-[#0930D6]`}
          >
            Get a Proposal
          </Link>
          <Link
            href="#included"
            data-gl
            data-gl-group="3"
            data-gl-bg="rgba(255,255,255,0.85)"
            data-gl-bg-hover="#FFFFFF"
            className={`${BUTTON} bg-white/85 text-[#0A1A3A] hover:bg-white`}
          >
            See What&rsquo;s Included
          </Link>
        </div>
      </div>
    </section>
  );
}
