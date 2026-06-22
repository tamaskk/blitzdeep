import Image from "next/image";
import { cn } from "@/lib/utils";
import { PEOPLE, avatarUrl } from "@/lib/content";

/**
 * Overlapping circular avatars using real Unsplash portraits.
 * `ring` switches the divider color for light vs. dark backgrounds.
 */
export function AvatarStack({
  count = 4,
  size = "md",
  ring = "white",
  className,
}: {
  count?: number;
  size?: "sm" | "md";
  ring?: "white" | "dark";
  className?: string;
}) {
  const px = size === "sm" ? 32 : 36;
  return (
    <div className={cn("flex -space-x-2.5", className)}>
      {PEOPLE.slice(0, count).map((id, i) => (
        <Image
          key={id}
          src={avatarUrl(id, 72)}
          alt={`Customer ${i + 1}`}
          width={px}
          height={px}
          className={cn(
            "inline-block rounded-full object-cover ring-2 transition-transform duration-200 hover:-translate-y-1 hover:z-10",
            ring === "white" ? "ring-white" : "ring-ink"
          )}
        />
      ))}
    </div>
  );
}
