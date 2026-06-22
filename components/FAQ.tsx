import { Plus, Minus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { FAQS, type FaqItem } from "@/lib/content";

/**
 * Uses native <details>/<summary> so the accordion works without any client
 * JS. The +/- icons toggle via Tailwind's `open:` + `group-open:` variants.
 */
function FaqRow({ item, defaultOpen }: { item: FaqItem; defaultOpen?: boolean }) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-2xl border border-line bg-white px-5 py-4 transition-colors duration-300 hover:border-brand/40 open:border-brand/30"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium text-heading transition-colors marker:hidden group-hover:text-brand">
        {item.question}
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-heading transition-all duration-300 group-open:rotate-180 group-open:border-brand group-open:bg-brand group-open:text-white">
          <Plus size={16} className="group-open:hidden" />
          <Minus size={16} className="hidden group-open:block" />
        </span>
      </summary>
      <p className="mt-3 max-w-prose text-sm leading-relaxed text-body">{item.answer}</p>
    </details>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="py-20 lg:py-28">
      <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-16">
        <Reveal>
          <span className="eyebrow">FAQs</span>
          <h2 className="mt-4 font-semibold text-heading text-display-sm">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-body">
            Discover how our design subscription helps innovative brands grow smarter and faster.
          </p>
        </Reveal>

        <div className="flex flex-col gap-3">
          {FAQS.map((item, i) => (
            <Reveal key={i} delay={i * 80}>
              <FaqRow item={item} defaultOpen={i === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
