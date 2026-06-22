import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Check,
  ArrowLeft,
  ArrowUpRight,
  Code2,
  Sparkles,
  Megaphone,
  type LucideIcon,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HowItWorks } from "@/components/HowItWorks";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SERVICES, getService, imageUrl, type Service } from "@/lib/content";
import { serviceSchema, breadcrumbSchema } from "@/lib/site";

const ICONS: Record<Service["icon"], LucideIcon> = {
  web: Code2,
  ai: Sparkles,
  social: Megaphone,
};

// Pre-render one static page per service.
export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = getService(params.slug);
  if (!service) return { title: "Service" };
  const path = `/services/${service.slug}`;
  return {
    title: service.title,
    description: service.overview,
    keywords: [service.title, ...service.tags, "BlitzDeep"],
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title: `${service.title} — BlitzDeep`,
      description: service.tagline,
      url: path,
    },
  };
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = getService(params.slug);
  if (!service) notFound();

  const Icon = ICONS[service.icon];
  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="hero-gradient relative overflow-hidden">
          <div className="container-page grid items-center gap-12 pb-16 pt-32 sm:pt-36 lg:grid-cols-2 lg:gap-16 lg:pb-24 lg:pt-40">
            <Reveal>
              <Link
                href="/#services"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-body transition-colors hover:text-heading"
              >
                <ArrowLeft size={15} /> All Services
              </Link>
              <div className="mt-5 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-white text-brand">
                  <Icon size={22} strokeWidth={1.75} />
                </span>
                <span className="eyebrow">What We Do</span>
              </div>
              <h1 className="mt-5 font-semibold text-heading text-display-lg">{service.title}</h1>
              <p className="mt-4 max-w-md text-base text-body">{service.overview}</p>

              <div className="mt-7 flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-heading/80"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/#contact" size="lg">
                  Get a Proposal
                </Button>
                <Button href="/#testimonials" variant="outline" size="lg">
                  See Results
                </Button>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-4xl shadow-card">
                <Image
                  src={imageUrl(service.image, 900, 675)}
                  alt={`${service.title} illustration`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* What's included */}
        <section className="py-20 lg:py-28">
          <div className="container-page">
            <Reveal className="max-w-2xl">
              <span className="eyebrow">What&apos;s Included</span>
              <h2 className="mt-4 font-semibold text-heading text-display-sm">
                Everything you need to win
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-body">
                {service.tagline} Here&apos;s exactly what we deliver.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {service.features.map((feature, i) => (
                <Reveal key={feature.title} delay={(i % 2) * 100} className="h-full">
                  <div className="group flex h-full gap-4 rounded-3xl border border-line bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-card-hover">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                      <Check size={18} strokeWidth={2.5} />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-heading">{feature.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-body">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Shared process */}
        <HowItWorks />

        {/* Other services */}
        <section className="py-20 lg:py-28">
          <div className="container-page">
            <Reveal className="max-w-2xl">
              <span className="eyebrow">Explore More</span>
              <h2 className="mt-4 font-semibold text-heading text-display-sm">Other services</h2>
            </Reveal>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {others.map((other, i) => {
                const OtherIcon = ICONS[other.icon];
                return (
                  <Reveal key={other.slug} delay={i * 100}>
                    <Link
                      href={`/services/${other.slug}`}
                      className="group flex h-full items-center gap-5 rounded-3xl border border-line bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-card-hover"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line bg-brand-50 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                        <OtherIcon size={22} strokeWidth={1.75} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold text-heading">{other.title}</h3>
                        <p className="mt-0.5 text-sm text-body">{other.tagline}</p>
                      </div>
                      <ArrowUpRight
                        size={20}
                        className="shrink-0 text-body transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-brand"
                      />
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <CtaBand
          title={`Ready to start your ${service.title.toLowerCase()} project?`}
          description="Tell us where you want to grow. We'll show you exactly how to get there."
          ctaLabel="Get a Proposal"
          ctaHref="/#contact"
        />
      </main>
      <Footer />

      {/* Structured data: Service + breadcrumb trail */}
      <JsonLd data={serviceSchema(service)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/#services" },
          { name: service.title, path: `/services/${service.slug}` },
        ])}
      />
    </>
  );
}
