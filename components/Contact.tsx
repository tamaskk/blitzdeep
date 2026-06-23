"use client";

import { useState } from "react";
import { Mail, Phone, Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const fieldBase =
  "w-full rounded-xl border border-white/10 bg-ink-800 px-4 text-sm text-white placeholder:text-white/50 focus:outline-none focus-visible:border-brand focus-visible:ring-1 focus-visible:ring-brand disabled:opacity-60";

function Field({
  id,
  label,
  type = "text",
  placeholder,
  required,
  autoComplete,
  inputMode,
  spellCheck,
  autoCapitalize,
  disabled,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"];
  spellCheck?: boolean;
  autoCapitalize?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-white/80">
        {label}
        {required && (
          <span className="text-brand" aria-hidden>
            *
          </span>
        )}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        spellCheck={spellCheck}
        autoCapitalize={autoCapitalize}
        disabled={disabled}
        className={`${fieldBase} h-11`}
      />
    </div>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group relative flex-1 rounded-2xl border border-line bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2"
    >
      <span className="absolute right-4 top-4 flex gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
        <span className="h-1.5 w-1.5 rounded-full bg-line" />
      </span>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface-muted text-brand">
        <Icon size={18} strokeWidth={1.75} aria-hidden />
      </span>
      <p className="mt-4 text-sm font-semibold text-heading">{label}</p>
      <p className="mt-0.5 text-sm text-body transition-colors group-hover:text-brand">{value}</p>
    </a>
  );
}

type Status = "idle" | "submitting" | "success" | "error";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "" }));
        throw new Error(error || "Could not send your message. Please try again.");
      }

      form.reset();
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  const submitting = status === "submitting";

  return (
    <section id="contact" className="py-20 lg:py-28">
      <div className="container-page grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left: heading + contact cards */}
        <Reveal className="flex flex-col">
          <span className="eyebrow">Contact</span>
          <h2 className="mt-4 font-semibold text-heading text-display-sm">Let&rsquo;s Talk</h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-body">
            Got questions or ready to start your design project? Let&rsquo;s bring your ideas to
            life.
          </p>

          <div className="mt-auto flex flex-col gap-4 pt-10 sm:flex-row">
            <ContactCard
              icon={Mail}
              label="Mail"
              value="info@blitzdeep.com"
              href="mailto:info@blitzdeep.com"
            />
            <ContactCard
              icon={Phone}
              label="Phone"
              value="+332-278-8976"
              href="tel:+3322788976"
            />
          </div>
        </Reveal>

        {/* Right: dark form */}
        <Reveal delay={120}>
          <form
            onSubmit={handleSubmit}
            aria-busy={submitting}
            className="rounded-3xl bg-ink p-6 sm:p-8 transition-shadow duration-300 hover:shadow-card-hover"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id="firstName"
                label="First name"
                placeholder="Jane…"
                required
                autoComplete="given-name"
                disabled={submitting}
              />
              <Field
                id="lastName"
                label="Last name"
                placeholder="Cooper…"
                required
                autoComplete="family-name"
                disabled={submitting}
              />
            </div>
            <div className="mt-5 grid gap-5">
              <Field
                id="email"
                label="Email"
                type="email"
                placeholder="you@company.com…"
                required
                autoComplete="email"
                inputMode="email"
                spellCheck={false}
                autoCapitalize="none"
                disabled={submitting}
              />
              {/* type="text" (not "url") so an optional entry like
                  "yourcompany.com" without https:// doesn't block submission;
                  inputMode keeps the URL-optimized keyboard on mobile. */}
              <Field
                id="website"
                label="Website"
                type="text"
                placeholder="yourcompany.com…"
                autoComplete="url"
                inputMode="url"
                spellCheck={false}
                autoCapitalize="none"
                disabled={submitting}
              />
              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-xs font-medium text-white/80">
                  Write Message
                  <span className="text-brand" aria-hidden>
                    *
                  </span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Tell us about your project…"
                  required
                  disabled={submitting}
                  className={`${fieldBase} resize-none py-3`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-white shadow-btn transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-hover active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              {submitting && <Loader2 size={16} className="animate-spin" aria-hidden />}
              {submitting ? "Sending…" : "Send Message"}
            </button>

            {/* Async status — announced to screen readers */}
            <p
              role="status"
              aria-live="polite"
              className={`mt-3 min-h-[1.25rem] text-sm ${
                status === "success"
                  ? "text-emerald-400"
                  : status === "error"
                    ? "text-red-400"
                    : "sr-only"
              }`}
            >
              {status === "success" &&
                "Thanks — your message is on its way. We’ll be in touch shortly."}
              {status === "error" && errorMsg}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
