import {
  TrendingUp,
  Zap,
  Users,
  Maximize2,
  LifeBuoy,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { BENEFITS, STATS, type Benefit } from "@/lib/content";

const ICONS: Record<Benefit["icon"], LucideIcon> = {
  roi: TrendingUp,
  speed: Zap,
  team: Users,
  scale: Maximize2,
  support: LifeBuoy,
  data: BarChart3,
};

function BenefitCard({ item }: { item: Benefit }) {
  const Icon = ICONS[item.icon];
  return (
    <div className="group flex h-full gap-4 rounded-3xl border border-line bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-card-hover">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-brand-50 text-brand transition-all duration-300 group-hover:scale-110 group-hover:bg-brand group-hover:text-white">
        <Icon size={20} strokeWidth={1.75} />
      </span>
      <div>
        <h3 className="text-base font-semibold text-heading">{item.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-body">{item.description}</p>
      </div>
    </div>
  );
}

export function Benefits() {
  return (
    <section id="benefits" className="py-20 lg:py-28">
      <div className="container-page">
        <SectionHeader
          eyebrow="Benefits"
          title="Why Brands Choose BlitzDeep"
          description="The advantages that make us a long-term growth partner, not just another vendor."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 120} className="h-full">
              <BenefitCard item={item} />
            </Reveal>
          ))}
        </div>

        {/* Stats band */}
        <Reveal className="mt-10">
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
