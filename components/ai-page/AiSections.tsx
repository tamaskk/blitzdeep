import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Bot,
  Cable,
  Check,
  Code2,
  LineChart,
  Megaphone,
  Minus,
  PenTool,
  Plus,
  Rocket,
  ScanSearch,
  Search,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SERVICES, type Service, type Step } from "@/lib/content";
import { cn } from "@/lib/utils";
import { grotesk } from "./fonts";

/**
 * Everything below the hero on the AI Automation page, in the hero's visual
 * language: electric blue, navy and mint, a bold grotesk with serif-italic
 * accent words, frosted cards. Copy comes from the service entry in
 * lib/content.ts — this file is presentation only.
 */

// One icon per feature, in the order they appear in the service's `features`.
const FEATURE_ICONS: LucideIcon[] = [ScanSearch, Bot, Cable, BarChart3];

const STEP_ICONS: Record<Step["icon"], LucideIcon> = {
  discovery: Search,
  build: PenTool,
  launch: Rocket,
  optimize: LineChart,
};

const SERVICE_ICONS: Record<Service["icon"], LucideIcon> = {
  web: Code2,
  ai: Sparkles,
  social: Megaphone,
};

const H2 = `${grotesk.className} text-[clamp(2rem,4.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em]`;
const CARD =
  "rounded-[28px] border border-white bg-white/75 shadow-[0_24px_60px_-36px_rgba(11,59,255,0.5)] backdrop-blur";
const BUTTON =
  "inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/** Serif-italic accent word(s) inside a grotesk heading. */
function Accent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <em
      className={cn(
        "font-serif text-[1.08em] font-normal italic tracking-[-0.02em]",
        className
      )}
    >
      {children}
    </em>
  );
}

function Pill({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
        dark
          ? "border-white/20 bg-white/10 text-white/90"
          : "border-[#0B6BFF]/20 bg-white/70 text-[#0B5BFF]"
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dark ? "bg-[#5CF2B0]" : "bg-[#0B6BFF]")} />
      {children}
    </span>
  );
}

function Included({ service }: { service: Service }) {
  return (
    // Picks up the hero's bottom colour and fades it into the page background.
    <section
      id="included"
      className="scroll-mt-8 bg-gradient-to-b from-[#CFE3FF] to-[#F3F7FF] pb-20 pt-16 lg:pb-28 lg:pt-24"
    >
      <div className="container-page">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <Pill>What&rsquo;s Included</Pill>
          <h2 className={cn(H2, "mt-5 text-[#0A1A3A]")}>
            Everything you need to <Accent className="text-[#0B5BFF]">automate smarter</Accent>
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#4A5B7C]">
            {service.tagline} Here&rsquo;s exactly what we deliver.
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {service.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-[#0A1A3A] px-3 py-1 text-xs font-medium text-white"
              >
                {tag}
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {service.features.map((feature, i) => {
            const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
            return (
              <Reveal key={feature.title} delay={(i % 2) * 100} className="h-full">
                <div
                  className={cn(
                    CARD,
                    "group relative h-full overflow-hidden p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#0B6BFF]/30 sm:p-8"
                  )}
                >
                  <span
                    aria-hidden
                    className="absolute right-6 top-4 font-serif text-6xl italic leading-none text-[#0B6BFF]/15 transition-colors duration-300 group-hover:text-[#0B6BFF]/30"
                  >
                    0{i + 1}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-b from-[#2F86FF] to-[#0B3BFF] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_10px_20px_-10px_rgba(11,59,255,0.8)]">
                    <Icon size={22} strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight text-[#0A1A3A]">
                    {feature.title}
                  </h3>
                  <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-[#4A5B7C]">
                    {feature.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Deliverables({ service }: { service: Service }) {
  return (
    <section className="pb-20 lg:pb-28">
      <div className="container-page">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[40px] bg-[linear-gradient(160deg,#07133A_0%,#0A2187_55%,#0B5BFF_120%)] p-7 text-white sm:p-10 lg:p-14">
            {/* Soft colour blooms echoing the hero's orb and mint accent */}
            <div
              aria-hidden
              className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-[#EE5A43]/35 blur-3xl"
            />
            <div
              aria-hidden
              className="absolute -bottom-32 -left-20 -z-10 h-80 w-80 rounded-full bg-[#5CF2B0]/15 blur-3xl"
            />

            <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
              <div>
                <Pill dark>Deliverables</Pill>
                <h2 className={cn(H2, "mt-5")}>
                  What you <Accent className="text-[#5CF2B0]">walk away with</Accent>
                </h2>
                <ul className="mt-8 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                  {service.deliverables.map((item) => (
                    <li key={item} className="flex gap-3 text-[15px] leading-snug text-white/90">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#5CF2B0] text-[#07133A]">
                        <Check size={13} strokeWidth={3} aria-hidden />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-5">
                <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-xl sm:p-7">
                  <h3 className="text-base font-semibold">Ideal for</h3>
                  <ul className="mt-4 flex flex-col gap-3">
                    {service.idealFor.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/80">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5CF2B0]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-xl sm:p-7">
                  <h3 className="text-base font-semibold">Pricing</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">{service.pricing}</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Process({ service }: { service: Service }) {
  return (
    <section id="how-it-works" className="scroll-mt-8 pb-20 lg:pb-28">
      <div className="container-page">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <Pill>How It Works</Pill>
          <h2 className={cn(H2, "mt-5 text-[#0A1A3A]")}>
            From first call to <Accent className="text-[#0B5BFF]">lasting growth</Accent>
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#4A5B7C]">
            A simple, proven process that keeps every automation project transparent and on track.
          </p>
        </Reveal>

        <ol className="relative mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Line threading the four step icons together on desktop */}
          <span
            aria-hidden
            className="absolute left-[12.5%] right-[12.5%] top-[52px] hidden border-t border-dashed border-[#0B6BFF]/35 lg:block"
          />
          {service.process.map((item, i) => {
            const Icon = STEP_ICONS[item.icon];
            return (
              <li key={item.step} className="h-full">
                <Reveal delay={i * 120} className="h-full">
                  <div
                    className={cn(
                      CARD,
                      "relative flex h-full flex-col items-center p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#0B6BFF]/30"
                    )}
                  >
                    <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#0A1A3A] text-[#5CF2B0] ring-8 ring-white">
                      <Icon size={20} strokeWidth={1.75} aria-hidden />
                    </span>
                    <span className="mt-5 font-serif text-3xl italic leading-none text-[#0B5BFF]">
                      {item.step}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold tracking-tight text-[#0A1A3A]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#4A5B7C]">{item.description}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function Faq({ service }: { service: Service }) {
  return (
    <section id="faq" className="scroll-mt-8 pb-20 lg:pb-28">
      <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-16">
        <Reveal>
          <Pill>FAQs</Pill>
          <h2 className={cn(H2, "mt-5 text-[#0A1A3A]")}>
            Questions, <Accent className="text-[#0B5BFF]">answered</Accent>
          </h2>
          <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-[#4A5B7C]">
            Everything you need to know about our AI automation service.
          </p>
        </Reveal>

        <div className="flex flex-col gap-3">
          {service.faqs.map((item, i) => (
            <Reveal key={item.question} delay={i * 80}>
              {/* Native <details> keeps the accordion working without client JS */}
              <details
                open={i === 0}
                className="group rounded-2xl border border-white bg-white/75 px-5 py-4 shadow-[0_16px_40px_-32px_rgba(11,59,255,0.6)] backdrop-blur transition-colors duration-300 hover:border-[#0B6BFF]/40 open:border-[#0B6BFF]/30"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium text-[#0A1A3A] transition-colors marker:hidden group-hover:text-[#0B5BFF]">
                  {item.question}
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#0B6BFF]/25 text-[#0B5BFF] transition-all duration-300 group-open:rotate-180 group-open:border-[#0B3BFF] group-open:bg-[#0B3BFF] group-open:text-white">
                    <Plus size={16} className="group-open:hidden" aria-hidden />
                    <Minus size={16} className="hidden group-open:block" aria-hidden />
                  </span>
                </summary>
                <p className="mt-3 max-w-prose text-sm leading-relaxed text-[#4A5B7C]">
                  {item.answer}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function OtherServices({ service }: { service: Service }) {
  const others = SERVICES.filter((s) => s.slug !== service.slug);
  return (
    <section className="pb-20 lg:pb-28">
      <div className="container-page">
        <Reveal>
          <Pill>Explore More</Pill>
          <h2 className={cn(H2, "mt-5 text-[#0A1A3A]")}>
            Other <Accent className="text-[#0B5BFF]">services</Accent>
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {others.map((other, i) => {
            const Icon = SERVICE_ICONS[other.icon];
            return (
              <Reveal key={other.slug} delay={i * 100} className="h-full">
                <Link
                  href={`/services/${other.slug}`}
                  className={cn(
                    CARD,
                    "group flex h-full items-center gap-5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#0B6BFF]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5BFF]"
                  )}
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E6EFFF] text-[#0B5BFF] transition-colors duration-300 group-hover:bg-[#0B3BFF] group-hover:text-white">
                    <Icon size={22} strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold text-[#0A1A3A]">
                      {other.title}
                    </span>
                    <span className="mt-0.5 block text-sm text-[#4A5B7C]">{other.tagline}</span>
                  </span>
                  <ArrowUpRight
                    size={20}
                    aria-hidden
                    className="shrink-0 text-[#4A5B7C] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-[#0B5BFF]"
                  />
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="pb-20 lg:pb-28">
      <div className="container-page">
        <Reveal>
          <div className="relative isolate flex flex-col items-center overflow-hidden rounded-[40px] bg-[linear-gradient(180deg,#0B5BFF_0%,#2F86FF_100%)] px-6 py-14 text-center sm:px-12 lg:py-20">
            {/* The hero's orb, in miniature */}
            <div aria-hidden className="ai-orb h-24 w-24 animate-float [--orb-glow:40px] sm:h-28 sm:w-28" />
            <h2 className={cn(H2, "mt-8 max-w-2xl text-white")}>
              Ready to put AI <Accent className="text-[#5CF2B0]">to work?</Accent>
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/90">
              Tell us where your team loses the most time. We&rsquo;ll show you exactly what to
              automate first.
            </p>
            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/#contact"
                className={cn(
                  BUTTON,
                  "bg-[#0B3BFF] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] hover:bg-[#0930D6]"
                )}
              >
                Get a Proposal
              </Link>
              <Link
                href="/#testimonials"
                className={cn(BUTTON, "bg-white/85 text-[#0A1A3A] hover:bg-white")}
              >
                See Results
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function AiSections({ service }: { service: Service }) {
  return (
    <div className="bg-[#F3F7FF]">
      <Included service={service} />
      <Deliverables service={service} />
      <Process service={service} />
      <Faq service={service} />
      <OtherServices service={service} />
      <Cta />
    </div>
  );
}
