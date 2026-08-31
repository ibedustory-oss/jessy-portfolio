'use client'

/* Framework terms sitting inside the prose. Hovering one lifts the actual
   document out of the drawer — filled in with the work, not a blank template. */

export type ToolKey = 'map' | 'fourp' | 'canvas' | 'funnel'

export type Tool = {
  key: ToolKey
  label: string
  ref: string
  meta: string
  axisX?: [string, string]
  axisY?: [string, string]
  dots?: { n: string; x: number; y: number; me?: boolean }[]
  rows?: { k: string; v: string; me?: boolean }[]
}

const INK = '#191F28'
const ACC = '#3182F6'
const MONO = 'ui-monospace, Menlo, monospace'

function Map({ t }: { t: Tool }) {
  return (
    <svg viewBox="0 0 168 116" className="w-full">
      <line x1="84" y1="12" x2="84" y2="104" stroke={INK} strokeOpacity="0.28" strokeWidth="0.7" />
      <line x1="12" y1="58" x2="156" y2="58" stroke={INK} strokeOpacity="0.28" strokeWidth="0.7" />
      <text x="4" y="55" fontSize="5" fill={INK} fillOpacity="0.4" fontFamily={MONO}>
        {t.axisX?.[0]}
      </text>
      <text x="164" y="55" fontSize="5" textAnchor="end" fill={INK} fillOpacity="0.4" fontFamily={MONO}>
        {t.axisX?.[1]}
      </text>
      <text x="84" y="7" fontSize="5" textAnchor="middle" fill={INK} fillOpacity="0.4" fontFamily={MONO}>
        {t.axisY?.[0]}
      </text>
      <text x="84" y="113" fontSize="5" textAnchor="middle" fill={INK} fillOpacity="0.4" fontFamily={MONO}>
        {t.axisY?.[1]}
      </text>
      {t.dots?.map((d) => (
        <g key={d.n}>
          <circle cx={d.x} cy={d.y} r={d.me ? 3.4 : 2.6} fill={d.me ? ACC : INK} fillOpacity={d.me ? 1 : 0.28} />
          {d.me && (
            <circle cx={d.x} cy={d.y} r="7.5" fill="none" stroke={ACC} strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="2.4 2" />
          )}
          <text
            x={d.x}
            y={d.y + (d.me ? 15 : 10)}
            fontSize="5.4"
            textAnchor="middle"
            fill={d.me ? ACC : INK}
            fillOpacity={d.me ? 1 : 0.5}
            fontWeight={d.me ? 700 : 400}
          >
            {d.n}
          </text>
        </g>
      ))}
    </svg>
  )
}

function Quadrant({ t }: { t: Tool }) {
  const r = t.rows ?? []
  return (
    <svg viewBox="0 0 168 108" className="w-full">
      <line x1="84" y1="2" x2="84" y2="106" stroke={INK} strokeOpacity="0.28" strokeWidth="0.7" />
      <line x1="2" y1="54" x2="166" y2="54" stroke={INK} strokeOpacity="0.28" strokeWidth="0.7" />
      {r.slice(0, 4).map((row, i) => {
        const x = i % 2 === 0 ? 6 : 88
        const y = i < 2 ? 6 : 58
        return (
          <g key={row.k}>
            {row.me && <rect x={x - 4} y={y - 4} width="80" height="48" fill={ACC} fillOpacity="0.08" />}
            <text x={x} y={y + 6} fontSize="6" fontWeight="700" fill={row.me ? ACC : INK} fillOpacity={row.me ? 1 : 0.55} fontFamily={MONO}>
              {row.k}
            </text>
            <text x={x} y={y + 17} fontSize="6.2" fill={INK} fillOpacity={row.me ? 0.9 : 0.55}>
              {row.v}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function Canvas({ t }: { t: Tool }) {
  const r = t.rows ?? []
  const pos = [
    [5, 6],
    [46, 6],
    [87, 6],
    [128, 6],
    [5, 80],
    [87, 80],
  ]
  return (
    <svg viewBox="0 0 168 108" className="w-full">
      {[2, 43, 84, 125, 166].map((x) => (
        <line key={x} x1={x} y1="2" x2={x} y2="76" stroke={INK} strokeOpacity="0.22" strokeWidth="0.6" />
      ))}
      {[2, 76, 106].map((y) => (
        <line key={y} x1="2" y1={y} x2="166" y2={y} stroke={INK} strokeOpacity="0.22" strokeWidth="0.6" />
      ))}
      <line x1="2" y1="76" x2="2" y2="106" stroke={INK} strokeOpacity="0.22" strokeWidth="0.6" />
      <line x1="166" y1="76" x2="166" y2="106" stroke={INK} strokeOpacity="0.22" strokeWidth="0.6" />
      <line x1="84" y1="76" x2="84" y2="106" stroke={INK} strokeOpacity="0.22" strokeWidth="0.6" />
      {r.slice(0, 6).map((row, i) => (
        <g key={row.k}>
          {row.me && <rect x={pos[i][0] - 3} y={pos[i][1] - 4} width="40" height="70" fill={ACC} fillOpacity="0.09" />}
          <text x={pos[i][0]} y={pos[i][1] + 5} fontSize="4.8" fontWeight="700" fill={row.me ? ACC : INK} fillOpacity={row.me ? 1 : 0.5} fontFamily={MONO}>
            {row.k}
          </text>
          <text x={pos[i][0]} y={pos[i][1] + 14} fontSize="5.4" fill={INK} fillOpacity={row.me ? 0.9 : 0.5}>
            {row.v}
          </text>
        </g>
      ))}
    </svg>
  )
}

function Funnel({ t }: { t: Tool }) {
  const r = t.rows ?? []
  return (
    <svg viewBox="0 0 168 112" className="w-full">
      {r.slice(0, 4).map((row, i) => {
        const w = 148 - i * 30
        const y = 6 + i * 26
        return (
          <g key={row.k}>
            <rect x={84 - w / 2} y={y} width={w} height="20" rx="2" fill={row.me ? ACC : INK} fillOpacity={row.me ? 0.9 : 0.12 + i * 0.04} />
            <text x={84 - w / 2 + 6} y={y + 13} fontSize="6.4" fill={row.me ? '#fff' : INK} fillOpacity={row.me ? 1 : 0.72} fontWeight={row.me ? 700 : 500}>
              {row.k}
            </text>
            <text x={84 + w / 2 - 6} y={y + 13} fontSize="6" textAnchor="end" fill={row.me ? '#fff' : INK} fillOpacity={row.me ? 0.85 : 0.45} fontFamily={MONO}>
              {row.v}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function Term({ tool }: { tool: Tool }) {
  return (
    <span className="group relative inline-block align-baseline" tabIndex={0}>
      <span className="cursor-help border-b border-dashed border-accent/45 font-bold text-accent transition-colors duration-300 group-hover:border-accent">
        {tool.label}
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-3 block w-[17rem] max-w-[78vw] -translate-x-1/2 translate-y-2 scale-[0.94] rounded-[4px] bg-[#FCFBF7] p-3.5 pb-2.5 opacity-0 shadow-[0_30px_60px_-18px_rgba(0,0,0,0.55)] ring-1 ring-black/[0.08] transition-all duration-300 ease-swift group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus:translate-y-0 group-focus:scale-100 group-focus:opacity-100"
      >
        <span className="flex items-baseline justify-between border-b-2 border-ink pb-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-ink">
          <span>{tool.label}</span>
          <span className="tracking-[0.1em] text-ink/40">{tool.ref}</span>
        </span>
        <span className="mt-1.5 block font-mono text-[8px] tracking-[0.06em] text-ink/45">{tool.meta}</span>
        <span className="mt-1 block">
          {tool.key === 'map' && <Map t={tool} />}
          {tool.key === 'fourp' && <Quadrant t={tool} />}
          {tool.key === 'canvas' && <Canvas t={tool} />}
          {tool.key === 'funnel' && <Funnel t={tool} />}
        </span>
      </span>
    </span>
  )
}
