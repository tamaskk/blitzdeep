import { Button } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Stars";
import { AvatarStack } from "@/components/ui/AvatarStack";

export function Hero() {
  return (
    <section id="home" className="hero-gradient relative overflow-hidden">
      {/* Floating decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl animate-float-slow"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-10 h-80 w-80 rounded-full bg-brand/20 blur-3xl animate-float"
      />

      <div className="container-page relative flex flex-col items-center pb-24 pt-32 text-center sm:pt-36 lg:pb-28 lg:pt-40">
        {/* Social proof */}
        <div className="flex animate-fade-up flex-col items-center gap-3 [animation-delay:80ms]">
          <div className="flex items-center gap-3">
            <AvatarStack count={4} size="sm" />
            <Stars />
            <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-semibold text-white">
              4.9
            </span>
          </div>
          <p className="text-sm font-medium text-heading/70">300+ Scaled Brands</p>
        </div>

        {/* Display heading */}
        <h1 className="mt-8 max-w-3xl animate-fade-up font-semibold text-heading text-display-lg [animation-delay:180ms]">
          We Build <span className="text-brand">B2B Websites</span>
          <br className="hidden sm:block" /> That{" "}
          <span className="font-serif italic font-normal">Drive Growth</span>
        </h1>

        <p className="mt-6 max-w-md animate-fade-up text-base text-body [animation-delay:300ms]">
          Strategy. Design. Performance. Unified for measurable ROI.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex animate-fade-up flex-col items-center gap-3 [animation-delay:420ms] sm:flex-row">
          <Button href="#contact" variant="primary" size="lg">
            Let&rsquo;s Talk Strategy
          </Button>
          <Button href="#work" variant="outline" size="lg">
            See Our Work
          </Button>
        </div>
      </div>
    </section>
  );
}
