"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Code2, Sparkles, Megaphone, Menu, X, type LucideIcon } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { NAV_LINKS, SERVICES, type Service } from "@/lib/content";

const SERVICE_ICONS: Record<Service["icon"], LucideIcon> = {
  web: Code2,
  ai: Sparkles,
  social: Megaphone,
};

/**
 * Mobile navigation (below `lg`). The hamburger opens a full-screen frosted
 * panel that slides in from the left; a close (X) button sits in the top-right.
 * Locks body scroll, closes on Escape / link tap, and moves focus to the close
 * button on open (and back to the trigger on close).
 *
 * The overlay is portalled to <body> so it escapes the header's transformed
 * stacking context — an ancestor `transform` (the header's entrance animation)
 * would otherwise make `position: fixed` resolve against the header box instead
 * of the viewport, collapsing the panel to the header's height.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const overlay = (
    <div
      id="mobile-menu"
      className={`fixed inset-0 z-50 lg:hidden transition-[visibility] duration-300 ${
        open ? "visible" : "invisible delay-300"
      }`}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={`absolute inset-0 flex flex-col bg-surface-subtle/90 backdrop-blur-xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top bar: logo + close */}
        <div className="container-page flex h-20 shrink-0 items-center justify-between">
          <Logo />
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-heading transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2"
          >
            <X size={20} aria-hidden />
          </button>
        </div>

        {/* Scrollable nav body */}
        <nav className="container-page flex flex-1 flex-col overflow-y-auto overscroll-contain pb-10 pt-4">
          <p className="eyebrow">What We Do</p>
          <ul className="mt-3 flex flex-col gap-1">
            {SERVICES.map((service) => {
              const Icon = SERVICE_ICONS[service.icon];
              return (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    onClick={close}
                    className="flex items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-white"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-brand-50 text-brand">
                      <Icon size={20} strokeWidth={1.75} aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-base font-semibold text-heading">
                        {service.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-body">{service.tagline}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="my-5 h-px bg-line" />

          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={close}
                  className="block rounded-2xl px-3 py-3 text-lg font-medium text-heading transition-colors hover:bg-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Button href="/#contact" size="lg" className="mt-8 w-full" onClick={close}>
            Get a Proposal
          </Button>
        </nav>
      </div>
    </div>
  );

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white/70 text-heading transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2"
      >
        <Menu size={20} aria-hidden />
      </button>

      {mounted ? createPortal(overlay, document.body) : null}
    </div>
  );
}
