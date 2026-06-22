import { Search, PenTool, Rocket, LineChart, type LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { STEPS, type Step } from "@/lib/content";

const ICONS: Record<Step["icon"], LucideIcon> = {
  discovery: Search,
  build: PenTool,
  launch: Rocket,
  optimize: LineChart,
};

function StepCard({ item }: { item: Step }) {
  const Icon = ICONS[item.icon];
  return (
    <div className="group relative flex h-full flex-col rounded-3xl border border-line bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-card-hover">
      <div className="flex items-center justify-between">
        <span className="text-4xl font-bold leading-none text-brand/15 transition-colors duration-300 group-hover:text-brand/30">
          {item.step}
        </span>
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-brand-50 text-brand transition-all duration-300 group-hover:scale-110 group-hover:bg-brand group-hover:text-white">
          <Icon size={20} strokeWidth={1.75} />
        </span>
      </div>
      <h3 className="mt-6 text-lg font-semibold text-heading">{item.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-body">{item.description}</p>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface-muted py-20 lg:py-28">
      <div className="container-page">
        <SectionHeader
          eyebrow="How It Works"
          title="From First Call to Lasting Growth"
          description="A simple, proven process that keeps every project transparent and on track."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item, i) => (
            <Reveal key={item.step} delay={i * 120} className="h-full">
              <StepCard item={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
