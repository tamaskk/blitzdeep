import { cn } from "@/lib/utils";

/**
 * Visual stand-in for imagery that isn't available as a real asset.
 * Swap these for <Image> once the production photos/mockups exist —
 * the wrapper keeps the aspect ratio and rounding identical.
 *
 * NOTE: The reference uses photographic device mockups here; these tinted
 * blocks reproduce the layout rhythm and aspect ratios, not the artwork.
 */
export function Placeholder({
  className,
  rounded = "rounded-2xl",
  label,
  children,
}: {
  className?: string;
  rounded?: string;
  label?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-ink-700 to-ink",
        rounded,
        className
      )}
      aria-hidden={!label}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      {/* subtle grid texture so the block doesn't read as flat color */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:22px_22px]" />
      {children}
    </div>
  );
}
