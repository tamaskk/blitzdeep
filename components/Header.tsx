import Link from "next/link";
import { ChevronDown, Code2, Sparkles, Megaphone, type LucideIcon } from "lucide-react";
import { MobileMenu } from "@/components/MobileMenu";
import { NAV_LINKS, SERVICES, type Service } from "@/lib/content";
import { cn } from "@/lib/utils";

const SERVICE_ICONS: Record<Service["icon"], LucideIcon> = {
  web: Code2,
  ai: Sparkles,
  social: Megaphone,
};

type Tone = "dark" | "light";

const LINK_TONE: Record<Tone, string> = {
  dark: "text-heading/80 hover:text-heading",
  light: "text-white/90 hover:text-white",
};

/**
 * "What We Do" nav item: the label is a normal link that scrolls to the
 * services section, while hovering (or keyboard-focusing) reveals a dropdown
 * of the individual services, each linking to its own page. CSS-only — the
 * `pt-4` on the panel bridges the gap so the menu stays open on hover, and
 * `group-focus-within` keeps it reachable by keyboard.
 */
function WhatWeDoDropdown({ tone }: { tone: Tone }) {
  return (
    <li className="group relative">
      <Link
        href="/#services"
        aria-haspopup="true"
        className={cn("flex items-center gap-1 text-sm font-normal transition-colors", LINK_TONE[tone])}
      >
        What We Do
        <ChevronDown
          size={15}
          aria-hidden
          className="transition-transform duration-200 group-hover:rotate-180"
        />
      </Link>

      <div className="invisible absolute left-1/2 top-full z-40 -translate-x-1/2 translate-y-1 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <div className="w-[340px] rounded-2xl border border-line bg-card p-2 shadow-card-hover">
          {SERVICES.map((service) => {
            const Icon = SERVICE_ICONS[service.icon];
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group/item flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-surface-muted"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-brand-50 text-brand transition-colors group-hover/item:bg-brand group-hover/item:text-white">
                  <Icon size={17} strokeWidth={1.75} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-heading">{service.title}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-body">
                    {service.tagline}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </li>
  );
}

/**
 * Site navigation: the same bare, transparent bar on every page. `tone` only
 * picks the text colour — "dark" over light heroes, "light" over saturated or
 * media-backed ones.
 */
export function Header({ tone = "dark" }: { tone?: Tone }) {
  const light = tone === "light";

  return (
    <header className="absolute inset-x-0 top-0 z-30 animate-fade-up">
      <nav className="container-page flex h-20 items-center justify-between">
        <Link
          href="/"
          aria-label="BlitzDeep home"
          className={cn(
            "text-xl font-semibold transition-transform duration-200 hover:scale-105",
            light ? "text-white" : "text-heading"
          )}
        >
          BlitzDeep
        </Link>

        {/* Centered nav — hidden below large screens */}
        <ul className="hidden items-center gap-6 lg:flex xl:gap-8">
          <WhatWeDoDropdown tone={tone} />
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className={cn(
                  "relative text-sm font-normal transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:transition-all after:duration-300 hover:after:w-full",
                  LINK_TONE[tone],
                  light ? "after:bg-white" : "after:bg-heading"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2.5">
          <Link
            href="/#contact"
            className={cn(
              "hidden h-10 items-center rounded-full border px-5 text-sm font-normal transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:inline-flex",
              light
                ? "border-white text-white hover:bg-white hover:text-black focus-visible:outline-white"
                : "border-heading text-heading hover:bg-heading hover:text-white focus-visible:outline-heading"
            )}
          >
            Get a Proposal
          </Link>
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
