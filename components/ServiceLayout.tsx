import Image from 'next/image'
import Link from 'next/link'
import Faq from '@/components/Faq'
import Finder from '@/components/Finder'
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

function Pill({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ${
        dark ? 'bg-white/10 text-white/85' : 'bg-accent text-white'
      }`}
    >
      {children}
    </span>
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
  center,
}: {
  eyebrow: string
  title: string
  accent?: string
  note?: string
  dark?: boolean
  center?: boolean
}) {
  return (
    <Reveal>
      <div className={center ? 'text-center' : ''}>
        <Pill dark={dark}>{eyebrow}</Pill>
        <h2
          className={`mt-4 text-[26px] font-extrabold leading-[1.24] tracking-tightest md:text-[42px] ${
            dark ? 'text-white' : 'text-ink'
          }`}
        >
          {title}
          {accent && (
            <>
              <br />
              <span className={dark ? 'text-accentlit' : 'text-accent'}>{accent}</span>
            </>
          )}
        </h2>
        {note && (
          <p
            className={`mt-4 max-w-2xl text-sm leading-relaxed md:text-[15px] ${
              center ? 'mx-auto' : ''
            } ${dark ? 'text-white/60' : 'text-warmgray'}`}
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
    { id: 'finder', label: x.nav.finder },
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
        <div className="relative mx-auto max-w-5xl">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[12px] font-semibold text-white/85 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accentlit" />
              {s.badge}
            </span>
            <h1 className="mt-6 text-[32px] font-extrabold leading-[1.2] tracking-tightest text-white md:text-[58px]">
              {s.headline}
              <br />
              <span className="text-accentlit">{s.headlineAccent}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/65 md:text-base">
              {s.sub}
            </p>
          </Reveal>

          {/* the joined CTA cluster — three doors in one pill */}
          <Reveal delay={80}>
            <div className="mt-9 inline-flex flex-wrap items-center gap-1 rounded-full bg-accent p-1.5">
              <Link
                href={contact}
                className="group flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-bold text-white transition-colors duration-300 hover:bg-white/15"
              >
                {s.ctaPrimary}
                <Arrow />
              </Link>
              <a
                href="#work"
                className="group flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-bold text-white transition-colors duration-300 hover:bg-white/15"
              >
                {s.ctaSecondary}
                <Arrow />
              </a>
              <a
                href="#price"
                className="group flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-bold text-white transition-colors duration-300 hover:bg-white/15"
              >
                {s.priceTitle}
                <Arrow />
              </a>
            </div>
          </Reveal>

          {/* stat row, ruled between */}
          <Reveal delay={140}>
            <dl className="mt-14 grid grid-cols-2 gap-x-5 gap-y-8 border-t border-white/12 pt-8 md:grid-cols-4 md:gap-x-0">
              {s.stats.map((st, i) => (
                <div key={st.l} className={i ? 'md:border-l md:border-white/12 md:pl-6' : 'md:pr-6'}>
                  <dt className="text-[26px] font-extrabold tracking-tightest text-accentlit md:text-[32px]">
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
          <Head eyebrow={x.pain.eyebrow} title={x.pain.title} accent={x.pain.titleAccent} dark center />

          <Reveal className="mt-14">
            <div className="grid gap-4 md:grid-cols-2">
              {x.pain.quotes.map((q, i) => (
                <div
                  key={q}
                  className="quote-card relative rounded-[20px] bg-white p-6 md:p-7"
                  style={
                    {
                      '--tilt': `${[-1.4, 0.9, -0.6, 1.2][i % 4]}deg`,
                      animationDelay: `${i * 130}ms`,
                      marginTop: i % 2 === 1 ? '1.6rem' : undefined,
                    } as React.CSSProperties
                  }
                >
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-2 left-8 h-4 w-4 rotate-45 bg-white"
                  />
                  <p className="text-[15px] font-bold leading-[1.7] tracking-tight text-ink">
                    &ldquo;{q}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-20 text-center text-[22px] font-extrabold leading-[1.4] tracking-tightest text-white md:text-[34px]">
              {x.pain.close}
              <span className="text-accentlit">{x.pain.closeAccent}</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ WHY — what AI made cheap, what it cannot decide ============ */}
      <section className="px-5 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <Head eyebrow={s.aiwhy.eyebrow} title={s.aiwhy.title} note={s.aiwhy.lead} center />

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <Reveal>
              <div className="h-full overflow-hidden rounded-[22px] border border-line bg-paper">
                <div className="bg-surface2 py-3 text-center text-[13px] font-bold text-charcoal">
                  {s.aiwhy.canTitle}
                </div>
                <ul className="divide-y divide-line px-6">
                  {s.aiwhy.can.map((c) => (
                    <li key={c} className="py-4 text-center text-sm text-warmgray">
                      {c}
                    </li>
                  ))}
                </ul>
                <p className="border-t border-line bg-surface/60 px-6 py-4 text-center text-[12.5px] leading-relaxed text-warmgray">
                  {s.aiwhy.canNote}
                </p>
              </div>
            </Reveal>

            <Reveal delay={90}>
              <div className="h-full overflow-hidden rounded-[22px] ring-2 ring-ink">
                <div className="bg-accent py-3 text-center text-[13px] font-bold text-white">
                  {s.aiwhy.cantTitle}
                </div>
                <ul className="divide-y divide-line bg-paper px-6">
                  {s.aiwhy.cant.map((c) => (
                    <li
                      key={c}
                      className="flex items-center justify-center gap-2 py-4 text-center text-sm font-bold text-ink"
                    >
                      <Check />
                      {c}
                    </li>
                  ))}
                </ul>
                <p className="border-t border-line bg-tint px-6 py-4 text-center text-[12.5px] font-medium leading-relaxed text-accent">
                  {s.aiwhy.cantNote}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ FINDER — two choices, one recommendation ============ */}
      <section id="finder" className="scroll-mt-28 bg-tint/70 px-5 py-24 md:py-32">
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
        <div className="mx-auto max-w-6xl">
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
        <div className="mx-auto max-w-6xl">
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

      {/* ============ PROCESS — numbered, alternating fill ============ */}
      <section id="how" className="scroll-mt-28 border-y border-line bg-surface/60 px-5 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <Head eyebrow={x.eyebrows.steps} title={s.stepsTitle} center />

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {s.steps.map((st, i) => {
              const filled = i === 1 || i === 2
              return (
                <Reveal key={st.n} delay={(i % 2) * 80}>
                  <div
                    className={`relative h-full overflow-hidden rounded-[22px] p-7 md:p-8 ${
                      filled ? 'bg-ink' : 'border border-line bg-paper'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`text-[40px] font-extrabold leading-none tracking-tightest md:text-[52px] ${
                        filled ? 'text-white/20' : 'text-accent/25'
                      }`}
                    >
                      {st.n}
                    </span>
                    <h3
                      className={`mt-2 text-lg font-extrabold tracking-tight ${
                        filled ? 'text-white' : 'text-ink'
                      }`}
                    >
                      {st.title}
                    </h3>
                    <div
                      className={`mt-4 h-px w-full ${filled ? 'bg-white/20' : 'bg-line'}`}
                      aria-hidden="true"
                    />
                    <p
                      className={`mt-4 text-[13.5px] leading-relaxed ${
                        filled ? 'text-white/85' : 'text-charcoal'
                      }`}
                    >
                      {st.desc}
                    </p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ PRICE — three tiers, rising in weight ============ */}
      <section id="price" className="scroll-mt-28 px-5 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <Head eyebrow={x.eyebrows.price} title={s.priceTitle} note={s.priceSub} center />

          {/* the monitor places lead the section — that is what is actually open */}
          <Reveal className="mt-12">
            <div className="overflow-hidden rounded-[26px] bg-ink p-8 md:p-11">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white">
                  {x.monitor.eyebrow}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold tracking-wide text-white/85">
                  {x.monitor.badge}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
                <h3 className="text-[26px] font-extrabold leading-[1.24] tracking-tightest text-white md:text-[38px]">
                  {x.monitor.title}
                  <br />
                  <span className="text-accentlit">{x.monitor.titleAccent}</span>
                </h3>
                <p className="flex items-baseline gap-2">
                  <span className="text-[44px] font-extrabold tracking-tightest text-accentlit md:text-[56px]">
                    {x.monitor.price}
                  </span>
                  <span className="text-sm text-white/55">{x.monitor.unit}</span>
                </p>
              </div>

              <p className="mt-5 max-w-2xl text-[14.5px] leading-relaxed text-white/70">
                {x.monitor.lead}
              </p>

              <div className="mt-9 grid gap-8 border-t border-white/12 pt-8 md:grid-cols-3 md:gap-10">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accentlit">
                    {x.monitor.scopeLabel}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {x.monitor.scope.map((v) => (
                      <li key={v} className="flex items-start gap-2 text-[13px] text-white/85">
                        <span className="mt-1">
                          <Check className="text-accentlit" />
                        </span>
                        {v}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
                    {x.monitor.excludeLabel}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {x.monitor.excludes.map((v) => (
                      <li key={v} className="flex items-start gap-2 text-[13px] text-white/50">
                        <span aria-hidden="true" className="mt-px leading-none">
                          &times;
                        </span>
                        {v}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
                    {x.monitor.termsLabel}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {x.monitor.terms.map((v, n) => (
                      <li key={v} className="flex items-start gap-2.5 text-[13px] text-white/85">
                        <span
                          aria-hidden="true"
                          className="mt-px font-bold tabular-nums text-white/35"
                        >
                          {n + 1}
                        </span>
                        {v}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link
                  href={contact}
                  className="group inline-flex items-center gap-2 rounded-full bg-accent py-2 pl-6 pr-2 text-sm font-bold text-white transition duration-300 ease-swift hover:bg-accentlit"
                >
                  {x.monitor.cta}
                  <Arrow />
                </Link>
                <p className="text-[12.5px] text-white/45">{x.monitor.note}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={60}>
            <p className="mt-14 text-center text-[12px] font-bold uppercase tracking-[0.18em] text-warmgray">
              {x.monitor.plansNote}
            </p>
          </Reveal>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
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
                      <span className={`text-xs ${onDark ? 'text-white/60' : 'text-warmgray'}`}>
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

                    {x.planExtra.items[i]?.adds && (
                      <p
                        className={`mt-5 text-[12px] font-bold ${
                          onDark ? 'text-accentlit' : 'text-accent'
                        }`}
                      >
                        {x.planExtra.items[i]?.adds}
                      </p>
                    )}

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
            <p className="mx-auto mt-8 max-w-2xl text-center text-[12.5px] leading-relaxed text-warmgray">
              {s.priceNote}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ COMPARE ============ */}
      <section className="border-y border-line bg-surface/50 px-5 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          <Head eyebrow={x.eyebrows.compare} title={s.compareTitle} center />
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
        <div className="mx-auto max-w-3xl">
          <Head eyebrow={x.eyebrows.faq} title={s.faqTitle} center />
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
        <div className="relative mx-auto max-w-2xl text-center">
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
