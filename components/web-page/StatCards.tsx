/** The two small cards in the hero's bottom-right corner. */
export function StatCards() {
  const card =
    "flex h-[150px] w-[190px] shrink-0 flex-col justify-between rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:brightness-110";

  return (
    <div className="flex gap-3">
      <div className={`${card} bg-white text-black`}>
        <div>
          <span aria-hidden className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-black" />
            <span className="h-1.5 w-1.5 rounded-full bg-black/50" />
            <span className="h-1.5 w-1.5 rounded-full bg-black/25" />
          </span>
          <p className="mt-2.5 text-[13px] font-semibold leading-tight">
            Conversion-first
            <br />
            design
          </p>
        </div>
        <div>
          <p className="text-4xl font-bold leading-none tracking-[-0.03em]">98%</p>
          <p className="mt-1 text-[11px] text-black/60">Client retention</p>
        </div>
      </div>

      <div
        className={`${card} hidden border border-white/10 bg-[rgba(70,55,20,0.55)] text-white backdrop-blur-md sm:flex`}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-[13px] font-semibold leading-tight">
            Modern, fast
            <br />
            stack
          </p>
          <span
            aria-hidden
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white text-xs font-bold text-black"
          >
            !
          </span>
        </div>
        <p className="text-[11px] leading-snug text-white/80">
          Next.js or Webflow with a headless CMS. Instant loads, effortless editing.
        </p>
      </div>
    </div>
  );
}
