import Image from "next/image";
import Link from "next/link";
import { Code2, Sparkles, Megaphone, ArrowUpRight, type LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { SERVICES, imageUrl, type Service } from "@/lib/content";

const ICONS: Record<Service["icon"], LucideIcon> = {
  web: Code2,
  ai: Sparkles,
  social: Megaphone,
};

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-heading/80 transition-colors hover:bg-brand-100">
      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
      {label}
    </span>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const Icon = ICONS[service.icon];
  return (
    <Link
      href={`/services/${service.slug}`}
      aria-label={`${service.title} — learn more`}
      className="group flex h-full flex-col rounded-3xl border border-line bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface-muted text-brand transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
          <Icon size={20} strokeWidth={1.75} />
        </div>
        <ArrowUpRight
          size={20}
          className="text-body transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-brand"
        />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-heading">{service.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-body">{service.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {service.tags.map((tag, i) => (
          <Tag key={`${tag}-${i}`} label={tag} />
        ))}
      </div>

      {/* image with hover zoom (clipped by the rounded wrapper) */}
      <div className="mt-5 overflow-hidden rounded-2xl">
        <div className="relative aspect-[16/10]">
          <Image
            src={imageUrl(service.image, 640, 400)}
            alt={`${service.title} illustration`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-105"
          />
        </div>
      </div>
    </Link>
  );
}

export function Services() {
  return (
    <section id="services" className="py-20 lg:py-28">
      <div className="container-page">
        <SectionHeader
          eyebrow="What We Do"
          title="Three Services, One Goal: Growth"
          description="We focus on the work that moves your numbers — and do it exceptionally well."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <Reveal key={service.title} delay={i * 120} className="h-full">
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
