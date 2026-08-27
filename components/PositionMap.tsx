import type { MapBlock } from '@/lib/service-extra'

/* A worked example of the map Jessy draws: plot the competition on two axes
   and the corner none of them occupy shows itself. Drawn with rules rather
   than a panel, so it reads as a page of working, not a widget. */
export default function PositionMap({
  map,
  onDark = false,
}: {
  map: MapBlock
  onDark?: boolean
}) {
  const faint = onDark ? 'text-white/35' : 'text-warmgray'
  const rule = onDark ? 'bg-white/15' : 'bg-line'

  return (
    <figure className="w-full">
      <figcaption>
        <span
          className={`block font-mono text-[10px] uppercase tracking-[0.24em] ${
            onDark ? 'text-white/45' : 'text-warmgray'
          }`}
        >
          {map.label}
        </span>
        <span className={`mt-1.5 block text-[11px] ${faint}`}>{map.sample}</span>
      </figcaption>

      <div className="relative mt-5 pl-[4.25rem]">
        <span
          className={`absolute left-0 top-0 w-[3.75rem] text-right font-mono text-[10px] leading-tight ${faint}`}
        >
          {map.yTop}
        </span>
        <span
          className={`absolute bottom-0 left-0 w-[3.75rem] text-right font-mono text-[10px] leading-tight ${faint}`}
        >
          {map.yBottom}
        </span>

        <div
          className={`relative aspect-square w-full border-l border-b ${
            onDark ? 'border-white/25' : 'border-ink/25'
          }`}
        >
          <span aria-hidden="true" className={`absolute inset-x-0 top-1/2 h-px ${rule}`} />
          <span aria-hidden="true" className={`absolute inset-y-0 left-1/2 w-px ${rule}`} />

          {map.points.map((pt) => (
            <div
              key={pt.name}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
            >
              <div className="flex flex-col items-center gap-2">
                {pt.goal ? (
                  <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                ) : (
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      onDark ? 'bg-white/35' : 'bg-charcoal/45'
                    }`}
                  />
                )}
                <span
                  className={`max-w-[9.5rem] text-center text-[11px] leading-tight ${
                    pt.goal
                      ? onDark
                        ? 'font-extrabold text-white'
                        : 'font-extrabold text-ink'
                      : faint
                  }`}
                >
                  {pt.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`mt-3 flex items-baseline justify-between gap-3 pl-[4.25rem] font-mono text-[10px] ${faint}`}
      >
        <span>{map.xLeft}</span>
        <span>{map.xRight}</span>
      </div>
    </figure>
  )
}
