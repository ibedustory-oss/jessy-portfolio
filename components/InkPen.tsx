'use client'

import { useEffect, useRef } from 'react'

/* The visitor can draw on the page, in the same red pen that circles the
   winning line on the strategy sheet. The stroke thins as the hand moves
   faster and dries out after about a second and a half. On load it marks
   one thing itself, so the affordance is visible without a cursor. */

type Pt = { x: number; y: number; t: number; w: number }

const LIFE = 1500
const INK = '210, 90, 65'

export default function InkPen({
  markSelector,
  className = '',
}: {
  markSelector?: string
  className?: string
}) {
  const host = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = canvas.current
    const box = host.current?.parentElement
    if (!cv || !box) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = cv.getContext('2d')
    if (!ctx) return

    let pts: Pt[] = []
    let raf = 0
    let last: { x: number; y: number; t: number } | null = null
    let dpr = 1

    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = box.getBoundingClientRect()
      cv.width = Math.round(r.width * dpr)
      cv.height = Math.round(r.height * dpr)
      cv.style.width = `${r.width}px`
      cv.style.height = `${r.height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      const now = performance.now()
      pts = pts.filter((p) => now - p.t < LIFE)
      ctx.clearRect(0, 0, cv.width, cv.height)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      /* each segment runs midpoint-to-midpoint through its own point, so the
         curve tiles into one continuous line instead of a dashed one */
      for (let i = 1; i < pts.length - 1; i++) {
        const a = pts[i - 1]
        const b = pts[i]
        const c = pts[i + 1]
        if (b.t - a.t > 120 || c.t - b.t > 120) continue
        const age = (now - b.t) / LIFE
        ctx.beginPath()
        ctx.moveTo((a.x + b.x) / 2, (a.y + b.y) / 2)
        ctx.quadraticCurveTo(b.x, b.y, (b.x + c.x) / 2, (b.y + c.y) / 2)
        ctx.strokeStyle = `rgba(${INK}, ${(1 - age) * 0.85})`
        ctx.lineWidth = b.w * (1 - age * 0.35)
        ctx.stroke()
      }
      raf = pts.length ? requestAnimationFrame(draw) : 0
    }

    const push = (x: number, y: number) => {
      const now = performance.now()
      let w = 5
      if (last) {
        const dt = Math.max(now - last.t, 1)
        const speed = Math.hypot(x - last.x, y - last.y) / dt
        w = Math.max(2.2, 6.4 - speed * 3.2)
      }
      last = { x, y, t: now }
      pts.push({ x, y, t: now, w })
      if (pts.length > 260) pts.shift()
      if (!raf) raf = requestAnimationFrame(draw)
    }

    const onMove = (e: PointerEvent) => {
      const r = box.getBoundingClientRect()
      push(e.clientX - r.left, e.clientY - r.top)
    }

    /* the page marks one thing by itself, once */
    const intro = () => {
      if (!markSelector) return
      const el = box.querySelector(markSelector)
      if (!el) return
      const r = box.getBoundingClientRect()
      const t = el.getBoundingClientRect()
      const cx = t.left - r.left + t.width / 2
      const cy = t.top - r.top + t.height / 2
      const rx = t.width / 2 + 16
      const ry = t.height / 2 + 12
      const N = 46
      let i = 0
      const tick = () => {
        if (i > N) return
        /* a hand-drawn loop: slightly past the start, never quite closed */
        const a = -2.5 + (i / N) * 7.0
        const wob = 1 + Math.sin(a * 3.1) * 0.035
        push(cx + Math.cos(a) * rx * wob, cy + Math.sin(a) * ry * wob * 1.04)
        i++
        setTimeout(tick, 12)
      }
      tick()
    }

    size()
    const t0 = setTimeout(intro, 900)
    box.addEventListener('pointermove', onMove)
    let rt: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(rt)
      rt = setTimeout(size, 200)
    }
    window.addEventListener('resize', onResize)

    return () => {
      clearTimeout(t0)
      clearTimeout(rt)
      box.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', onResize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [markSelector])

  return (
    <div ref={host} className={`pointer-events-none absolute inset-0 z-30 ${className}`} aria-hidden="true">
      <canvas ref={canvas} className="h-full w-full" />
    </div>
  )
}
