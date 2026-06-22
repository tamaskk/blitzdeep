import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { WORKS, PARTNERS, imageUrl, type Work } from "@/lib/content";

function WorkCard({ work }: { work: Work }) {
  return (
    <a
      href="#"
      className="group relative block overflow-hidden rounded-3xl shadow-card transition-shadow duration-300 hover:shadow-card-hover"
    >
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={imageUrl(work.image, 760, 570)}
          alt={`${work.title} — ${work.subtitle}`}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
        />
        {/* readability gradient at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Caption overlay — sits outside the scaling image so it stays crisp */}
      <div
        className={cn(
          "absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 transition-all duration-300",
          work.featured
            ? "opacity-100"
            : "translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
        )}
      >
        <div className="rounded-2xl bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
          <p className="text-sm font-semibold text-heading">{work.title}</p>
          <p className="text-xs text-body">{work.subtitle}</p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-btn transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-45">
          <ArrowUpRight size={20} />
        </span>
      </div>
    </a>
  );
}

export function FeaturedWork() {
  return (
    <section id="reference" className="py-20 lg:py-28">
      <div className="container-page">
        <SectionHeader
          eyebrow="Reference"
          title="Featured Work"
          description="A look at some of the brands we've helped and the outcomes we've delivered."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {WORKS.map((work, i) => (
            <Reveal key={work.title} delay={(i % 2) * 120}>
              <WorkCard work={work} />
            </Reveal>
          ))}
        </div>

        {/* Partner logos — infinite marquee, pauses on hover */}
        <Reveal className="mt-16">
          <div className="flex items-center gap-6">
            <span className="hidden shrink-0 text-sm font-medium text-body sm:block">
              Worked With:
            </span>
            <div className="marquee-mask relative w-full overflow-hidden">
              <div className="flex w-max items-center animate-marquee hover:[animation-play-state:paused]">
                {/* Track is two identical copies; the duplicate is hidden from
                    screen readers so the partner list isn't announced twice. */}
                {[0, 1].map((copy) => (
                  <ul
                    key={copy}
                    aria-hidden={copy === 1}
                    className="flex shrink-0 items-center gap-12 pr-12"
                  >
                    {PARTNERS.map((name) => (
                      <li
                        key={name}
                        className="whitespace-nowrap text-base font-semibold text-heading/40 transition-colors hover:text-heading/80"
                      >
                        {name}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
