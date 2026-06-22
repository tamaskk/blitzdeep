"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-triggered reveal. Wraps content and fades/slides it in once it
 * enters the viewport. `delay` (ms) lets callers stagger grids of items.
 *
 * Renders a plain <div> wrapper; in grids give it `h-full` so the wrapped
 * card still stretches to the row height.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      // Inline style is justified here: the stagger delay and offset are
      // per-instance dynamic values, not expressible as static utilities.
      style={{
        transitionDelay: shown ? `${delay}ms` : "0ms",
        transform: shown ? undefined : `translateY(${y}px)`,
      }}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none",
        shown ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}
