import type { MapBlock } from '@/lib/service-extra'

/* A worked example of the map Jessy draws: plot the competition on two axes
   and the empty corner shows itself. The hero shows the method, not a claim. */
export default function PositionMap({ map }: { map: MapBlock }) {
  return (
    <figure className="w-full">
      <figcaption>
        <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
          {map.label}
        </span>
        <span className="mt-1 block text-[10.5px] text-white/35">{map.sample}</span>
      </figcaption>

      <div className="relative mt-4 pl-[4.25rem]">
        <span className="absolute left-0 top-0 w-[3.75rem] text-right font-mono text-[10px] leading-tight text-white/30">
          {map.yTop}
        </span>
        <span className="absolute bottom-0 left-0 w-[3.75rem] text-right font-mono text-[10px] leading-tight text-white/30">
          {map.yBottom}
        </span>
        <div className="relative aspect-square w-full rounded-[3px] border border-white/15">
        <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-white/12" />
        <span aria-hidden="true" className="absolute inset-y-0 left-1/2 w-px bg-white/12" />

        {map.points.map((pt) => (
          <div
            key={pt.name}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
          >
            <div className="flex flex-col items-center gap-2">
              {pt.goal ? (
                <span className="relative flex h-3 w-3 items-center justify-center">
                  <span className="absolute h-3 w-3 animate-[pulse-ring_2.8s_ease-out_infinite] rounded-full bg-accentlit/40" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-accentlit ring-4 ring-accentlit/20" />
                </span>
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
              )}
              <span
                className={`max-w-[9.5rem] text-center text-[11px] leading-tight ${
                  pt.goal ? 'font-extrabold text-white' : 'font-medium text-white/45'
                }`}
              >
                {pt.name}
              </span>
            </div>
          </div>
        ))}

        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-3 pl-[4.25rem] font-mono text-[10px] text-white/30">
        <span>{map.xLeft}</span>
        <span>{map.xRight}</span>
      </div>

    </figure>
  )
}
