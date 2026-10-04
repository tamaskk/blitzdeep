import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  CalendarRange,
  Check,
  Code2,
  Megaphone,
  MessagesSquare,
  Minus,
  Plus,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollVideo } from "./ScrollVideo";
import { SERVICES, type Service } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * The Social Media Marketing page: one video pinned behind the whole page and
 * scrubbed by scrolling (see ScrollVideo), a full-screen hero over the clear
 * footage, then sections over its blurred, darkened version — white type in a
 * medium weight, hairline borders, white pill buttons. Copy comes from the
 * service entry in lib/content.ts — this file is presentation only.
 */

// Re-encoded for scrubbing: 1080p, 60fps, every frame a keyframe, so seeking
// to any point is instant in both directions.
const HERO_VIDEO = "/videos/social-hero.mp4";

// One icon per feature, in the order they appear in the service's `features`.
const FEATURE_ICONS: LucideIcon[] = [CalendarRange, Target, MessagesSquare, BarChart3];

const SERVICE_ICONS: Record<Service["icon"], LucideIcon> = {
  web: Code2,
  ai: Sparkles,
  social: Megaphone,
};

const H2 = "text-[30px] font-medium leading-[1.1] tracking-tight text-white md:text-[44px]";
const LEAD = "text-[15px] leading-relaxed text-white/70 md:text-base";
const EYEBROW = "text-sm font-normal text-white/60";
const CTA =
  "inline-flex items-center justify-center rounded-full bg-white px-[26px] py-3 text-[15px] font-medium text-black shadow-[0_4px_14px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transform-none";

function Hero() {
  return (
    <section className="relative flex h-[100svh] min-h-[560px] items-center justify-center">
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 text-center">
        <h1 className="animate-fade-up text-[38px] font-medium leading-[1.1] text-white [animation-delay:250ms] md:text-[56px]">
          Turn Social Channels
          <br />
          Into Qualified Pipeline
        </h1>
        <p className="mt-5 max-w-xl animate-fade-up text-[15px] text-white/80 [animation-delay:400ms] md:text-lg">
          We handle strategy, content, paid ads and reporting across the channels your buyers
          actually use.
        </p>
        <div className="mt-8 animate-fade-up [animation-delay:550ms]">
          <Link href="/#contact" className={CTA}>
            Get a Proposal
          </Link>
        </div>
      </div>
    </section>
  );
}

function Included({ service }: { service: Service }) {
  return (
    <section id="included" className="scroll-mt-8 py-20 lg:py-28">
      <div className="container-page">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className={EYEBROW}>What&rsquo;s Included</span>
          <h2 className={cn(H2, "mt-4")}>
            Everything you need
            <br />
            to win on social
          </h2>
          <p className={cn(LEAD, "mt-5 max-w-md")}>
            {service.tagline} Here&rsquo;s exactly what we deliver.
          </p>
          <ul className="mt-7 flex flex-wrap justify-center gap-2">
            {service.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-white/20 px-3.5 py-1 text-sm text-white/90"
              >
                {tag}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* One bordered grid; the 1px gaps show the lighter backdrop as hairlines */}
        <Reveal className="mt-14">
          <div className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {service.features.map((feature, i) => {
              const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
              return (
                <div
                  key={feature.title}
                  className="group bg-black/45 p-8 transition-colors duration-300 hover:bg-black/25 sm:p-10"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors duration-300 group-hover:bg-white group-hover:text-black">
                      <Icon size={19} strokeWidth={1.5} aria-hidden />
                    </span>
                    <span className="text-sm text-white/40">0{i + 1}</span>
                  </div>
                  <h3 className="mt-8 text-xl font-medium text-white">{feature.title}</h3>
                  <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-white/70">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Deliverables({ service }: { service: Service }) {
  return (
    <section className="border-t border-white/10 py-20 lg:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <Reveal>
          <span className={EYEBROW}>Deliverables</span>
          <h2 className={cn(H2, "mt-4")}>What you get</h2>
          <ul className="mt-8">
            {service.deliverables.map((item) => (
              <li
                key={item}
                className="flex items-start gap-4 border-b border-white/10 py-4 text-[15px] text-white/90 md:text-base"
              >
                <Check size={18} strokeWidth={1.75} aria-hidden className="mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="flex flex-col gap-5">
          <Reveal delay={100}>
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 sm:p-8">
              <h3 className="text-lg font-medium text-white">Ideal for</h3>
              <ul className="mt-5 flex flex-col gap-3.5">
                {service.idealFor.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-white/70">
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-white" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 sm:p-8">
              <h3 className="text-lg font-medium text-white">Pricing</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-white/70">{service.pricing}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Process({ service }: { service: Service }) {
  return (
    <section id="how-it-works" className="scroll-mt-8 border-t border-white/10 py-20 lg:py-28">
      <div className="container-page">
        <Reveal className="max-w-2xl">
          <span className={EYEBROW}>How It Works</span>
          <h2 className={cn(H2, "mt-4")}>
            From first call
            <br />
            to lasting growth
          </h2>
        </Reveal>

        <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {service.process.map((item, i) => (
            <li key={item.step}>
              <Reveal delay={i * 120}>
                <div className="border-t border-white/25 pt-6">
                  <span className="text-[44px] font-medium leading-none text-white/25">
                    {item.step}
                  </span>
                  <h3 className="mt-6 text-lg font-medium text-white">{item.title}</h3>
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
    <section id="faq" className="scroll-mt-8 border-t border-white/10 py-20 lg:py-28">
      <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-20">
        <Reveal>
          <span className={EYEBROW}>FAQs</span>
          <h2 className={cn(H2, "mt-4")}>
            Questions,
            <br />
            answered
          </h2>
          <p className={cn(LEAD, "mt-5 max-w-xs")}>
            Everything you need to know about our social media marketing service.
          </p>
        </Reveal>

        <Reveal className="border-t border-white/10">
          {service.faqs.map((item, i) => (
            // Native <details> keeps the accordion working without client JS
            <details key={item.question} open={i === 0} className="group border-b border-white/10">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-base font-medium text-white marker:hidden md:text-lg">
                {item.question}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-colors duration-300 group-hover:border-white group-open:bg-white group-open:text-black">
                  <Plus size={16} className="group-open:hidden" aria-hidden />
                  <Minus size={16} className="hidden group-open:block" aria-hidden />
                </span>
              </summary>
              <p className="max-w-prose pb-6 text-[15px] leading-relaxed text-white/70">
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
    <section className="border-t border-white/10 py-20 lg:py-28">
      <div className="container-page">
        <Reveal>
          <span className={EYEBROW}>Explore More</span>
          <h2 className={cn(H2, "mt-4")}>Other services</h2>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {others.map((other, i) => {
            const Icon = SERVICE_ICONS[other.icon];
            return (
              <Reveal key={other.slug} delay={i * 100} className="h-full">
                <Link
                  href={`/services/${other.slug}`}
                  className="group flex h-full items-center gap-5 rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition-colors duration-300 hover:border-white/30 hover:bg-white/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-colors duration-300 group-hover:bg-white group-hover:text-black">
                    <Icon size={20} strokeWidth={1.5} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-medium text-white">{other.title}</span>
                    <span className="mt-0.5 block text-sm text-white/60">{other.tagline}</span>
                  </span>
                  <ArrowUpRight
                    size={20}
                    aria-hidden
                    className="shrink-0 text-white/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-white"
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
    <section className="border-t border-white/10 py-24 lg:py-32">
      <Reveal className="container-page flex flex-col items-center text-center">
        <h2 className="text-[38px] font-medium leading-[1.1] text-white md:text-[56px]">
          Ready to grow
          <br />
          on social?
        </h2>
        <p className="mt-5 max-w-md text-[15px] text-white/80 md:text-lg">
          Tell us where you want to grow. We&rsquo;ll show you exactly how to get there.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link href="/#contact" className={CTA}>
            Get a Proposal
          </Link>
          <Link
            href="/#testimonials"
            className="inline-flex items-center justify-center rounded-full border border-white px-[26px] py-3 text-[15px] font-normal text-white transition-colors hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            See Results
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

export function SocialPage({ service }: { service: Service }) {
  return (
    // `social-page` also hides the page scrollbar (see globals.css). The
    // clip-path keeps the fixed video inside this wrapper, off the footer.
    <div className="social-page relative isolate [clip-path:inset(0)]">
      <ScrollVideo src={HERO_VIDEO} />
      <Hero />
      <Included service={service} />
      <Deliverables service={service} />
      <Process service={service} />
      <Faq service={service} />
      <OtherServices service={service} />
      <Cta />
    </div>
  );
}
