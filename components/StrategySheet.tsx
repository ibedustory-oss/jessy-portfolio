/* The thing Jessy actually delivers, drawn as the object it is: one sheet,
   ruled, filled where there is something to write and blank where there
   is not. Used for her own sheet in the hero and for the draft the finder
   writes. */
export default function StrategySheet({
  label,
  refNo,
  rows,
  caption,
  onDark = true,
}: {
  label: string
  refNo: string
  rows: { k: string; v?: string }[]
  caption?: string
  onDark?: boolean
}) {
  return (
    <figure className="relative w-full">
      <div className={`relative rounded-[3px] bg-[#FCFBF7] px-7 pb-7 pt-6 ${onDark ? 'shadow-[0_34px_70px_-18px_rgba(0,0,0,0.62)]' : 'shadow-[0_22px_48px_-16px_rgba(25,31,40,0.22)]'} ring-1 ring-black/[0.06]`}>
        <div className="flex items-baseline justify-between border-b border-ink/20 pb-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55">
            {label}
          </span>
          <span className="font-mono text-[10px] tracking-widest text-ink/35">{refNo}</span>
        </div>

        <dl>
          {rows.map((r, i) => (
            <div
              key={r.k}
              className="grid grid-cols-[4.6rem_minmax(0,1fr)] items-baseline gap-3 border-b border-dashed border-ink/15 py-[11px]"
            >
              <dt className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink/40">
                {r.k}
              </dt>
              <dd className="relative text-[12.5px] font-medium leading-snug text-ink">
                {r.v ?? <span className="block h-3.5" />}
                {i === 0 && r.v && (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 200 8"
                    preserveAspectRatio="none"
                    className="absolute -bottom-1 left-0 h-[6px] w-full text-accent"
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
          className={`mt-8 pl-1 text-[12.5px] leading-relaxed ${
            onDark ? 'text-white/60' : 'text-warmgray'
          }`}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
