import Image from 'next/image'
import Link from 'next/link'
import Faq from '@/components/Faq'
import Finder from '@/components/Finder'
import PositionMap from '@/components/PositionMap'
import Reveal from '@/components/Reveal'
import SectionNav from '@/components/SectionNav'
import StickyEdge from '@/components/StickyEdge'
import type { Lang } from '@/lib/content'
import { SERVICE } from '@/lib/service'
import { EXTRA } from '@/lib/service-extra'

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


/* The section headings run two-tone: the sentence in the base colour, the
   phrase that carries the point in accent. */
function Head({
  eyebrow,
  title,
  accent,
  note,
  dark,
}: {
  eyebrow: string
  title: string
  accent?: string
  note?: string
  dark?: boolean
}) {
  return (
    <Reveal>
      <div>
        <p
          className={`text-[11px] font-bold uppercase tracking-[0.24em] ${
            dark ? 'text-white/45' : 'text-warmgray'
          }`}
        >
          {eyebrow}
        </p>
        <h2
          className={`mt-5 text-[26px] font-extrabold leading-[1.24] tracking-tightest md:text-[42px] ${
            dark ? 'text-white' : 'text-ink'
          }`}
        >
          {title}
          {accent && (
            <>
              <br />
              {accent}
            </>
          )}
        </h2>
        {note && (
          <p
            className={`mt-4 max-w-2xl text-sm leading-relaxed md:text-[15px] ${
              dark ? 'text-white/60' : 'text-warmgray'
            }`}
          >
            {note}
          </p>
        )}
      </div>
    </Reveal>
  )
}

/* Browser shot in a machined tray — traffic lights + address, concentric radii. */
function Shot({ src, alt, url }: { src: string; alt: string; url: string }) {
  return (
    <div className="rounded-[22px] bg-surface p-1.5 ring-1 ring-ink/[0.04]">
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
          loading="lazy"
          className="aspect-[3/2] w-full object-cover object-top"
        />
      </div>
    </div>
  )
}

function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-[11px] transition-transform duration-300 ease-swift group-hover:translate-x-0.5"
    >
      →
    </span>
  )
}

export default function ServiceLayout({ lang }: { lang: Lang }) {
  const s = SERVICE[lang]
  const x = EXTRA[lang]
  const contact = `/${lang}/#contact`

  const navItems = [
    { id: 'why', label: x.nav.why },
    { id: 'sheet', label: x.nav.finder },
    { id: 'work', label: x.nav.work },
    { id: 'how', label: x.nav.how },
    { id: 'price', label: x.nav.price },
    { id: 'faq', label: x.nav.faq },
  ]

  return (
    <div>
      {/* ============ HERO — one dark screen, one message ============ */}
      <section className="relative overflow-hidden bg-ink px-5 pb-16 pt-20 md:pb-24 md:pt-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_460px_at_16%_-14%,rgba(49,130,246,0.13),transparent_66%)]"
        />
        <div className="relative mx-auto grid max-w-6xl gap-14 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:items-center md:gap-14">
          <div>
          <Reveal>
            <p className="flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/50">
              <span className="h-px w-7 bg-white/35" aria-hidden="true" />
              {s.badge}
            </p>
            <h1 className="mt-6 break-keep text-[26px] font-extrabold leading-[1.26] tracking-tightest text-white md:text-[52px]">
              {s.headline}
              <br />
              {s.headlineAccent}
            </h1>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/65 md:text-base">
              {s.sub}
            </p>
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href={contact}
                className="rounded-full bg-white px-7 py-3 text-[13px] font-bold text-ink transition duration-300 ease-swift hover:bg-white/90"
              >
                {s.ctaPrimary}
              </Link>
              <a
                href="#work"
                className="group inline-flex items-center gap-1.5 text-[13px] font-bold text-white/65 transition-colors duration-300 hover:text-white"
              >
                {s.ctaSecondary}
                <span aria-hidden="true" className="transition-transform duration-300 ease-swift group-hover:translate-x-0.5">
                  →
                </span>
              </a>
              <a
                href="#price"
                className="group inline-flex items-center gap-1.5 text-[13px] font-bold text-white/65 transition-colors duration-300 hover:text-white"
              >
                {s.priceTitle}
                <span aria-hidden="true" className="transition-transform duration-300 ease-swift group-hover:translate-x-0.5">
                  →
                </span>
              </a>
            </div>
          </Reveal>

          </div>

          <Reveal delay={120}>
            <PositionMap map={x.map} />
          </Reveal>
        </div>

        <div className="relative mx-auto mt-16 max-w-6xl md:mt-20">
          <Reveal delay={140}>
            <dl className="grid grid-cols-2 gap-x-5 gap-y-8 border-t border-white/12 pt-8 md:grid-cols-4 md:gap-x-0">
              {s.stats.map((st, i) => (
                <div key={st.l} className={i ? 'md:border-l md:border-white/12 md:pl-6' : 'md:pr-6'}>
                  <dt className="text-[26px] font-extrabold tracking-tightest text-white md:text-[32px]">
                    {st.v}
                  </dt>
                  <dd className="mt-1.5 max-w-[22ch] text-[12.5px] leading-snug text-white/55">
                    {st.l}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <SectionNav items={navItems} />

      {/* ============ PAIN — the reader's own words, on black ============ */}
      <section id="why" className="scroll-mt-28 bg-ink px-5 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <Head eyebrow={x.pain.eyebrow} title={x.pain.title} accent={x.pain.titleAccent} dark />

          <Reveal className="mt-14">
            <ul className="max-w-[36rem] space-y-3.5">
              {x.pain.quotes.map((q, i) => (
                <li key={q}>
                  <p
                    className="msg-in inline-block rounded-2xl rounded-tl-sm bg-[#F7F5F0] px-5 py-4 text-[15px] leading-[1.68] text-ink shadow-[0_10px_24px_-14px_rgba(0,0,0,0.7)] md:px-6 md:py-[18px] md:text-[16px]"
                    style={{ animationDelay: `${i * 220}ms` }}
                  >
                    {q}
                  </p>
                </li>
              ))}
              <li>
                <span
                  className="msg-in typing inline-flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-[#F7F5F0]/80 px-5 py-4"
                  style={{ animationDelay: `${x.pain.quotes.length * 220}ms` }}
                  aria-hidden="true"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-ink/45" />
                  <span className="h-1.5 w-1.5 rounded-full bg-ink/45 [animation-delay:0.18s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-ink/45 [animation-delay:0.36s]" />
                </span>
              </li>
            </ul>
          </Reveal>

          <Reveal>
            <p className="mt-24 md:mt-28">
              <span className="relative inline-block text-[24px] font-extrabold leading-[1.36] tracking-tightest text-white md:text-[40px]">
                {x.pain.close}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 340 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-3 left-0 h-[10px] w-full text-accentlit md:-bottom-4 md:h-3"
                >
                  <path
                    className="draw"
                    d="M3 8.6C62 4.2 142 2.8 208 4.8c38 1.1 76 2.9 129 1.6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeDasharray="340"
                  />
                </svg>
              </span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ WHY — what AI made cheap, what it cannot decide ============ */}
      <section className="px-5 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <Head eyebrow={s.aiwhy.eyebrow} title={s.aiwhy.title} note={s.aiwhy.lead} />

          <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
            <Reveal>
              <div className="border-t border-line pt-6">
                <p className="text-[13px] font-bold text-warmgray">{s.aiwhy.canTitle}</p>
                <ul className="mt-5 space-y-3">
                  {s.aiwhy.can.map((c) => (
                    <li key={c} className="text-sm text-warmgray">
                      {c}
                    </li>
                  ))}
                </ul>
                <p className="mt-7 text-[12.5px] leading-relaxed text-warmgray">
                  {s.aiwhy.canNote}
                </p>
              </div>
            </Reveal>

            <Reveal delay={90}>
              <div className="border-t-2 border-ink pt-6">
                <p className="text-[13px] font-extrabold text-ink">{s.aiwhy.cantTitle}</p>
                <ul className="mt-5 space-y-3">
                  {s.aiwhy.cant.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm font-bold text-ink">
                      <span className="mt-1.5">
                        <Check />
                      </span>
                      {c}
                    </li>
                  ))}
                </ul>
                <p className="mt-7 text-[12.5px] font-medium leading-relaxed text-accent">
                  {s.aiwhy.cantNote}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ FINDER — two choices, one recommendation ============ */}
      <section id="sheet" className="scroll-mt-28 bg-tint/70 px-5 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <Head
            eyebrow={x.finder.eyebrow}
            title={x.finder.title}
            accent={x.finder.titleAccent}
            note={x.finder.lead}
          />
          <Reveal className="mt-12">
            <Finder block={x.finder} contact={contact} />
          </Reveal>
        </div>
      </section>

      {/* ============ WORK ============ */}
      <section id="work" className="scroll-mt-28 px-5 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <Head eyebrow={x.eyebrows.work} title={s.workTitle} note={s.workSub} />

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
                  <Arrow />
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

      {/* ============ SCOPE — heading pinned, the work scrolls past ============ */}
      <section className="border-y border-line bg-surface/50 px-5 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <StickyEdge
            eyebrow={x.eyebrows.included}
            heading={s.includedTitle}
            items={s.included.map((it, i) => ({
              title: it.title,
              body: it.desc,
              proof: String(i + 1).padStart(2, '0'),
            }))}
          />
        </div>
      </section>

      {/* ============ PROCESS — a numbered index, one step per row ============ */}
      <section id="how" className="scroll-mt-28 border-y border-line bg-surface/60 px-5 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <Head eyebrow={x.eyebrows.steps} title={s.stepsTitle} />

          <ol className="mt-12 border-t border-line">
            {s.steps.map((st) => (
              <li key={st.n} className="border-b border-line">
                <Reveal>
                  <div className="grid gap-x-8 gap-y-2 py-8 md:grid-cols-[3rem_minmax(0,12rem)_minmax(0,1fr)] md:items-baseline md:py-9">
                    <span className="text-[12px] font-bold tabular-nums tracking-widest text-accent">
                      {st.n}
                    </span>
                    <h3 className="text-[17px] font-extrabold tracking-tight text-ink">
                      {st.title}
                    </h3>
                    <p className="text-[13.5px] leading-relaxed text-charcoal">{st.desc}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ PRICE ============ */}
      <section id="price" className="scroll-mt-28 px-5 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <Head eyebrow={x.eyebrows.price} title={s.priceTitle} note={s.priceSub} />

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {s.plans.map((p, i) => {
              const tone = p.featured ? 'ink' : 'paper'
              const onDark = tone === 'ink'
              return (
                <Reveal key={p.name} delay={i * 80}>
                  <div
                    className={`flex h-full flex-col rounded-[22px] p-7 md:p-8 ${
                      tone === 'ink' ? 'bg-ink' : 'border border-line bg-paper'
                    }`}
                  >
                    <h3
                      className={`text-[15px] font-extrabold tracking-tight ${
                        onDark ? 'text-white' : 'text-ink'
                      }`}
                    >
                      {p.name}
                    </h3>
                    <p className="mt-4 flex items-baseline gap-1.5">
                      <span
                        className={`text-[28px] font-extrabold tracking-tightest md:text-[32px] ${
                          onDark ? 'text-accentlit' : 'text-ink'
                        }`}
                      >
                        {p.price}
                      </span>
                      <span
                        className={`break-keep text-xs ${
                          onDark ? 'text-white/60' : 'text-warmgray'
                        }`}
                      >
                        {p.unit}
                      </span>
                    </p>
                    <p
                      className={`mt-3 text-[13px] leading-relaxed ${
                        onDark ? 'text-white/75' : 'text-charcoal'
                      }`}
                    >
                      {p.desc}
                    </p>

                    <p
                      className={`mt-5 rounded-2xl px-4 py-3 text-[12.5px] leading-relaxed ${
                        onDark ? 'bg-white/[0.07] text-white/80' : 'bg-surface text-charcoal'
                      }`}
                    >
                      <span
                        className={`mr-1.5 font-bold ${onDark ? 'text-accentlit' : 'text-accent'}`}
                      >
                        {x.planExtra.bestLabel}
                      </span>
                      {x.planExtra.items[i]?.best}
                    </p>


                    <ul
                      className={`mt-4 space-y-2.5 border-t pt-5 ${
                        onDark ? 'border-white/15' : 'border-line'
                      }`}
                    >
                      {p.features.map((f) => (
                        <li
                          key={f}
                          className={`flex items-start gap-2 text-[13px] ${
                            onDark ? 'text-white/85' : 'text-charcoal'
                          }`}
                        >
                          <span className="mt-1">
                            <Check className={onDark ? 'text-accentlit' : 'text-accent'} />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    {(x.planExtra.items[i]?.excludes.length ?? 0) > 0 && (
                      <div
                        className={`mb-7 mt-5 border-t pt-5 ${onDark ? 'border-white/15' : 'border-line'}`}
                      >
                        <p
                          className={`text-[11px] font-bold uppercase tracking-[0.16em] ${
                            onDark ? 'text-white/45' : 'text-warmgray'
                          }`}
                        >
                          {x.planExtra.excludeLabel}
                        </p>
                        <ul className="mt-2 space-y-1.5">
                          {x.planExtra.items[i]?.excludes.map((e) => (
                            <li
                              key={e}
                              className={`flex items-start gap-2 text-[12.5px] ${
                                onDark ? 'text-white/50' : 'text-warmgray'
                              }`}
                            >
                              <span aria-hidden="true" className="mt-px leading-none">
                                &times;
                              </span>
                              {e}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Link
                      href={contact}
                      className={`mt-auto block rounded-full py-3 text-center text-[13px] font-bold transition duration-300 ease-swift ${
                        tone === 'ink'
                          ? 'bg-accent text-white hover:bg-accentlit'
                          : 'border border-line bg-paper text-ink hover:border-ink'
                      }`}
                    >
                      {p.cta}
                    </Link>
                  </div>
                </Reveal>
              )
            })}
          </div>

          <Reveal delay={120}>
            <p className="mt-8 max-w-2xl text-[12.5px] leading-relaxed text-warmgray">
              {s.priceNote}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ COMPARE ============ */}
      <section className="border-y border-line bg-surface/50 px-5 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <Head eyebrow={x.eyebrows.compare} title={s.compareTitle} />
          <Reveal className="mt-12">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <thead>
                  <tr>
                    <th className="w-[22%] pb-4" />
                    {s.compareCols.map((c, i) => (
                      <th
                        key={c}
                        className={`pb-4 text-[13px] font-extrabold ${
                          i === 0 ? 'text-accent' : 'text-warmgray'
                        }`}
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s.compareRows.map((r) => (
                    <tr key={r.label} className="border-t border-line align-top">
                      <th className="py-4 pr-4 text-[12.5px] font-bold text-warmgray">{r.label}</th>
                      {r.values.map((v, i) => (
                        <td
                          key={`${r.label}-${i}`}
                          className={`py-4 pr-4 text-[13px] leading-relaxed ${
                            i === 0 ? 'font-bold text-ink' : 'text-warmgray'
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
      <section id="faq" className="scroll-mt-28 px-5 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <Head eyebrow={x.eyebrows.faq} title={s.faqTitle} />
          <Reveal className="mt-12">
            <Faq items={s.faq} />
          </Reveal>
        </div>
      </section>

      {/* ============ FINAL ============ */}
      <section className="relative overflow-hidden bg-ink px-5 py-24 md:py-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(49,130,246,0.18),transparent_62%)] blur-2xl"
        />
        <div className="relative mx-auto max-w-5xl">
          <Reveal>
            <h2 className="text-[28px] font-extrabold leading-[1.28] tracking-tightest text-white md:text-[42px]">
              {s.finalTitle}
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-white/65">{s.finalSub}</p>
            <Link
              href={contact}
              className="group mt-9 inline-flex items-center gap-2 rounded-full bg-accent py-2 pl-6 pr-2 text-sm font-bold text-white transition duration-300 ease-swift hover:bg-accenthover"
            >
              {s.finalCta}
              <Arrow />
            </Link>
            <p className="mt-5 text-[12.5px] text-white/45">{s.finalNote}</p>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
