"use client";

import { useEffect, useRef } from "react";

// How quickly playback catches up with the scroll position (0–1 per frame).
const EASE = 0.14;
// The blur fades in between these scroll depths, in viewport heights.
const BLUR_START = 0.6;
const BLUR_END = 1.4;

/**
 * Full-viewport background video that is scrubbed by scrolling: it never
 * plays on its own, moves forward while the page scrolls down and backward
 * while it scrolls up, and stays pinned behind the whole page. Past the first
 * screen a blurred, darkened layer fades in over the footage so the sections
 * stay readable. The page's content sits above all of it.
 *
 * `position: fixed` here is clipped to the nearest ancestor with a clip-path
 * (the page wrapper), which is what stops it showing behind the footer.
 */
export function ScrollVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const blur = blurRef.current;
    if (!video || !blur) return;

    let raf = 0;
    let target = 0; // seconds
    let current = 0;

    const tick = () => {
      raf = 0;
      const diff = target - current;
      if (Math.abs(diff) < 0.01) return;
      current += diff * EASE;
      // Don't queue seeks faster than the decoder can serve them.
      if (!video.seeking) video.currentTime = current;
      raf = requestAnimationFrame(tick);
    };

    const update = () => {
      const viewport = window.innerHeight;
      const y = window.scrollY;

      const depth = (y / viewport - BLUR_START) / (BLUR_END - BLUR_START);
      blur.style.opacity = String(Math.min(1, Math.max(0, depth)));

      if (!video.duration) return;
      const max = document.documentElement.scrollHeight - viewport;
      const progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      // Stop just short of the end: seeking to the exact duration shows black
      // in some browsers.
      target = progress * (video.duration - 0.05);
      if (!raf) raf = requestAnimationFrame(tick);
    };

    // iOS only allows seeking once playback has started at least once.
    const unlock = () => {
      video
        .play()
        .then(() => video.pause())
        .catch(() => {});
      update();
    };

    if (video.readyState >= 1) unlock();
    else video.addEventListener("loadedmetadata", unlock, { once: true });
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();

    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener("loadedmetadata", unlock);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-black">
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>
      {/* Darkens the footage towards the bottom so the hero text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40" />
      <div
        ref={blurRef}
        style={{ opacity: 0 }}
        className="absolute inset-0 bg-black/55 backdrop-blur-2xl"
      />
    </div>
  );
}
