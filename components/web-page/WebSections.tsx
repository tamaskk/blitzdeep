import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Check,
  Code2,
  LayoutTemplate,
  Megaphone,
  Minus,
  Plus,
  Search,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SERVICES, type Service } from "@/lib/content";
import { cn } from "@/lib/utils";
import { display } from "./fonts";

/**
 * Everything below the hero on the Website Development page, in the hero's
 * editorial print language: signal yellow, black and cream, heavy uppercase
 * grotesk, halftone dots, hard-edged cards. Copy comes from the service entry
 * in lib/content.ts — this file is presentation only.
 */

// One icon per feature, in the order they appear in the service's `features`.
const FEATURE_ICONS: LucideIcon[] = [LayoutTemplate, Zap, Search, BarChart3];

const SERVICE_ICONS: Record<Service["icon"], LucideIcon> = {
  web: Code2,
  ai: Sparkles,
  social: Megaphone,
};

const H2 = `${display.className} text-[clamp(2.5rem,7vw,5.5rem)] uppercase leading-[0.9] tracking-[-0.02em]`;
const EYEBROW = "text-sm font-semibold uppercase tracking-[0.12em]";
// Hard-edged card that "presses" into an offset shadow on hover.
const CARD =
  "rounded-2xl border-2 border-black bg-white transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_#000]";
const PILL =
  "inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-semibold transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transform-none";

function Included({ service }: { service: Service }) {
  return (
    <section id="included" className="scroll-mt-8 py-20 lg:py-28">
      <div className="container-page">
        <Reveal className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <span className={cn(EYEBROW, "text-[#E64614]")}>What&rsquo;s Included</span>
            <h2 className={cn(H2, "mt-4 text-black")}>
              Everything
              <br />
              you need
              <br />
              <span className="text-[#E64614]">to win</span>
            </h2>
          </div>
          <div className="lg:pb-3">
            <p className="max-w-md text-lg font-medium leading-snug text-black">
              {service.tagline} Here&rsquo;s exactly what we deliver.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {service.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border-2 border-black px-3.5 py-1 text-sm font-semibold text-black"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {service.features.map((feature, i) => {
            const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
            return (
              <Reveal key={feature.title} delay={(i % 2) * 100} className="h-full">
                <div className={cn(CARD, "group h-full p-7 hover:bg-[#F6B70A] sm:p-8")}>
                  <div className="flex items-start justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-[#F6B70A]">
                      <Icon size={21} strokeWidth={2} aria-hidden />
                    </span>
                    <span
                      aria-hidden
                      className={`${display.className} text-5xl leading-none text-[#E64614] transition-colors group-hover:text-black`}
                    >
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-8 text-2xl font-bold tracking-tight text-black">
                    {feature.title}
                  </h3>
                  <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-black/70">
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
    <section className="bg-[#14110A] py-20 text-white lg:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <Reveal>
          <span className={cn(EYEBROW, "text-[#F6B70A]")}>Deliverables</span>
          <h2 className={cn(H2, "mt-4")}>
            What you
            <br />
            <span className="text-[#F6B70A]">get</span>
          </h2>
          <ul className="mt-10 grid gap-x-8 sm:grid-cols-2">
            {service.deliverables.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 border-t border-white/15 py-4 text-[15px] leading-snug text-white/90"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F6B70A] text-black">
                  <Check size={13} strokeWidth={3} aria-hidden />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* The hero's two cards, grown up: one white, one smoked glass */}
        <div className="flex flex-col gap-5 lg:pt-12">
          <Reveal delay={100}>
            <div className="rounded-2xl bg-white p-7 text-black sm:p-8">
              <h3 className="text-lg font-bold">Ideal for</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {service.idealFor.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-black/75">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#E64614]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="rounded-2xl border border-white/10 bg-[rgba(246,183,10,0.14)] p-7 sm:p-8">
              <h3 className="text-lg font-bold">Pricing</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/80">{service.pricing}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Process({ service }: { service: Service }) {
  return (
    <section
      id="how-it-works"
      className="relative isolate scroll-mt-8 overflow-hidden bg-[#F6B70A] py-20 lg:py-28"
    >
      <div
        aria-hidden
        className="web-halftone absolute inset-0 -z-10 opacity-50 [mask-image:linear-gradient(to_bottom,#000,transparent_70%)]"
      />
      <div className="container-page">
        <Reveal>
          <span className={cn(EYEBROW, "text-black")}>How It Works</span>
          <h2 className={cn(H2, "mt-4 text-black")}>
            First call
            <br />
            <span className="text-white">to launch</span>
          </h2>
        </Reveal>

        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {service.process.map((item, i) => (
            <li key={item.step} className="h-full">
              <Reveal delay={i * 120} className="h-full">
                <div className="flex h-full flex-col rounded-2xl bg-[#14110A] p-7 text-white transition-transform duration-200 hover:-translate-y-1">
                  <span className={`${display.className} text-6xl leading-none text-[#F6B70A]`}>
                    {item.step}
                  </span>
                  <h3 className="mt-8 text-xl font-bold tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/70">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Faq({ service }: { service: Service }) {
  return (
    <section id="faq" className="scroll-mt-8 py-20 lg:py-28">
      <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-16">
        <Reveal>
          <span className={cn(EYEBROW, "text-[#E64614]")}>FAQs</span>
          {/* Smaller than the other headings so "questions" fits its narrow column */}
          <h2 className={cn(H2, "mt-4 text-black !text-[clamp(2.25rem,4.4vw,3.75rem)]")}>
            Good
            <br />
            questions
          </h2>
          <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-black/70">
            Everything you need to know about our website development service.
          </p>
        </Reveal>

        <Reveal className="border-t-2 border-black">
          {service.faqs.map((item, i) => (
            // Native <details> keeps the accordion working without client JS
            <details key={item.question} open={i === 0} className="group border-b-2 border-black">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg font-bold text-black marker:hidden">
                {item.question}
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-black text-black transition-colors duration-200 group-hover:bg-[#F6B70A] group-open:bg-black group-open:text-[#F6B70A]">
                  <Plus size={17} strokeWidth={2.5} className="group-open:hidden" aria-hidden />
                  <Minus
                    size={17}
                    strokeWidth={2.5}
                    className="hidden group-open:block"
                    aria-hidden
                  />
                </span>
              </summary>
              <p className="max-w-prose pb-6 text-[15px] leading-relaxed text-black/70">
                {item.answer}
              </p>
            </details>
          ))}
        </Reveal>
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
          <span className={cn(EYEBROW, "text-[#E64614]")}>Explore More</span>
          <h2 className={cn(H2, "mt-4 text-black")}>Other services</h2>
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
                    "group flex h-full items-center gap-5 p-6 hover:bg-[#F6B70A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  )}
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black text-[#F6B70A]">
                    <Icon size={21} strokeWidth={2} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg font-bold text-black">{other.title}</span>
                    <span className="mt-0.5 block text-sm text-black/70">{other.tagline}</span>
                  </span>
                  <ArrowUpRight
                    size={22}
                    strokeWidth={2.5}
                    aria-hidden
                    className="shrink-0 text-black transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
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
          <div className="relative isolate overflow-hidden rounded-[32px] bg-[#F6B70A] px-6 py-16 text-center sm:px-12 lg:py-24">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_100%,rgba(255,120,40,0.75),transparent)]"
            />
            <div
              aria-hidden
              className="web-halftone absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(ellipse_at_center,rgba(0,0,0,0.2)_0%,#000_75%)]"
            />
            <h2 className={cn(H2, "text-black")}>
              Ready to
              <br />
              <span className="text-white">launch?</span>
            </h2>
            <p className="mx-auto mt-5 max-w-md text-lg font-medium leading-snug text-black">
              Tell us where you want to grow. We&rsquo;ll show you exactly how to get there.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/#contact"
                className={cn(PILL, "bg-black text-white focus-visible:outline-black")}
              >
                Get a Proposal
              </Link>
              <Link
                href="/#testimonials"
                className={cn(PILL, "bg-white text-black focus-visible:outline-black")}
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

export function WebSections({ service }: { service: Service }) {
  return (
    <div className="bg-[#FFF7E0]">
      <Included service={service} />
      <Deliverables service={service} />
      <Process service={service} />
      <Faq service={service} />
      <OtherServices service={service} />
      <Cta />
    </div>
  );
}
