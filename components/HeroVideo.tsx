"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The home hero's background video. It is decoration and several megabytes,
 * so it stays off the critical path: nothing is requested until the page has
 * finished loading, and it fades in once it can actually play.
 */
export function HeroVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const start = () => {
      video.src = src;
      video.play().catch(() => {});
    };

    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, [src]);

  return (
    <video
      ref={ref}
      aria-hidden
      loop
      muted
      playsInline
      preload="none"
      onCanPlay={() => setReady(true)}
      // `mix-blend-screen` drops the footage's black background so only the
      // bright waves show against the page colour.
      className={`absolute inset-0 -z-10 h-full w-full object-cover mix-blend-screen transition-opacity duration-[2500ms] ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
