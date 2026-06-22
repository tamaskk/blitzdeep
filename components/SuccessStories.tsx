import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Stars";
import { AvatarStack } from "@/components/ui/AvatarStack";
import { Reveal } from "@/components/ui/Reveal";
import { TESTIMONIALS, avatarUrl, type Testimonial } from "@/lib/content";

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <article className="flex h-full flex-col gap-3 rounded-2xl border border-line bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-card-hover">
      <div className="flex items-center gap-2">
        <Stars size={14} />
        <span className="text-xs font-medium text-body">{item.rating.toFixed(1)}</span>
      </div>
      <p className="text-sm leading-relaxed text-heading/80">&ldquo;{item.quote}&rdquo;</p>
      <div className="mt-auto flex items-center gap-3 pt-2">
        <Image
          src={avatarUrl(item.avatar, 80)}
          alt={item.name}
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-heading">{item.name}</p>
          <p className="text-xs text-body">
            {item.role}, {item.company}
          </p>
        </div>
      </div>
    </article>
  );
}

export function SuccessStories() {
  return (
    <section id="testimonials" className="bg-surface-muted py-20 lg:py-28">
      <div className="container-page">
        <SectionHeader
          eyebrow="Testimonial"
          title="Loved by Growing Brands"
          description="Discover how our work helps innovative brands grow smarter and faster."
        />

        <div className="mt-12 grid items-start gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
          {/* Dark summary card */}
          <Reveal className="lg:sticky lg:top-24">
            <div className="flex flex-col justify-between gap-10 rounded-3xl bg-ink p-7 text-white">
              <div className="flex items-start justify-between gap-4">
                <span className="text-5xl font-semibold tracking-tight">4.9/5</span>
                <p className="max-w-[150px] text-sm text-white/70">
                  We&apos;ve delivered 300+ projects that drive real results.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <AvatarStack count={4} ring="dark" />
                  <Stars />
                </div>
                <p className="mt-4 text-lg font-semibold">Trusted by 100+ Businesses</p>
                <p className="mt-1 text-sm text-white/60">
                  They hit their targets — You&apos;re next.
                </p>
                <Button variant="outline" size="lg" className="mt-5 w-full">
                  Leave a review
                </Button>
              </div>
            </div>
          </Reveal>

          {/* Testimonial grid */}
          <div className="grid gap-5 sm:grid-cols-2">
            {TESTIMONIALS.map((item, i) => (
              <Reveal key={i} delay={(i % 2) * 100} className="h-full">
                <TestimonialCard item={item} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
