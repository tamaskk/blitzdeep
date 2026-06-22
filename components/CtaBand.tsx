import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

/** Dark, full-width call-to-action band used on the About and service pages. */
export function CtaBand({
  title,
  description,
  ctaLabel = "Let's Talk Strategy",
  ctaHref = "/#contact",
}: {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <section className="pb-20 lg:pb-28">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-4xl bg-ink px-8 py-14 text-center sm:px-12 lg:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-brand/30 blur-3xl animate-float"
            />
            <h2 className="relative mx-auto max-w-2xl font-semibold text-white text-display-sm">
              {title}
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-[15px] text-white/70">{description}</p>
            <div className="relative mt-8 flex justify-center">
              <Button href={ctaHref} size="lg">
                {ctaLabel}
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
