"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "blitzdeep-cookie-consent";
const OPEN_EVENT = "blitzdeep:cookie-settings";
const CHANGE_EVENT = "blitzdeep:cookie-consent";

export type CookieChoice = "accepted" | "declined";

/**
 * The visitor's stored choice, or null if they haven't made one. Anything
 * non-essential (analytics, ad pixels…) must check this is "accepted" before
 * loading, and can listen for the `blitzdeep:cookie-consent` window event to
 * react when the choice changes.
 */
export function getCookieChoice(): CookieChoice | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "accepted" || value === "declined" ? value : null;
  } catch {
    return null;
  }
}

const BUTTON =
  "inline-flex h-10 flex-1 items-center justify-center rounded-full px-5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/**
 * Cookie consent banner. Shown until the visitor accepts or declines; both
 * options carry equal weight and the choice is remembered on their device.
 * Self-contained dark styling so it reads the same on every page theme.
 */
export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Decided after mount: the server can't know the stored choice.
    if (!getCookieChoice()) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  const choose = (choice: CookieChoice) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // Storage unavailable (private mode): the banner will simply ask again.
    }
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: choice }));
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-4 bottom-4 z-[60] animate-fade-up rounded-2xl border border-white/10 bg-[#111418] p-5 text-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] sm:inset-x-auto sm:left-6 sm:bottom-6 sm:max-w-sm"
    >
      <p className="text-sm font-semibold">We value your privacy</p>
      <p className="mt-1.5 text-sm leading-relaxed text-white/70">
        We store only what this site needs to work. With your consent we may also use cookies to
        understand how the site is used and improve it.
      </p>
      <div className="mt-4 flex gap-2.5">
        <button
          type="button"
          onClick={() => choose("declined")}
          className={`${BUTTON} border border-white/25 text-white hover:bg-white/10`}
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => choose("accepted")}
          className={`${BUTTON} bg-white text-black hover:bg-white/90`}
        >
          Accept
        </button>
      </div>
    </div>
  );
}

/** Footer link that reopens the banner so a visitor can change their choice. */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      className={className}
    >
      Cookie settings
    </button>
  );
}
