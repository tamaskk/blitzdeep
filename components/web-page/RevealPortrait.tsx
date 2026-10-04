"use client";

import { useEffect, useRef, type RefObject } from "react";
import Image from "next/image";

const PORTRAIT = "/fiu.png";
// Where the eyes sit inside the portrait image, as fractions of its box.
const EYES_Y = 0.424;
const EYES_FROM = 0.2;
const EYES_TO = 0.8;

const MASK_SCALE = 0.5; // mask canvas runs at half the portrait's CSS size
const FADE = 0.07; // alpha erased from the mask per frame (~0.8s to dark)
const SMOOTHING = 0.25; // pointer lerp per frame
const STAMP_SPACING = 6; // px between brush stamps along the pointer path
const SETTLE_MS = 1400; // keep rendering this long after the last stamp
const SWEEP_MS = 900;
const INTRO_SWEEP_DELAY = 1500;
const IDLE_SWEEP_EVERY = 4000;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Soft, feathered round brush: 1 at the centre, 0.6 at 55%, 0 at the edge. */
function makeBrush(radius: number) {
  const size = Math.ceil(radius * 2);
  const brush = document.createElement("canvas");
  brush.width = size;
  brush.height = size;
  const ctx = brush.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.55, "rgba(255,255,255,0.6)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  return brush;
}

/**
 * The hero portrait with its "flashlight" reveal. The visible image is the
 * cut-out crushed to near-black; a canvas on top paints the same image in full
 * colour, but only where a mask says so. The cursor stamps soft brushes into
 * that mask and every frame the mask fades a little, so the light leaves a
 * trail that melts back to silhouette.
 *
 * Also drives the hero's pointer parallax, exposed as the CSS variables
 * `--px` / `--py` (-1…1) on the hero element.
 */
export function RevealPortrait({ heroRef }: { heroRef: RefObject<HTMLElement> }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const box = boxRef.current;
    const img = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const mask = document.createElement("canvas");
    const maskCtx = mask.getContext("2d");
    if (!hero || !box || !img || !canvas || !ctx || !maskCtx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let width = 0;
    let height = 0;
    let radius = 110;
    let brush = makeBrush(radius * MASK_SCALE);

    let raf = 0;
    let visible = true;
    let pointerActive = false;
    let sweepStart = 0; // 0 = no automatic sweep running
    let lastStamp = 0;
    let lastInput = 0;
    const target = { x: 0, y: 0 }; // real pointer, px inside the portrait box
    const smooth = { x: 0, y: 0 }; // smoothed pointer the brush follows
    const parallax = { x: 0, y: 0, tx: 0, ty: 0 };

    const stamp = (x: number, y: number) => {
      const r = radius * MASK_SCALE;
      maskCtx.drawImage(brush, x * MASK_SCALE - r, y * MASK_SCALE - r);
    };

    // Lit portrait, kept only where the mask is opaque.
    const compose = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!img.complete || !img.naturalWidth) return;
      // The <img> on screen is darkened by a CSS filter; drawing it to a
      // canvas uses the untouched pixels, so no second image is needed.
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(mask, 0, 0, canvas.width, canvas.height);
    };

    const drawStatic = () => {
      maskCtx.clearRect(0, 0, mask.width, mask.height);
      stamp(width * 0.4, height * EYES_Y);
      stamp(width * 0.6, height * EYES_Y);
      compose();
    };

    const frame = (now: number) => {
      raf = 0;

      // An automatic sweep moves the "pointer" across the eyes, left to right.
      let sweeping = false;
      if (sweepStart) {
        const k = (now - sweepStart) / SWEEP_MS;
        if (k >= 1 || pointerActive) {
          sweepStart = 0;
        } else {
          sweeping = true;
          target.x = width * (EYES_FROM + (EYES_TO - EYES_FROM) * k);
          target.y = height * EYES_Y;
          if (k === 0 || now - lastStamp > 200) {
            smooth.x = target.x;
            smooth.y = target.y;
          }
        }
      }

      // 1. Fade what's already revealed.
      maskCtx.globalCompositeOperation = "destination-out";
      maskCtx.fillStyle = `rgba(0,0,0,${FADE})`;
      maskCtx.fillRect(0, 0, mask.width, mask.height);
      maskCtx.globalCompositeOperation = "source-over";

      // 2. Stamp brushes along the smoothed pointer's path since last frame,
      //    so fast moves smear into a continuous trail.
      if (pointerActive || sweeping) {
        const fromX = smooth.x;
        const fromY = smooth.y;
        smooth.x += (target.x - smooth.x) * SMOOTHING;
        smooth.y += (target.y - smooth.y) * SMOOTHING;
        const steps = Math.max(
          1,
          Math.ceil(Math.hypot(smooth.x - fromX, smooth.y - fromY) / STAMP_SPACING)
        );
        for (let i = 1; i <= steps; i++) {
          const k = i / steps;
          stamp(fromX + (smooth.x - fromX) * k, fromY + (smooth.y - fromY) * k);
        }
        lastStamp = now;
      }

      compose();

      parallax.x += (parallax.tx - parallax.x) * 0.08;
      parallax.y += (parallax.ty - parallax.y) * 0.08;
      hero.style.setProperty("--px", parallax.x.toFixed(4));
      hero.style.setProperty("--py", parallax.y.toFixed(4));
      const drifting =
        Math.abs(parallax.tx - parallax.x) > 0.002 || Math.abs(parallax.ty - parallax.y) > 0.002;

      if (!visible) return;
      if (pointerActive || sweeping || drifting || now - lastStamp < SETTLE_MS) {
        raf = requestAnimationFrame(frame);
      } else {
        // 8-bit alpha never quite fades to zero; wipe the residue and rest.
        maskCtx.clearRect(0, 0, mask.width, mask.height);
        compose();
      }
    };

    const wake = () => {
      if (!raf && visible && !reduced) raf = requestAnimationFrame(frame);
    };

    const startSweep = () => {
      if (reduced || pointerActive || !visible) return;
      sweepStart = performance.now();
      smooth.x = width * EYES_FROM;
      smooth.y = height * EYES_Y;
      wake();
    };

    const resize = () => {
      width = box.clientWidth;
      height = box.clientHeight;
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      mask.width = Math.max(1, Math.round(width * MASK_SCALE));
      mask.height = Math.max(1, Math.round(height * MASK_SCALE));
      radius = clamp(window.innerWidth * 0.09, 80, 140);
      brush = makeBrush(radius * (reduced ? 1.5 : 1) * MASK_SCALE);
      if (reduced) drawStatic();
      else compose();
    };

    /* ---------- Input ---------- */

    const onPointerMove = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
      if (!pointerActive) {
        // Start the trail here rather than streaking in from the last position.
        smooth.x = target.x;
        smooth.y = target.y;
        pointerActive = true;
      }
      if (e.pointerType === "mouse") {
        const h = hero.getBoundingClientRect();
        parallax.tx = ((e.clientX - h.left) / h.width) * 2 - 1;
        parallax.ty = ((e.clientY - h.top) / h.height) * 2 - 1;
      }
      lastInput = performance.now();
      wake();
    };
    const onPointerEnd = (e: PointerEvent) => {
      // A mouse button release isn't the pointer leaving; a lifted finger is.
      if (e.type === "pointerup" && e.pointerType === "mouse") return;
      pointerActive = false;
      parallax.tx = 0;
      parallax.ty = 0;
      wake();
    };

    const onImageLoad = () => (reduced ? drawStatic() : compose());

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(box);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });
    intersection.observe(hero);
    img.addEventListener("load", onImageLoad);
    resize();

    let introTimer = 0;
    let idleTimer = 0;
    if (!reduced) {
      hero.addEventListener("pointermove", onPointerMove, { passive: true });
      hero.addEventListener("pointerdown", onPointerMove, { passive: true });
      hero.addEventListener("pointerleave", onPointerEnd);
      hero.addEventListener("pointercancel", onPointerEnd);
      hero.addEventListener("pointerup", onPointerEnd);
      // One sweep after the intro as a hint; on touch devices, again whenever
      // the hero has been left alone for a while.
      introTimer = window.setTimeout(startSweep, INTRO_SWEEP_DELAY);
      if (coarse) {
        idleTimer = window.setInterval(() => {
          if (performance.now() - lastInput > IDLE_SWEEP_EVERY) startSweep();
        }, IDLE_SWEEP_EVERY);
      }
    }

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(introTimer);
      window.clearInterval(idleTimer);
      resizeObserver.disconnect();
      intersection.disconnect();
      img.removeEventListener("load", onImageLoad);
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerdown", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerEnd);
      hero.removeEventListener("pointercancel", onPointerEnd);
      hero.removeEventListener("pointerup", onPointerEnd);
    };
  }, [heroRef]);

  return (
    <div
      ref={boxRef}
      // Parallax: the portrait drifts slightly with the cursor.
      style={{
        transform: "translate3d(calc(var(--px, 0) * 0.5vw), calc(var(--py, 0) * 0.3vw), 0)",
      }}
      className="relative h-full w-full animate-fade-in [animation-delay:500ms]"
    >
      <Image
        ref={imgRef}
        src={PORTRAIT}
        alt="Portrait of a man with dark curly hair, in shadow"
        fill
        priority
        draggable={false}
        sizes="(max-width: 768px) 120vw, 60vw"
        className="select-none object-contain [filter:brightness(0.08)]"
      />
      {/* blur softens the mask edge; the drop-shadow is the warm glow of the light */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full [filter:blur(1px)_drop-shadow(0_0_18px_rgba(255,140,50,0.6))]"
      />
    </div>
  );
}
