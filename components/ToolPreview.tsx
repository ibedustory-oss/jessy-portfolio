'use client'

/* Hoverable framework terms: the name sits in the text, the document pops
   above it — the link-preview pattern, used for 4P / positioning / canvas / funnel. */

type ToolKey = 'map' | 'fourp' | 'canvas' | 'funnel'

const INK = '#191F28'
const ACC = '#3182F6'

function Diagram({ k }: { k: ToolKey }) {
  if (k === 'map')
    return (
      <svg viewBox="0 0 150 100" className="w-full">
        <line x1="75" y1="6" x2="75" y2="94" stroke={INK} strokeOpacity="0.25" strokeWidth="0.8" />
        <line x1="6" y1="50" x2="144" y2="50" stroke={INK} strokeOpacity="0.25" strokeWidth="0.8" />
        {[[34, 30], [52, 68], [96, 26], [112, 62], [58, 22], [88, 78]].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" fill={INK} fillOpacity="0.22" />
        ))}
        <circle cx="118" cy="36" r="3.6" fill={ACC} />
        <circle cx="118" cy="36" r="7.5" fill="none" stroke={ACC} strokeWidth="1" strokeOpacity="0.5" strokeDasharray="2.5 2" />
      </svg>
    )
  if (k === 'fourp')
    return (
      <svg viewBox="0 0 150 100" className="w-full">
        <line x1="75" y1="4" x2="75" y2="96" stroke={INK} strokeOpacity="0.3" strokeWidth="0.8" />
        <line x1="8" y1="50" x2="142" y2="50" stroke={INK} strokeOpacity="0.3" strokeWidth="0.8" />
        <rect x="76.5" y="5" width="64" height="43.5" fill={ACC} fillOpacity="0.08" />
        {[[38, 30], [113, 30], [38, 79], [113, 79]].map(([x, y], i) => (
          <text key={i} x={x} y={y} textAnchor="middle" fontSize="17" fontFamily="ui-monospace, Menlo, monospace" fontWeight="700" fill={i === 1 ? ACC : INK} fillOpacity={i === 1 ? 1 : 0.4}>
            P
          </text>
        ))}
      </svg>
    )
  if (k === 'canvas')
    return (
      <svg viewBox="0 0 150 100" className="w-full">
        {[0.5, 30, 60, 90, 120, 149.5].map((x) => (
          <line key={x} x1={x} y1="0.5" x2={x} y2="66" stroke={INK} strokeOpacity="0.25" strokeWidth="0.7" />
        ))}
        {[0.5, 66, 99.5].map((y) => (
          <line key={y} x1="0.5" y1={y} x2="149.5" y2={y} stroke={INK} strokeOpacity="0.25" strokeWidth="0.7" />
        ))}
        <line x1="0.5" y1="66" x2="0.5" y2="99.5" stroke={INK} strokeOpacity="0.25" strokeWidth="0.7" />
        <line x1="149.5" y1="66" x2="149.5" y2="99.5" stroke={INK} strokeOpacity="0.25" strokeWidth="0.7" />
        <line x1="75" y1="66" x2="75" y2="99.5" stroke={INK} strokeOpacity="0.25" strokeWidth="0.7" />
        <rect x="60.7" y="1" width="28.6" height="64.5" fill={ACC} fillOpacity="0.1" />
        {[[3, 8], [33, 8], [93, 8], [123, 8], [8, 74], [83, 74]].map(([x, y], i) => (
          <g key={i}>
            <rect x={x} y={y} width="20" height="2.5" rx="1" fill={INK} fillOpacity="0.18" />
            <rect x={x} y={y + 6} width="14" height="2.5" rx="1" fill={INK} fillOpacity="0.18" />
          </g>
        ))}
        {[8, 14, 20].map((y, i) => (
          <rect key={i} x="64" y={y} width={i === 1 ? 21 : 16} height="2.5" rx="1" fill={ACC} fillOpacity="0.55" />
        ))}
      </svg>
    )
  return (
    <svg viewBox="0 0 150 100" className="w-full">
      {[[15, 8, 120], [30, 26, 90], [45, 44, 60], [58, 62, 34]].map(([x, y, w], i) => (
        <rect key={i} x={75 - w / 2} y={y} width={w} height="12" rx="1.5" fill={i === 3 ? ACC : INK} fillOpacity={i === 3 ? 0.9 : 0.16 + i * 0.05} />
      ))}
      <path d="M75 80 L75 92 M70 87 L75 93 L80 87" fill="none" stroke={ACC} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export default function ToolPreview({
  title,
  items,
  onDark = false,
}: {
  title: string
  items: { key: ToolKey; label: string }[]
  onDark?: boolean
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 overflow-x-clip">
      <span
        className={`font-mono text-[10px] uppercase tracking-[0.2em] ${
          onDark ? 'text-white/40' : 'text-warmgray'
        }`}
      >
        {title}
      </span>
      {items.map((it) => (
        <span key={it.key} className="group relative inline-block" tabIndex={0}>
          <span
            className={`cursor-help border-b border-dashed text-[13px] font-medium transition-colors duration-300 ${
              onDark
                ? 'border-white/30 text-white/70 group-hover:border-white/70 group-hover:text-white'
                : 'border-ink/30 text-ink/70 group-hover:border-ink/70 group-hover:text-ink'
            }`}
          >
            {it.label}
          </span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-full left-1/2 z-30 mt-2.5 block w-48 -translate-x-1/2 -translate-y-1.5 scale-[0.92] rounded-[4px] bg-[#FCFBF7] p-3 pb-2 opacity-0 shadow-[0_24px_50px_-16px_rgba(0,0,0,0.5)] ring-1 ring-black/[0.08] transition-all duration-300 ease-swift group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus:translate-y-0 group-focus:scale-100 group-focus:opacity-100"
          >
            <Diagram k={it.key} />
            <span className="mt-1.5 block border-t border-ink/15 pt-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-ink/45">
              {it.label}
            </span>
          </span>
        </span>
      ))}
    </div>
  )
}
