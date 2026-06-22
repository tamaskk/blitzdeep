import type { Metadata } from "next";
import Image from "next/image";
import { Eye, Gem, Handshake, Rocket, type LucideIcon } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CtaBand } from "@/components/CtaBand";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { VALUES, FOUNDER, STATS, imageUrl, type Value } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "BlitzDeep is the growth partner behind 300+ brands. Meet founder Tamas Krisztian Kalman and the values behind our websites, AI automation and social media work.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About BlitzDeep",
    description:
      "The growth partner behind 300+ brands — websites, AI automation and social media marketing that drive measurable ROI.",
    url: "/about",
  },
};

const VALUE_ICONS: Record<Value["icon"], LucideIcon> = {
  transparency: Eye,
  craft: Gem,
  partnership: Handshake,
  momentum: Rocket,
};

/* ---------- Hero ---------- */
function AboutHero() {
  return (
    <section className="hero-gradient relative overflow-hidden">
      <div className="container-page relative flex flex-col items-center pb-20 pt-32 text-center sm:pt-36 lg:pt-40">
        <span className="eyebrow animate-fade-up [animation-delay:60ms]">About Us</span>
        <h1 className="mt-5 max-w-3xl animate-fade-up font-semibold text-heading text-display-lg [animation-delay:150ms]">
          The Growth Partner Behind{" "}
          <span className="font-serif italic font-normal">300+ Brands</span>
        </h1>
        <p className="mt-6 max-w-xl animate-fade-up text-base text-body [animation-delay:280ms]">
          We&apos;re a small, senior team obsessed with one thing: turning websites, AI automation
          and social campaigns into measurable business growth.
        </p>
        <div className="mt-8 animate-fade-up [animation-delay:400ms]">
          <Button href="/#contact" size="lg">
            Work With Us
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ---------- Big image ---------- */
function AboutImage() {
  return (
    <section className="container-page">
      <Reveal className="-mt-6">
        <div className="relative aspect-[16/8] w-full overflow-hidden rounded-4xl shadow-card">
          <Image
            src={imageUrl("photo-1600880292203-757bb62b4baf", 1600, 800)}
            alt="The BlitzDeep team collaborating in the studio"
            fill
            priority
            sizes="(max-width: 1216px) 100vw, 1216px"
            className="object-cover"
          />
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Story ---------- */
function Story() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <span className="eyebrow">Our Story</span>
          <h2 className="mt-4 font-semibold text-heading text-display-sm">
            Built by operators, not just designers
          </h2>
          <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-body">
            <p>
              BlitzDeep started with a simple frustration: agencies that delivered pretty deliverables
              but no real results. We set out to build the opposite — a team that ties every project
              to the numbers that actually matter.
            </p>
            <p>
              Today we help B2B brands ship conversion-focused websites, automate the busywork with
              AI, and turn social channels into a steady source of qualified pipeline. No fluff, no
              hand-offs to juniors — just senior people who care about your growth.
            </p>
          </div>
          <Button href="/#services" variant="outline" className="mt-7">
            See What We Do
          </Button>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-4xl shadow-card">
            <Image
              src={imageUrl("photo-1522071820081-009f0129c71c", 900, 675)}
              alt="BlitzDeep team working together"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Values ---------- */
function ValueCard({ item }: { item: Value }) {
  const Icon = VALUE_ICONS[item.icon];
  return (
    <div className="group flex h-full flex-col rounded-3xl border border-line bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-card-hover">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-brand-50 text-brand transition-all duration-300 group-hover:scale-110 group-hover:bg-brand group-hover:text-white">
        <Icon size={20} strokeWidth={1.75} />
      </span>
      <h3 className="mt-5 text-base font-semibold text-heading">{item.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-body">{item.description}</p>
    </div>
  );
}

function Values() {
  return (
    <section className="bg-surface-muted py-20 lg:py-28">
      <div className="container-page">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">Our Values</span>
          <h2 className="mt-4 font-semibold text-heading text-display-sm">
            The principles we work by
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((item, i) => (
            <Reveal key={item.title} delay={i * 100} className="h-full">
              <ValueCard item={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Stats ---------- */
function Stats() {
  return (
    <section className="py-20 lg:py-24">
      <div className="container-page">
        <Reveal>
          <div className="grid grid-cols-2 gap-y-10 rounded-3xl bg-ink p-8 text-white sm:p-10 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-semibold tracking-tight">{stat.value}</p>
                <p className="mt-1 text-sm text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Founder ---------- */
function Founder() {
  return (
    <section className="pb-20 lg:pb-28">
      <div className="container-page">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">The Team</span>
          <h2 className="mt-4 font-semibold text-heading text-display-sm">Meet the founder</h2>
        </Reveal>

        <Reveal delay={120} className="mt-12">
          <div className="grid items-center gap-8 rounded-4xl border border-line bg-white p-6 shadow-card sm:p-8 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-12">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
              <Image
                src={FOUNDER.photo}
                alt={FOUNDER.name}
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-brand">
                {FOUNDER.role}
              </span>
              <h3 className="mt-2 font-semibold text-heading text-display-sm">{FOUNDER.name}</h3>
              <p className="mt-5 text-[15px] leading-relaxed text-body">{FOUNDER.bio}</p>
              <div className="mt-7">
                <Button href="/#contact">Work With Me</Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <AboutHero />
        <AboutImage />
        <Story />
        <Values />
        <Stats />
        <Founder />
        <CtaBand
          title="Ready to build your growth engine?"
          description="Tell us where you want to grow. We'll show you exactly how to get there."
        />
      </main>
      <Footer />
    </>
  );
}
