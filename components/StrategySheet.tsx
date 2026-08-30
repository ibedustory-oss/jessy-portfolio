/* The deliverable, drawn as the document it is: numbered rows, a maker line,
   the winning row set heavy, the risky assumption flagged. Used full-size as
   the specimen and compact as the finder's draft. */
export default function StrategySheet({
  label,
  refNo,
  meta,
  hypLabel,
  rows,
  caption,
  onDark = true,
  animateWrites = false,
}: {
  label: string
  refNo: string
  meta?: string
  hypLabel?: string
  rows: { k: string; v?: string; no?: string; key?: boolean; hyp?: boolean }[]
  caption?: string
  onDark?: boolean
  animateWrites?: boolean
}) {
  return (
    <figure className="relative w-full">
      <div
        className={`relative rounded-[3px] bg-[#FCFBF7] px-6 pb-5 pt-5 md:px-7 md:pt-6 md:pb-6 ${
          onDark
            ? 'shadow-[0_40px_80px_-24px_rgba(0,0,0,0.72)]'
            : 'shadow-[0_22px_48px_-16px_rgba(25,31,40,0.22)]'
        } ring-1 ring-black/[0.06]`}
      >
        <div className="flex items-baseline justify-between border-b-2 border-ink pb-2.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink">
            {label}
          </span>
          <span className="font-mono text-[10px] tracking-widest text-ink/40">{refNo}</span>
        </div>
        {meta && (
          <p className="mt-2 font-mono text-[8.5px] tracking-[0.08em] text-ink/45">{meta}</p>
        )}

        <dl className="mt-1">
          {rows.map((r, i) => (
            <div
              key={r.k}
              className="grid grid-cols-[1.3rem_5.9rem_minmax(0,1fr)] items-baseline gap-x-2.5 border-b border-dashed border-ink/15 py-[9px] last:border-b-0 md:gap-x-3"
            >
              <span className="font-mono text-[8.5px] tracking-[0.06em] text-ink/35">
                {r.no ?? String(i + 1).padStart(2, '0')}
              </span>
              <dt className="break-keep font-mono text-[9.5px] uppercase tracking-[0.1em] text-ink/45">
                {r.k}
              </dt>
              <dd
                key={animateWrites ? (r.v ?? 'blank') : undefined}
                className={`relative text-[12px] leading-snug text-ink ${
                  r.key ? 'font-bold' : 'font-medium'
                } ${animateWrites && r.v ? 'sheet-write' : ''}`}
              >
                {r.hyp && hypLabel && (
                  <span className="mr-1.5 font-mono text-[8.5px] font-bold uppercase tracking-[0.08em] text-accent">
                    [{hypLabel}]
                  </span>
                )}
                {r.v ?? <span className="block h-3.5" />}
                {r.key && r.v && (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 200 8"
                    preserveAspectRatio="none"
                    className="absolute -bottom-0.5 left-0 h-[5px] w-full text-accent"
                  >
                    <path
                      d="M1 5.2C34 2.6 78 1.9 121 3.1c25 .7 48 2 78 1.2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      opacity="0.55"
                    />
                  </svg>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {caption && (
        <figcaption
          className={`mt-6 pl-1 text-[12.5px] leading-relaxed ${
            onDark ? 'text-white/60' : 'text-warmgray'
          }`}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
