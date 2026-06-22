import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

type Action = { label: string; href: string };

/**
 * The recurring "eyebrow + big heading on the left, supporting copy
 * (and an optional CTA) on the right" block used by most sections.
 * Wrapped in a Reveal so headings animate in on scroll.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  action?: Action;
}) {
  return (
    <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-xl">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="mt-4 font-semibold text-heading text-display-sm">{title}</h2>
      </div>

      {(description || action) && (
        <div className="flex max-w-sm flex-col items-start gap-5 md:items-end">
          {description && (
            <p className="text-[15px] leading-relaxed text-body md:text-right">{description}</p>
          )}
          {action && (
            <Button href={action.href} variant="primary">
              {action.label}
            </Button>
          )}
        </div>
      )}
    </Reveal>
  );
}
