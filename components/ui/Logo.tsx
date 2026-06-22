import { cn } from "@/lib/utils";

/**
 * BlitzDeep wordmark with the trailing ">" accent.
 * `tone` switches between the light (header) and dark (footer) backgrounds.
 */
export function Logo({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-2xl font-extrabold tracking-tight",
        tone === "dark" ? "text-heading" : "text-white",
        className
      )}
    >
      BlitzDeep
      <span className="text-brand">&gt;</span>
    </span>
  );
}
