import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({
  count = 5,
  className,
  size = 16,
}: {
  count?: number;
  className?: string;
  size?: number;
}) {
  return (
    <div className={cn("flex items-center gap-0.5 text-brand", className)} aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={size} className="fill-current" strokeWidth={0} />
      ))}
    </div>
  );
}
