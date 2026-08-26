import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/Reveal'
import type { Lang } from '@/lib/content'
import { SERVICE } from '@/lib/service'

const BP = process.env.NEXT_PUBLIC_BASE_PATH || ''

function Check({ className = 'text-accent' }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={`h-3 w-3 ${className}`} aria-hidden="true">
      <path
        d="M2 6.2l2.6 2.6L10 3.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Head({ eyebrow, title, note }: { eyebrow: string; title: string; note?: string }) {
  return (
    <Reveal>
      <p className="text-[13px] font-bold tracking-wide text-accent">{eyebrow}</p>
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <h2 className="text-2xl font-extrabold tracking-tightest md:text-4xl">{title}</h2>
        {note && <p className="max-w-sm text-sm text-warmgray">{note}</p>}
      </div>
    </Reveal>
  )
}

/* Browser shot in a machined tray — traffic lights + address, concentric radii. */
function Shot({
  src,
  alt,
  url,
  eager,
  className = '',
}: {
  src: string
  alt: string
  url: string
  eager?: boolean
  className?: string
}) {
  return (
    <div className={`rounded-[22px] bg-surface p-1.5 ring-1 ring-ink/[0.04] ${className}`}>
      <div className="overflow-hidden rounded-[16px] bg-white">
        <div className="flex items-center gap-2 border-b border-line/70 px-3.5 py-2">
          <span className="flex gap-1" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-[#FF5F57]" />
            <span className="h-2 w-2 rounded-full bg-[#FEBC2E]" />
            <span className="h-2 w-2 rounded-full bg-[#28C840]" />
          </span>
          <span className="ml-1 flex-1 truncate rounded-md bg-surface px-2 py-0.5 text-center text-[10px] font-medium text-warmgray">
            {url}
          </span>
        </div>
        <Image
          src={src}
          alt={alt}
          width={1500}
          height={1000}
          loading={eager ? 'eager' : 'lazy'}
          className="aspect-[3/2] w-full object-cover object-top"
        />
      </div>
    </div>
  )
}

export default function ServiceLayout({ lang }: { lang: Lang }) {
  const s = SERVICE[lang]
  const contact = `/${lang}/#contact`
  const reel = [{ ...s.showroom }, ...s.demos]

  return (
    <div className="pb-10">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden px-5 pb-10 pt-20 md:pt-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(900px_420px_at_50%_-120px,#EEF4FD,transparent_70%)]"
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="inline-flex items-center gap-2.5 rounded-full bg-surface px-4 py-1.5 text-[13px] font-semibold text-charcoal">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
              {s.badge}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mx-auto mt-7 text-[2.5rem] font-extrabold leading-[1.1] tracking-tightest md:text-[4.4rem]">
              {s.headline}
              <br />
              <span className="text-accentlit">{s.headlineAccent}</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-charcoal">{s.sub}</p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={contact}
                className="rounded-full bg-accent px-7 py-3.5 text-[15px] font-semibold text-white transition-[background-color,transform] duration-200 ease-swift hover:bg-accenthover active:scale-[0.97]"
              >
                {s.ctaPrimary}
              </Link>
              <a
                href="#work"
                className="rounded-full bg-surface px-7 py-3.5 text-[15px] font-semibold text-ink transition-[background-color,transform] duration-200 ease-swift hover:bg-surface2 active:scale-[0.97]"
              >
                {s.ctaSecondary}
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={320}>
          <div className="mq mt-14 md:mt-20">
            <div className="mq-track">
              {[...reel, ...reel].map((r, i) => (
                <Shot
                  key={`${r.img}-${i}`}
                  src={`${BP}/images/${r.img}`}
                  alt={r.label}
                  url={r.url}
                  eager={i < 5}
                  className="w-[280px] shrink-0 md:w-[420px]"
                />
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============ STATS ============ */}
      <section className="px-5 pt-10 md:px-8">
        <Reveal>
          <div className="mx-auto grid max-w-5xl grid-cols-2 overflow-hidden rounded-[28px] bg-surface md:grid-cols-4">
            {s.stats.map((st, i) => (
              <div
                key={st.l}
                className={`px-6 py-8 md:px-8 ${i % 2 === 1 ? 'border-l border-white' : ''} ${
                  i > 1 ? 'border-t border-white md:border-t-0' : ''
                } ${i > 0 ? 'md:border-l md:border-white' : ''}`}
              >
                <p className="text-2xl font-extrabold tracking-tight tabular-nums md:text-3xl">
                  {st.v}
                </p>
                <p className="mt-1.5 text-[12px] leading-snug text-warmgray">{st.l}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ============ WHY (AI era) ============ */}
      <section className="px-5 pt-24 md:px-8 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="relative overflow-hidden rounded-[32px] bg-ink px-7 py-12 text-white md:px-14 md:py-16">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-28 right-0 h-[420px] w-[560px] bg-[radial-gradient(closest-side,rgba(49,130,246,0.25),transparent)]"
              />
              <div className="relative">
                <p className="text-[13px] font-bold tracking-wide text-[#8AB4FF]">{s.aiwhy.eyebrow}</p>
                <h2 className="mt-3 max-w-[24ch] text-3xl font-extrabold leading-[1.15] tracking-tightest md:text-5xl">
                  {s.aiwhy.title}
                </h2>
                <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/75 md:text-base">
                  {s.aiwhy.lead}
                </p>

                <div className="mt-10 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[24px] bg-white/[0.06] p-6 ring-1 ring-white/10 md:p-7">
                    <p className="text-[13px] font-bold tracking-wide text-white/60">{s.aiwhy.canTitle}</p>
                    <ul className="mt-4 space-y-3">
                      {s.aiwhy.can.map((c) => (
                        <li key={c} className="flex items-center gap-3 text-[15px] text-white/70">
                          <span className="h-1 w-1 shrink-0 rounded-full bg-white/40" />
                          {c}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 border-t border-white/10 pt-4 text-[13px] leading-relaxed text-white/55">
                      {s.aiwhy.canNote}
                    </p>
                  </div>
                  <div className="rounded-[24px] bg-accentlit/[0.14] p-6 ring-1 ring-accentlit/50 md:p-7">
                    <p className="text-[13px] font-bold tracking-wide text-[#8AB4FF]">{s.aiwhy.cantTitle}</p>
                    <ul className="mt-4 space-y-3">
                      {s.aiwhy.cant.map((c) => (
                        <li key={c} className="flex items-center gap-3 text-[15px] font-semibold text-white">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accentlit/30">
                            <Check className="text-white" />
                          </span>
                          {c}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 border-t border-accentlit/30 pt-4 text-[13px] font-medium leading-relaxed text-white/90">
                      {s.aiwhy.cantNote}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ WORK ============ */}
      <section id="work" className="scroll-mt-24 px-5 pt-24 md:px-8 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <Head eyebrow="Demos" title={s.workTitle} note={s.workSub} />

          <Reveal delay={80}>
            <a
              href={`${BP}/${s.showroom.href}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${s.showroom.label} (new tab)`}
              className="group mt-10 block"
            >
              <div className="relative overflow-hidden rounded-[28px] bg-ink transition-transform duration-500 ease-swift group-hover:-translate-y-1.5">
                <Image
                  src={`${BP}/images/${s.showroom.img}`}
                  alt={s.showroom.label}
                  width={1600}
                  height={1000}
                  className="aspect-[16/10] w-full object-cover object-center opacity-95 transition-[transform,opacity] duration-700 ease-swift group-hover:scale-[1.015] group-hover:opacity-100 md:aspect-[16/7]"
                />
                <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white/15 py-1.5 pl-4 pr-1.5 text-[13px] font-semibold text-white backdrop-blur-md">
                  {s.showroom.cta}
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 ease-swift group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </div>
              <div className="mt-3.5 flex items-center justify-between gap-4 px-2">
                <span className="text-[15px] font-bold tracking-tight transition-colors group-hover:text-accent">
                  {s.showroom.label}
                </span>
                <span className="rounded-full bg-surface px-3 py-1 text-[11px] font-semibold text-warmgray">
                  4 maisons
                </span>
              </div>
            </a>
          </Reveal>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {s.demos.map((d, i) => (
              <Reveal key={d.href} delay={(i % 2) * 80}>
                <a
                  href={`${BP}/${d.href}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${d.label} (new tab)`}
                  className="group block"
                >
                  <div className="transition-all duration-500 ease-swift group-hover:-translate-y-1.5">
                    <Shot src={`${BP}/images/${d.img}`} alt={d.label} url={d.url} />
                  </div>
                  <div className="mt-3.5 flex items-center justify-between gap-4 px-2">
                    <span className="text-[15px] font-bold tracking-tight transition-colors group-hover:text-accent">
                      {d.label}
                    </span>
                    <span className="rounded-full bg-surface px-3 py-1 text-[11px] font-semibold text-warmgray">
                      {d.genre}
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ INCLUDED ============ */}
      <section className="px-5 pt-24 md:px-8 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <Head eyebrow="Scope" title={s.includedTitle} note={s.includedSub} />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {s.included.map((it, i) => (
              <Reveal key={it.title} delay={(i % 3) * 70}>
                <div className="h-full rounded-[24px] bg-surface p-6 md:p-7">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-tint">
                    <Check />
                  </div>
                  <p className="mt-4 text-[16px] font-bold tracking-tight">{it.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal">{it.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ STEPS ============ */}
      <section className="px-5 pt-24 md:px-8 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <Head eyebrow="Process" title={s.stepsTitle} />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {s.steps.map((st, i) => (
              <Reveal key={st.n} delay={i * 90}>
                <div className="relative h-full overflow-hidden rounded-[24px] bg-surface p-6 md:p-7">
                  <p aria-hidden="true" className="text-4xl font-extrabold tabular-nums tracking-tight text-accentlit/25">
                    {st.n}
                  </p>
                  <p className="mt-3 text-lg font-bold tracking-tight">{st.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal">{st.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section className="px-5 pt-24 md:px-8 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <Head eyebrow="Pricing" title={s.priceTitle} note={s.priceSub} />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {s.plans.map((p, i) => (
              <Reveal key={p.name} delay={i * 80}>
                <div
                  className={`flex h-full flex-col rounded-[28px] p-7 md:p-8 ${
                    p.featured
                      ? 'bg-accent text-white shadow-blue'
                      : 'bg-white ring-1 ring-line'
                  }`}
                >
                  <p className="text-[13px] font-bold tracking-wide">{p.name}</p>
                  <p className="mt-5 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold tracking-tight tabular-nums md:text-4xl">
                      {p.price}
                    </span>
                    <span className={`text-xs ${p.featured ? 'text-white' : 'text-warmgray'}`}>
                      {p.unit}
                    </span>
                  </p>
                  <p
                    className={`mt-4 text-sm leading-relaxed ${p.featured ? 'text-white/90' : 'text-charcoal'}`}
                  >
                    {p.desc}
                  </p>
                  <ul className="mt-6 flex flex-1 flex-col gap-3">
                    {p.features.map((f) => (
                      <li
                        key={f}
                        className={`flex items-center gap-3 text-sm ${p.featured ? 'text-white/95' : 'text-charcoal'}`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                            p.featured ? 'bg-white/20' : 'bg-tint'
                          }`}
                        >
                          <Check className={p.featured ? 'text-white' : 'text-accent'} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={contact}
                    className={`mt-8 rounded-full py-3.5 text-center text-[15px] font-semibold transition-[background-color,transform] duration-200 ease-swift active:scale-[0.97] ${
                      p.featured
                        ? 'bg-white text-accent hover:bg-tint'
                        : 'bg-surface text-ink hover:bg-surface2'
                    }`}
                  >
                    {p.cta}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-5 px-2 text-xs text-warmgray">{s.priceNote}</p>
          </Reveal>
        </div>
      </section>

      {/* ============ COMPARE ============ */}
      <section className="px-5 pt-24 md:px-8 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <Head eyebrow="Compare" title={s.compareTitle} />
          <Reveal delay={80}>
            <div className="mt-10 overflow-x-auto rounded-[24px] ring-1 ring-line">
              <table className="w-full min-w-[680px] border-collapse text-left">
                <thead>
                  <tr className="bg-surface">
                    <th scope="col" className="w-[22%] px-6 py-4">
                      <span className="sr-only">{s.compareTitle}</span>
                    </th>
                    {s.compareCols.map((c, i) => (
                      <th
                        key={c}
                        scope="col"
                        className={`px-5 py-4 text-[13px] font-bold ${
                          i === 0 ? 'text-accent' : 'text-warmgray'
                        }`}
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s.compareRows.map((r, ri) => (
                    <tr key={r.label} className={ri > 0 ? 'border-t border-line' : 'border-t border-line'}>
                      <th
                        scope="row"
                        className="px-6 py-4 text-left text-sm font-medium text-warmgray"
                      >
                        {r.label}
                      </th>
                      {r.values.map((v, i) => (
                        <td
                          key={i}
                          className={`px-5 py-4 text-sm ${
                            i === 0 ? 'bg-tint/60 font-semibold text-ink' : 'text-charcoal'
                          }`}
                        >
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="px-5 pt-24 md:px-8 md:pt-36">
        <div className="mx-auto max-w-3xl">
          <Head eyebrow="FAQ" title={s.faqTitle} />
          <div className="mt-8 space-y-3">
            {s.faq.map((f, i) => (
              <Reveal key={f.q} delay={i * 50}>
                <details className="group rounded-2xl bg-surface px-6 transition-colors open:bg-surface">
                  <summary className="flex cursor-pointer list-none items-center gap-4 py-5 text-[15px] font-semibold tracking-tight marker:hidden [&::-webkit-details-marker]:hidden">
                    <span className="flex-1">{f.q}</span>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-base font-medium text-charcoal transition-transform duration-300 ease-swift group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="pb-6 pr-11 text-sm leading-relaxed text-charcoal">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL ============ */}
      <section className="px-5 pt-24 md:px-8 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="relative overflow-hidden rounded-[32px] bg-accent px-7 py-16 text-white md:px-16 md:py-24">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 right-0 h-[380px] w-[520px] bg-[radial-gradient(closest-side,rgba(255,255,255,0.16),transparent)]"
              />
              <div className="relative grid items-end gap-10 md:grid-cols-12">
                <div className="md:col-span-7">
                  <h2 className="text-3xl font-extrabold leading-[1.14] tracking-tightest md:text-5xl">
                    {s.finalTitle}
                  </h2>
                  <p className="mt-5 max-w-md text-sm leading-relaxed text-white/95 md:text-base">
                    {s.finalSub}
                  </p>
                </div>
                <div className="md:col-span-5 md:text-right">
                  <Link
                    href={contact}
                    className="inline-flex items-center gap-3 rounded-full bg-white py-2.5 pl-7 pr-2.5 text-[15px] font-semibold text-accent transition-transform duration-200 ease-swift hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {s.finalCta}
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-tint">
                      →
                    </span>
                  </Link>
                  <p className="mt-4 text-xs text-white/95">{s.finalNote}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
