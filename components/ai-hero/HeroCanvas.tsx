"use client";

import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { FluidPass } from "./FluidPass";
import { measureLayout, drawLayout, type Layout } from "./textLayer";
import { orbVertex, orbFragment } from "./shaders/orb.glsl";
import {
  quadVertex,
  backgroundFragment,
  glowFragment,
  textFragment,
} from "./shaders/scene.glsl";

const MAX_DPR = 2;
const ORB_FLOW_SPEED = 0.08;
const ORB_SPIN = 0.05; // rad/s
const ORB_INTRO = 1.2; // seconds
const TEXT_INTRO_START = 0.3;
const TEXT_INTRO_STAGGER = 0.1;
const TEXT_INTRO_DURATION = 0.9;
const TEXT_GROUPS = 4;
const TEXT_INTRO_END =
  TEXT_INTRO_START + TEXT_INTRO_STAGGER * (TEXT_GROUPS - 1) + TEXT_INTRO_DURATION;
// One automatic left-to-right swirl across the headline, hinting interactivity.
const SWIRL_START = 1.7;
const SWIRL_DURATION = 0.8;

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/**
 * WebGL layer of the AI hero: background, glow, the liquid orb and a texture
 * copy of the DOM text, all rendered to a target that <FluidPass> then warps
 * with the cursor-driven fluid field.
 *
 * Positions come from the real DOM (`[data-orb]`, `[data-gl]`) inside
 * `heroRef`, so the canvas always lines up with the invisible, accessible DOM
 * layer above it. `level` (0–1) drives the orb's optional "voice" mode.
 */
export default function HeroCanvas({
  heroRef,
  level = 0,
  onMount,
  onReady,
  onFail,
}: {
  heroRef: RefObject<HTMLElement>;
  level?: number;
  onMount: () => void;
  onReady: () => void;
  onFail: () => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef(level);
  levelRef.current = level;
  const onMountRef = useRef(onMount);
  onMountRef.current = onMount;
  const callbacks = useRef({ onReady, onFail });
  callbacks.current = { onReady, onFail };

  useEffect(() => {
    const hero = heroRef.current;
    const mount = mountRef.current;
    if (!hero || !mount) return;
    onMountRef.current();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const motion = reduced ? 0.5 : 1;

    // A fresh canvas per mount, so a disposed context is never reused.
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "display:block;width:100%;height:100%";
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: false, powerPreference: "high-performance" });
    } catch {
      callbacks.current.onFail();
      return;
    }
    mount.appendChild(canvas);
    // Every shader here works directly in display (sRGB) space, matching CSS.
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

    /* ---------- Scene ---------- */

    const scene = new THREE.Scene();
    // Pixel-space camera: x right, y up, one unit per CSS px.
    const camera = new THREE.OrthographicCamera(0, 1, 1, 0, -2000, 2000);
    const sceneTarget = new THREE.WebGLRenderTarget(1, 1, { samples: 4, depthBuffer: false });
    const quad = new THREE.PlaneGeometry(1, 1);
    const flat = { depthTest: false, depthWrite: false };

    const background = new THREE.Mesh(
      quad,
      new THREE.ShaderMaterial({ vertexShader: quadVertex, fragmentShader: backgroundFragment, ...flat })
    );

    const glowMaterial = new THREE.ShaderMaterial({
      vertexShader: quadVertex,
      fragmentShader: glowFragment,
      uniforms: { uOpacity: { value: 0 } },
      transparent: true,
      ...flat,
    });
    const glow = new THREE.Mesh(quad, glowMaterial);

    const orbMaterial = new THREE.ShaderMaterial({
      vertexShader: orbVertex,
      fragmentShader: orbFragment,
      uniforms: { uFlow: { value: 0 }, uLevel: { value: 0 }, uOpacity: { value: 0 } },
      transparent: true,
      ...flat,
    });
    // A convex mesh with back-face culling needs no depth buffer.
    const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 64), orbMaterial);

    const textCanvas = document.createElement("canvas");
    const textCtx = textCanvas.getContext("2d");
    const textTexture = new THREE.CanvasTexture(textCanvas);
    textTexture.premultiplyAlpha = true;
    textTexture.generateMipmaps = false;
    textTexture.minFilter = THREE.LinearFilter;
    const textMaterial = new THREE.ShaderMaterial({
      vertexShader: quadVertex,
      fragmentShader: textFragment,
      uniforms: { uMap: { value: textTexture } },
      transparent: true,
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
      ...flat,
    });
    const text = new THREE.Mesh(quad, textMaterial);

    [background, glow, orb, text].forEach((mesh, i) => {
      mesh.renderOrder = i;
      scene.add(mesh);
    });

    const fluid = new FluidPass(renderer, !reduced);

    /* ---------- Layout (DOM → scene) ---------- */

    let width = 0;
    let height = 0;
    let dpr = 1;
    let orbRadius = 1;
    let layout: Layout | null = null;
    let headline = { left: 0, right: 0, y: 0, h: 0 };
    let layoutDirty = true;
    let textDirty = true;
    const hovered = new Set<Element>();

    const relayout = () => {
      layoutDirty = false;
      const w = hero.clientWidth;
      const h = hero.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      if (!w || !h) return;

      if (w !== width || h !== height || ratio !== dpr) {
        width = w;
        height = h;
        dpr = ratio;
        renderer.setPixelRatio(dpr);
        renderer.setSize(w, h, false);
        sceneTarget.setSize(Math.round(w * dpr), Math.round(h * dpr));
        camera.right = w;
        camera.top = h;
        camera.updateProjectionMatrix();
        background.scale.set(w, h, 1);
        background.position.set(w / 2, h / 2, 0);
        fluid.resize(w, h);
      }

      const origin = hero.getBoundingClientRect();
      const orbEl = hero.querySelector<HTMLElement>("[data-orb]");
      if (orbEl) {
        const r = orbEl.getBoundingClientRect();
        orbRadius = r.width / 2;
        const cx = r.left - origin.left + r.width / 2;
        const cy = height - (r.top - origin.top + r.height / 2);
        orb.position.set(cx, cy, 0);
        const glowSize = Math.min(380, orbRadius * 2.3) * 2;
        glow.scale.set(glowSize, glowSize, 1);
        glow.position.set(cx, cy, 0);
      }

      const h1 = hero.querySelector("h1");
      if (h1) {
        const r = h1.getBoundingClientRect();
        headline = {
          left: r.left - origin.left,
          right: r.right - origin.left,
          y: r.top - origin.top + r.height / 2,
          h: r.height,
        };
      }

      layout = measureLayout(hero);
      const b = layout.bounds;
      const cw = Math.round(b.w * dpr);
      const ch = Math.round(b.h * dpr);
      if (textCanvas.width !== cw || textCanvas.height !== ch) {
        textCanvas.width = cw;
        textCanvas.height = ch;
        textTexture.dispose(); // texture storage is immutable; reallocate
      }
      text.scale.set(b.w, b.h, 1);
      text.position.set(b.x + b.w / 2, height - (b.y + b.h / 2), 0);
      textDirty = true;
    };

    const invalidate = () => {
      layoutDirty = true;
    };
    const resizeObserver = new ResizeObserver(invalidate);
    resizeObserver.observe(hero);
    window.addEventListener("resize", invalidate);
    document.fonts?.ready.then(invalidate);
    document.fonts?.addEventListener?.("loadingdone", invalidate);

    // Button hover / focus is redrawn into the texture, since the DOM faces
    // are transparent while WebGL is active.
    const buttons = Array.from(hero.querySelectorAll<HTMLElement>("[data-gl-bg]"));
    const onEnter = (e: Event) => {
      hovered.add(e.currentTarget as Element);
      textDirty = true;
    };
    const onLeave = (e: Event) => {
      hovered.delete(e.currentTarget as Element);
      textDirty = true;
    };
    buttons.forEach((el) => {
      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointerleave", onLeave);
      el.addEventListener("focus", onEnter);
      el.addEventListener("blur", onLeave);
    });

    /* ---------- Pointer → fluid splats ---------- */

    type Point = { u: number; v: number; t: number };
    let lastPoint: Point | null = null;
    const segments: Array<[number, number, number, number]> = [];

    const move = (clientX: number, clientY: number) => {
      const r = hero.getBoundingClientRect();
      const point = {
        u: (clientX - r.left) / r.width,
        v: 1 - (clientY - r.top) / r.height,
        t: performance.now(),
      };
      // Skip the jump when the pointer re-enters after a pause.
      if (lastPoint && point.t - lastPoint.t < 120) {
        segments.push([lastPoint.u, lastPoint.v, point.u, point.v]);
      }
      lastPoint = point;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "touch") move(e.clientX, e.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) move(touch.clientX, touch.clientY);
    };
    const onPointerEnd = () => {
      lastPoint = null;
    };
    if (!reduced) {
      hero.addEventListener("pointermove", onPointerMove, { passive: true });
      hero.addEventListener("pointerleave", onPointerEnd);
      hero.addEventListener("touchmove", onTouchMove, { passive: true });
      hero.addEventListener("touchend", onPointerEnd);
    }

    /* ---------- Render loop ---------- */

    let raf = 0;
    let last = 0;
    let time = 0;
    let flow = 0;
    let ready = false;
    let introDone = reduced;
    let swirlPrev: { u: number; v: number } | null = null;

    const textProgress = (group: number) =>
      introDone
        ? 1
        : easeOutExpo(
            clamp01((time - TEXT_INTRO_START - group * TEXT_INTRO_STAGGER) / TEXT_INTRO_DURATION)
          );

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      time += dt;

      if (layoutDirty) relayout();
      if (!width || !layout || !textCtx) return;

      // Orb: intro scale/fade, breathing, slow spin, flowing surface.
      const intro = reduced ? 1 : easeOutExpo(clamp01(time / ORB_INTRO));
      const voice = clamp01(levelRef.current);
      flow += dt * ORB_FLOW_SPEED * motion * (1 + 6 * (1 - intro)) * (1 + 4 * voice);
      orbMaterial.uniforms.uFlow.value = flow;
      orbMaterial.uniforms.uLevel.value = voice;
      orbMaterial.uniforms.uOpacity.value = intro;
      glowMaterial.uniforms.uOpacity.value = intro;
      orb.rotation.y += ORB_SPIN * motion * dt;
      const breathing = 1 + 0.015 * Math.sin((time * Math.PI * 2) / 4);
      orb.scale.setScalar(orbRadius * (0.6 + 0.4 * intro) * breathing);

      // Text: redrawn every frame during the intro, then only when dirty.
      if (!introDone) {
        textDirty = true;
        if (time >= TEXT_INTRO_END) introDone = true;
      }
      if (textDirty) {
        textDirty = false;
        drawLayout(textCtx, layout, dpr, textProgress, hovered);
        textTexture.needsUpdate = true;
      }

      if (!reduced) {
        const k = (time - SWIRL_START) / SWIRL_DURATION;
        if (k >= 0 && k <= 1) {
          const x = headline.left + (headline.right - headline.left) * k;
          const y = headline.y + Math.sin(k * Math.PI * 2) * headline.h * 0.25;
          const point = { u: x / width, v: 1 - y / height };
          if (swirlPrev) segments.push([swirlPrev.u, swirlPrev.v, point.u, point.v]);
          swirlPrev = point;
        }
      }
      for (const [u0, v0, u1, v1] of segments) fluid.splat(u0, v0, u1, v1);
      segments.length = 0;
      fluid.step(dt);

      renderer.setRenderTarget(sceneTarget);
      renderer.render(scene, camera);
      fluid.render(sceneTarget.texture);

      if (!ready) {
        ready = true;
        callbacks.current.onReady();
      }
    };

    // Only run while the hero is on screen and the tab is visible.
    let onScreen = true;
    const sync = () => {
      const shouldRun = onScreen && !document.hidden;
      if (shouldRun && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!shouldRun && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const intersection = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    intersection.observe(hero);
    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      cancelAnimationFrame(raf);
      intersection.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("resize", invalidate);
      document.fonts?.removeEventListener?.("loadingdone", invalidate);
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerEnd);
      hero.removeEventListener("touchmove", onTouchMove);
      hero.removeEventListener("touchend", onPointerEnd);
      buttons.forEach((el) => {
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointerleave", onLeave);
        el.removeEventListener("focus", onEnter);
        el.removeEventListener("blur", onLeave);
      });

      fluid.dispose();
      sceneTarget.dispose();
      textTexture.dispose();
      quad.dispose();
      orb.geometry.dispose();
      [background.material, glowMaterial, orbMaterial, textMaterial].forEach((m) =>
        (m as THREE.Material).dispose()
      );
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, [heroRef]);

  return <div ref={mountRef} aria-hidden className="pointer-events-none absolute inset-0 z-0" />;
}
