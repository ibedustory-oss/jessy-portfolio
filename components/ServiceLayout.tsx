import Image from 'next/image'
import Link from 'next/link'
import Faq from '@/components/Faq'
import Finder from '@/components/Finder'
import PositionMap from '@/components/PositionMap'
import Reveal from '@/components/Reveal'
import StrategySheet from '@/components/StrategySheet'
import { Term } from '@/components/ToolPreview'
import type { Lang } from '@/lib/content'
import { SERVICE } from '@/lib/service'
import { EXTRA } from '@/lib/service-extra'

const BP = process.env.NEXT_PUBLIC_BASE_PATH || ''

/* ---------- primitives ---------- */

function Label({
  n,
  children,
  dark,
}: {
  n: string
  children: React.ReactNode
  dark?: boolean
}) {
  return (
    <div>
      <p
        className={`font-mono text-[10px] uppercase tracking-[0.28em] ${
          dark ? 'text-white/40' : 'text-warmgray'
        }`}
      >
        <span className={dark ? 'text-pen/80' : 'text-pen'}>{n}</span>
        <span className="px-2.5">/</span>
        {children}
      </p>
    </div>
  )
}

/* the one action on this page, everywhere the same: a pill with the arrow
   seated in its own ring — it presses, and the ring leans forward */
function Button({ href, children, ghost }: { href: string; children: React.ReactNode; ghost?: boolean }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 rounded-full py-2 pl-6 pr-2 text-[14px] font-bold transition-all duration-500 ease-swift active:scale-[0.98] ${
        ghost
          ? 'border border-white/25 text-white hover:border-white/60'
          : 'bg-accent text-white shadow-[0_10px_30px_-10px_rgba(27,100,218,0.7)] hover:bg-accentlit'
      }`}
    >
      {children}
      <span
        aria-hidden="true"
        className={`flex h-8 w-8 items-center justify-center rounded-full text-[13px] transition-transform duration-500 ease-swift group-hover:-translate-y-px group-hover:translate-x-0.5 ${
          ghost ? 'bg-white/10' : 'bg-white/20'
        }`}
      >
        →
      </span>
    </Link>
  )
}

/* a sheet of paper laid on the desk: warm ground, grain, one deep shadow */
function Paper({
  id,
  children,
  className = '',
}: {
  id?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      id={id}
      className={`paper-grain relative mx-2 scroll-mt-20 rounded-[24px] bg-[#FBFAF6] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.8)] md:mx-5 md:rounded-[36px] ${className}`}
    >
      <div className="relative mx-auto max-w-[1160px] px-6 py-20 md:px-14 md:py-28">{children}</div>
    </section>
  )
}

function HandLine({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 340 12"
      preserveAspectRatio="none"
      className={`absolute left-0 w-full ${className}`}
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
  )
}

/* ---------- page ---------- */

export default function ServiceLayout({ lang }: { lang: Lang }) {
  const s = SERVICE[lang]
  const x = EXTRA[lang]
  const bk = lang === 'ko' ? 'break-keep' : ''
  const contact = `/${lang}/#contact`

  return (
    <div className="bg-ink pb-2 md:pb-5">
      {/* ============ HERO — the Why, then the two questions under it ============ */}
      <section className="relative flex min-h-[70vh] items-center px-6 py-20 md:px-10 md:py-24">
        <div className="mx-auto w-full max-w-[1180px]">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
              {x.offer.badge}
            </p>
          </Reveal>

          <Reveal delay={90}>
            <h1
              className={`mt-14 ${bk} text-[clamp(28px,4vw,54px)] font-extrabold leading-[1.16] tracking-tightest text-white`}
            >
              {x.heroLine.lead} <span className="text-pen">{x.heroLine.why}</span>
              {lang === 'ko' ? '입니다.' : lang === 'ja' ? 'です。' : '.'}
            </h1>
            <p
              className={`mt-7 max-w-[26ch] ${bk} text-[clamp(18px,2.1vw,27px)] font-bold leading-[1.5] text-white/70`}
            >
              {x.heroLine.q1}
              <br />
              {x.heroLine.q2}
            </p>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-12 max-w-[38ch] text-[clamp(14.5px,1.2vw,17px)] leading-[1.7] text-white/55">
              {x.heroLine.close}
            </p>
          </Reveal>

          <Reveal delay={210}>
            <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-white/10 pt-9">
              <Button href={contact}>{x.offer.cta}</Button>
              <p className="font-mono text-[11px] tracking-[0.08em] text-white/45">{x.offer.facts[0]}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ SHEET 1 · the diagnosis material ============ */}
      <Paper id="why">
        <div className="grid gap-y-12 md:grid-cols-12 md:gap-x-10">
          <div className="md:col-span-3">
            <Reveal>
              <Label n="01">
                {x.pain.eyebrow}
              </Label>
            </Reveal>
          </div>
          <div className="md:col-span-8 md:col-start-5">
            <Reveal>
              <h2 className={`max-w-[26ch] ${bk} text-[27px] font-extrabold leading-[1.24] tracking-tightest md:text-[38px]`}>
                {x.pain.title}
                <br />
                {x.pain.titleAccent}
              </h2>
            </Reveal>

            <ul className="mt-12 border-t border-ink/10">
              {x.pain.quotes.map((q, i) => (
                <li key={q} className="border-b border-ink/10">
                  <Reveal delay={i * 70}>
                    <p className="relative max-w-[44ch] py-6 pl-9 text-[16px] leading-[1.75] text-charcoal md:py-7 md:text-[18px]">
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-5 select-none text-[32px] leading-[0.7] text-accent/45 md:top-6"
                      >
                        &ldquo;
                      </span>
                      {q}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ul>

            <Reveal>
              <p className="mt-16 md:mt-20">
                <span className={`relative inline-block ${bk} text-[26px] font-extrabold leading-[1.28] tracking-tightest text-ink md:text-[44px]`}>
                  {x.pain.close}
                  <HandLine className="-bottom-3 h-[9px] text-accent md:-bottom-4 md:h-[11px]" />
                </span>
              </p>
            </Reveal>

            <Reveal>
              <div className="mt-20 grid gap-10 border-t border-ink/10 pt-10 md:grid-cols-2 md:gap-14">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-warmgray">
                    {s.aiwhy.canTitle}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {s.aiwhy.can.map((c) => (
                      <li key={c} className="text-[14px] text-warmgray">
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink">
                    {s.aiwhy.cantTitle}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {s.aiwhy.cant.map((c) => (
                      <li key={c} className="text-[14px] font-bold text-ink">
                        {c}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 max-w-[34ch] text-[12.5px] leading-relaxed text-accent">
                    {s.aiwhy.cantNote}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Paper>

      {/* ============ between the sheets · what the work actually is ============ */}
      <Paper id="work-method" className="mt-2 overflow-x-clip md:mt-5">
        <div className="mx-auto max-w-[54rem] text-center">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-warmgray">
              {x.tools.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className={`mx-auto mt-7 max-w-[20ch] ${bk} text-[29px] font-extrabold leading-[1.18] tracking-tightest md:text-[44px]`}>
              {x.tools.title}
            </h2>
          </Reveal>
          <Reveal delay={110}>
            <p className="mx-auto mt-10 max-w-[42ch] text-[15px] leading-[2.05] text-warmgray">
              {x.tools.p1a}
              <Term tool={x.tools.items[0]} />
              {x.tools.p1b}
              <Term tool={x.tools.items[1]} />
              {x.tools.p1c}
            </p>
          </Reveal>
          <Reveal delay={150}>
            <p className="mx-auto mt-7 max-w-[42ch] text-[15px] leading-[2.05] text-warmgray">
              {x.tools.p2a}
              <Term tool={x.tools.items[2]} />
              {x.tools.p2b}
              <Term tool={x.tools.items[3]} />
              {x.tools.p2c}
            </p>
          </Reveal>
          <Reveal delay={190}>
            <p className="mx-auto mt-12 max-w-[30ch] border-t border-ink/15 pt-7 text-[15.5px] font-bold leading-relaxed text-ink">
              <span className="hl">{x.tools.close}</span>
            </p>
          </Reveal>
        </div>
      </Paper>

      {/* ============ SHEET 2 · the method, worked live ============ */}
      <Paper id="sheet" className="mt-2 md:mt-5">
        <div className="grid gap-y-14 md:grid-cols-12 md:gap-x-10">
          <div className="md:col-span-4">
            <Reveal>
              <Label n="02">
                {x.finder.eyebrow}
              </Label>
            </Reveal>
            <Reveal delay={60}>
              <div className="mt-12 max-w-[24rem] md:sticky md:top-24 md:mt-14">
                <PositionMap map={x.map} />
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-7 md:col-start-6">
            <Reveal>
              <h2 className={`max-w-[30ch] ${bk} text-[27px] font-extrabold leading-[1.24] tracking-tightest md:text-[31px] lg:text-[44px]`}>
                {x.finder.title}
                <br />
                {x.finder.titleAccent}
              </h2>
              <p className="mt-6 max-w-[40ch] text-[14.5px] leading-[1.85] text-warmgray">
                {x.finder.lead}
              </p>
            </Reveal>

            <Reveal delay={80}>
              <div className="mt-12 border-t border-ink/10 pt-10">
                <Finder block={x.finder} contact={contact} />
              </div>
            </Reveal>
          </div>
        </div>
      </Paper>

      {/* ============ on the desk · the work, glowing ============ */}
      <section id="work" className="scroll-mt-20 px-6 py-24 md:px-10 md:py-36">
        <div className="mx-auto max-w-[1160px]">
          <div className="grid gap-y-8 md:grid-cols-12 md:gap-x-10">
            <div className="md:col-span-3">
              <Reveal>
                <Label n="03" dark>
                  {x.eyebrows.work}
                </Label>
              </Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-5">
              <Reveal>
                <h2 className={`max-w-[18ch] ${bk} text-[24px] font-extrabold leading-[1.3] tracking-tightest text-white md:text-[32px]`}>
                  {s.workTitle}
                </h2>
              </Reveal>
            </div>
          </div>

          <div className="mt-16 md:mt-20">
            {s.demos.map((d, i) => {
              const c = x.cases.items[i]
              const flip = i % 2 === 1
              return (
                <Reveal key={d.href}>
                  <article className="grid gap-y-8 border-t border-white/10 py-14 md:grid-cols-12 md:gap-x-10 md:py-20">
                    <a
                      href={`${BP}/${d.href}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${d.label} (new tab)`}
                      className={`group block md:col-span-6 ${flip ? 'md:order-2 md:col-start-7' : ''}`}
                    >
                      <div className="rounded-[18px] bg-white/[0.05] p-1.5 ring-1 ring-white/10 transition-transform duration-700 ease-swift group-hover:-translate-y-1.5">
                        <div className="overflow-hidden rounded-[13px]">
                          <Image
                            src={`${BP}/images/${d.img}`}
                            alt={d.label}
                            width={1500}
                            height={1000}
                            className="aspect-[3/2] w-full object-cover object-top transition-transform duration-1000 ease-swift group-hover:scale-[1.03]"
                          />
                        </div>
                      </div>
                    </a>

                    <div className={`md:col-span-5 ${flip ? 'md:order-1 md:col-start-1' : 'md:col-start-8'}`}>
                      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">
                        {c.meta}
                      </p>
                      <h3 className="mt-3 text-[24px] font-extrabold tracking-tightest text-white md:text-[30px]">
                        <a
                          href={`${BP}/${d.href}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors duration-300 hover:text-accentlit"
                        >
                          {d.label}
                        </a>
                      </h3>
                      <dl className="mt-8 space-y-6">
                        {[
                          [x.cases.problemLabel, c.problem],
                          [x.cases.decisionLabel, c.decision],
                          [x.cases.outputLabel, c.output],
                        ].map(([k, v], n) => (
                          <div key={k}>
                            <dt
                              className={`font-mono text-[10px] uppercase tracking-[0.2em] ${
                                n === 1 ? 'text-accentlit' : 'text-white/40'
                              }`}
                            >
                              {k}
                            </dt>
                            <dd
                              className={`mt-1.5 max-w-[46ch] text-[13.5px] leading-[1.8] ${
                                n === 1 ? 'font-medium text-white' : 'text-white/60'
                              }`}
                            >
                              {v}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ SHEET 3 · how it runs, what it costs ============ */}
      <Paper id="price">
        <div className="grid gap-y-12 md:grid-cols-12 md:gap-x-10">
          <div className="md:col-span-3">
            <Reveal>
              <Label n="04">
                {x.eyebrows.price}
              </Label>
            </Reveal>
          </div>
          <div className="md:col-span-8 md:col-start-5">
            <Reveal>
              <h2 className={`max-w-[16ch] ${bk} text-[27px] font-extrabold leading-[1.24] tracking-tightest md:text-[42px]`}>
                {s.priceTitle}
              </h2>

              {/* the road, in one line */}
              <p className="mt-9 flex flex-wrap items-baseline gap-x-3 gap-y-2 border-y border-ink/10 py-4">
                {s.steps.map((st, i) => (
                  <span key={st.n} className="flex items-baseline gap-3">
                    <span className="font-mono text-[9.5px] text-accent">{st.n}</span>
                    <span className="text-[13px] font-bold text-ink">{st.title}</span>
                    {i < s.steps.length - 1 && (
                      <span aria-hidden="true" className="text-[11px] text-ink/25">
                        →
                      </span>
                    )}
                  </span>
                ))}
              </p>
            </Reveal>

            <Reveal delay={80}>
              <div className="mt-10">
                <Button href={contact}>{x.offer.cta}</Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Paper>

      {/* ============ on the desk · last questions, then the door ============ */}
      <section id="faq" className="scroll-mt-20 px-6 py-24 md:px-10 md:py-36">
        <div className="mx-auto max-w-[1160px]">
          <div className="grid gap-y-12 md:grid-cols-12 md:gap-x-10">
            <div className="md:col-span-3">
              <Reveal>
                <Label n="05" dark>
                  {x.eyebrows.faq}
                </Label>
              </Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-5">
              <Reveal>
                <Faq items={s.faq.slice(0, 3)} onDark />
              </Reveal>

              <Reveal>
                <div className="mt-24 md:mt-28">
                  <h2 className={`max-w-[16ch] ${bk} text-[30px] font-extrabold leading-[1.22] tracking-tightest text-white md:text-[48px] lg:text-[56px]`}>
                    {s.finalTitle}
                  </h2>
                  <p className="mt-6 max-w-[40ch] text-[15px] leading-[1.9] text-white/60">
                    {s.finalSub}
                  </p>
                  <div className="mt-10">
                    <Button href={contact}>{x.offer.cta}</Button>
                  </div>
                  <ul className="mt-8 space-y-2">
                    {x.offer.facts.map((f) => (
                      <li
                        key={f}
                        className="flex items-baseline gap-2.5 font-mono text-[11px] tracking-[0.06em] text-white/40"
                      >
                        <span aria-hidden="true" className="text-accentlit">
                          —
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
