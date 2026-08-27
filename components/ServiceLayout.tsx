import Image from 'next/image'
import Link from 'next/link'
import Faq from '@/components/Faq'
import Finder from '@/components/Finder'
import PositionMap from '@/components/PositionMap'
import Reveal from '@/components/Reveal'
import type { Lang } from '@/lib/content'
import { SERVICE } from '@/lib/service'
import { EXTRA } from '@/lib/service-extra'

const BP = process.env.NEXT_PUBLIC_BASE_PATH || ''

function Label({ n, children, dark }: { n: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={`font-mono text-[10px] uppercase tracking-[0.28em] ${
        dark ? 'text-white/40' : 'text-warmgray'
      }`}
    >
      <span className={dark ? 'text-white/25' : 'text-ink/25'}>{n}</span>
      <span className="px-2.5">/</span>
      {children}
    </p>
  )
}

function Cta({
  href,
  children,
  dark,
}: {
  href: string
  children: React.ReactNode
  dark?: boolean
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-baseline gap-3 border-b pb-1 text-[15px] font-bold transition-colors duration-300 ${
        dark
          ? 'border-white/30 text-white hover:border-white'
          : 'border-ink/30 text-ink hover:border-ink'
      }`}
    >
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-300 ease-swift group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  )
}

export default function ServiceLayout({ lang }: { lang: Lang }) {
  const s = SERVICE[lang]
  const x = EXTRA[lang]
  const contact = `/${lang}/#contact`

  return (
    <div>
      {/* ============ 01 · one message, nothing under it ============ */}
      <section className="flex min-h-[78vh] items-end bg-ink px-6 pb-20 pt-24 md:min-h-[86vh] md:px-10 md:pb-28">
        <div className="mx-auto w-full max-w-[1200px]">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
              {s.badge}
            </p>
            <h1 className="mt-10 max-w-[19ch] break-keep text-[34px] font-extrabold leading-[1.16] tracking-tightest text-white md:text-[68px]">
              {s.headline}
              <br />
              {s.headlineAccent}
            </h1>
            <div className="mt-12 grid gap-10 md:grid-cols-12">
              <p className="text-[15px] leading-[1.9] text-white/60 md:col-span-5 md:col-start-6">
                {s.sub}
              </p>
            </div>
            <div className="mt-12 md:mt-16">
              <Cta href={contact} dark>
                {s.ctaPrimary}
              </Cta>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 02 · what gets said, and what AI cannot settle ============ */}
      <section id="why" className="scroll-mt-20 px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-y-12 md:grid-cols-12 md:gap-x-10">
            <div className="md:col-span-3">
              <Reveal>
                <Label n="01">{x.pain.eyebrow}</Label>
              </Reveal>
            </div>

            <div className="md:col-span-8 md:col-start-5">
              <Reveal>
                <h2 className="max-w-[18ch] break-keep text-[27px] font-extrabold leading-[1.24] tracking-tightest md:text-[44px]">
                  {x.pain.title}
                  <br />
                  {x.pain.titleAccent}
                </h2>
              </Reveal>

              <ul className="mt-14 border-t border-line">
                {x.pain.quotes.map((q, i) => (
                  <li key={q} className="border-b border-line">
                    <Reveal delay={i * 60}>
                      <p className="relative max-w-[44ch] py-7 pl-9 text-[16.5px] leading-[1.78] text-charcoal md:py-8 md:text-[19px] md:leading-[1.7]">
                        <span
                          aria-hidden="true"
                          className="absolute left-0 top-6 select-none text-[34px] leading-[0.7] text-accent/40 md:top-7"
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
                <div className="mt-20 grid gap-10 border-t border-line pt-12 md:grid-cols-2 md:gap-16">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-warmgray">
                      {s.aiwhy.canTitle}
                    </p>
                    <ul className="mt-5 space-y-2.5">
                      {s.aiwhy.can.map((c) => (
                        <li key={c} className="text-[14.5px] text-warmgray">
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink">
                      {s.aiwhy.cantTitle}
                    </p>
                    <ul className="mt-5 space-y-2.5">
                      {s.aiwhy.cant.map((c) => (
                        <li key={c} className="text-[14.5px] font-bold text-ink">
                          {c}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-6 max-w-[34ch] text-[13px] leading-relaxed text-accent">
                      {s.aiwhy.cantNote}
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============ the turn, alone and loud ============ */}
      <section className="bg-ink px-6 py-28 md:px-10 md:py-40">
        <div className="mx-auto max-w-[1200px]">
          <Reveal>
            <p className="grid md:grid-cols-12">
              <span className="relative inline-block text-[26px] font-extrabold leading-[1.32] tracking-tightest text-white md:col-span-11 md:col-start-2 md:text-[38px] lg:break-keep lg:text-[50px] lg:leading-[1.2] xl:text-[62px]">
                {x.pain.close}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 340 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-4 left-0 h-[10px] w-full text-accentlit md:-bottom-7 md:h-[14px]"
                >
                  <path
                    className="draw"
                    d="M3 8.6C62 4.2 142 2.8 208 4.8c38 1.1 76 2.9 129 1.6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="340"
                  />
                </svg>
              </span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ 03 · the working, not the finished thing ============ */}
      <section id="sheet" className="scroll-mt-20 bg-surface/50 px-6 py-24 md:px-10 md:py-36">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-y-16 md:grid-cols-12 md:gap-x-10">
            <div className="md:col-span-4">
              <Reveal>
                <Label n="02">{x.finder.eyebrow}</Label>
              </Reveal>
              <Reveal delay={60}>
                <div className="mt-12 max-w-[24rem] md:sticky md:top-24 md:mt-16">
                  <PositionMap map={x.map} />
                </div>
              </Reveal>
            </div>

            <div className="md:col-span-7 md:col-start-6">
              <Reveal>
                <h2 className="max-w-[16ch] break-keep text-[27px] font-extrabold leading-[1.24] tracking-tightest md:text-[44px]">
                  {x.finder.title}
                  <br />
                  {x.finder.titleAccent}
                </h2>
                <p className="mt-7 max-w-[40ch] text-[14.5px] leading-[1.85] text-warmgray">
                  {x.finder.lead}
                </p>
              </Reveal>

              <Reveal delay={80}>
                <div className="mt-14 border-t border-line pt-12">
                  <Finder block={x.finder} contact={contact} />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 04 · the decision behind each one ============ */}
      <section id="work" className="scroll-mt-20 px-6 py-28 md:px-10 md:py-44">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-y-8 md:grid-cols-12 md:gap-x-10">
            <div className="md:col-span-3">
              <Reveal>
                <Label n="03">{x.eyebrows.work}</Label>
              </Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-5">
              <Reveal>
                <h2 className="max-w-[18ch] break-keep text-[23px] font-extrabold leading-[1.3] tracking-tightest md:text-[32px]">
                  {s.workTitle}
                </h2>
                <p className="mt-7 max-w-[44ch] text-[14.5px] leading-[1.85] text-warmgray">
                  {x.cases.intro}
                </p>
              </Reveal>
            </div>
          </div>

          <div className="mt-20 md:mt-28">
            {s.demos.map((d, i) => {
              const c = x.cases.items[i]
              const flip = i % 2 === 1
              const lead = i === 0
              return (
                <Reveal key={d.href}>
                  <article className={`grid gap-y-8 border-t border-line md:grid-cols-12 md:gap-x-10 ${lead ? 'py-16 md:py-24' : 'py-14 md:py-18'}`}>
                    <a
                      href={`${BP}/${d.href}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${d.label} (new tab)`}
                      className={`group block ${lead ? 'md:col-span-7' : 'md:col-span-5'} ${
                        flip ? 'md:order-2 md:col-start-8' : ''
                      }`}
                    >
                      <Image
                        src={`${BP}/images/${d.img}`}
                        alt={d.label}
                        width={1500}
                        height={1000}
                        className="aspect-[4/3] w-full object-cover object-top transition-transform duration-700 ease-swift group-hover:scale-[1.015]"
                      />
                    </a>

                    <div
                      className={`${lead ? 'md:col-span-4 md:col-start-9' : 'md:col-span-6'} ${
                        flip ? 'md:order-1 md:col-start-1' : lead ? '' : 'md:col-start-7'
                      }`}
                    >
                      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-warmgray">
                        {c.meta}
                      </p>
                      <h3
                        className={`mt-3 font-extrabold tracking-tightest ${
                          lead ? 'text-[30px] md:text-[42px]' : 'text-[24px] md:text-[30px]'
                        }`}
                      >
                        <a
                          href={`${BP}/${d.href}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors duration-300 hover:text-accent"
                        >
                          {d.label}
                        </a>
                      </h3>

                      <dl className="mt-9 space-y-7">
                        {[
                          [x.cases.problemLabel, c.problem],
                          [x.cases.decisionLabel, c.decision],
                          [x.cases.outputLabel, c.output],
                        ].map(([k, v], n) => (
                          <div key={k} className="grid gap-x-6 gap-y-1.5 md:grid-cols-[5.5rem_1fr]">
                            <dt
                              className={`font-mono text-[10px] uppercase tracking-[0.2em] ${
                                n === 1 ? 'text-accent' : 'text-warmgray'
                              }`}
                            >
                              {k}
                            </dt>
                            <dd
                              className={`max-w-[46ch] text-[14.5px] leading-[1.85] ${
                                n === 1 ? 'font-medium text-ink' : 'text-charcoal'
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

          <Reveal>
            <div className="border-t border-line pt-10">
              <a
                href={`${BP}/${s.showroom.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-baseline gap-3 text-[15px] font-bold transition-colors duration-300 hover:text-accent"
              >
                {s.showroom.label}
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-warmgray">
                  {s.showroom.cta}
                </span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-swift group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 05 · how it runs, and what it costs ============ */}
      <section id="how" className="scroll-mt-20 border-t border-line px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-y-12 md:grid-cols-12 md:gap-x-10">
            <div className="md:col-span-3">
              <Reveal>
                <Label n="04">{x.eyebrows.steps}</Label>
              </Reveal>
            </div>
            <div className="md:col-span-8 md:col-start-5">
              <Reveal>
                <h2 className="max-w-[16ch] break-keep text-[27px] font-extrabold leading-[1.24] tracking-tightest md:text-[44px]">
                  {s.includedTitle}
                </h2>
              </Reveal>

              <ol className="mt-14 border-t border-line">
                {s.steps.map((st) => (
                  <li key={st.n} className="border-b border-line">
                    <Reveal>
                      <div className="grid gap-x-8 gap-y-2 py-7 md:grid-cols-[3rem_10rem_1fr] md:items-baseline md:py-9">
                        <span className="font-mono text-[11px] tabular-nums tracking-[0.18em] text-accent">
                          {st.n}
                        </span>
                        <h3 className="text-[17px] font-extrabold tracking-tight">{st.title}</h3>
                        <p className="max-w-[46ch] text-[14px] leading-[1.85] text-charcoal">
                          {st.desc}
                        </p>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ol>

              <Reveal>
                <div className="mt-16 grid gap-x-12 gap-y-9 md:grid-cols-2">
                  {s.included.map((it) => (
                    <div key={it.title}>
                      <h4 className="text-[15px] font-extrabold tracking-tight">{it.title}</h4>
                      <p className="mt-2 max-w-[42ch] text-[13.5px] leading-[1.8] text-warmgray">
                        {it.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>

            </div>
          </div>

          <div className="mt-24 grid gap-y-10 border-t border-line pt-16 md:mt-32 md:grid-cols-12 md:gap-x-10">
            <div className="md:col-span-3">
              <Reveal>
                <Label n="05">{x.eyebrows.price}</Label>
              </Reveal>
            </div>

            <div className="md:col-span-8 md:col-start-5">
              <Reveal>
                <div className="grid gap-y-12 md:grid-cols-2 md:gap-x-12">
                  {s.plans.map((p, i) => (
                    <div key={p.name}>
                      <h3
                        className={`text-[17px] font-extrabold tracking-tight ${
                          p.featured ? 'text-ink' : 'text-charcoal'
                        }`}
                      >
                        {p.name}
                      </h3>
                      <p className="mt-3 flex flex-wrap items-baseline gap-x-2">
                        <span
                          className={`text-[30px] font-extrabold tracking-tightest md:text-[36px] ${
                            p.featured ? 'text-ink' : 'text-charcoal'
                          }`}
                        >
                          {p.price}
                        </span>
                        <span className="break-keep text-xs text-warmgray">{p.unit}</span>
                      </p>
                      <p className="mt-4 max-w-[36ch] text-[13.5px] leading-[1.8] text-charcoal">
                        {p.desc}
                      </p>
                      <p className="mt-5 max-w-[38ch] text-[13px] leading-[1.8] text-warmgray">
                        <span className="font-bold text-accent">{x.planExtra.bestLabel}</span>{' '}
                        {x.planExtra.items[i]?.best}
                      </p>
                      <ul className="mt-6 space-y-1.5 border-t border-line pt-5">
                        {p.features.map((f) => (
                          <li key={f} className="text-[13.5px] text-charcoal">
                            {f}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-5 text-[12.5px] leading-[1.75] text-warmgray">
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
                          {x.planExtra.excludeLabel}
                        </span>{' '}
                        {x.planExtra.items[i]?.excludes.join(' · ')}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="mt-12 max-w-[52ch] text-[12.5px] leading-[1.85] text-warmgray">
                  {s.priceNote}
                </p>

                <div className="mt-12">
                  <Cta href={contact}>{s.ctaPrimary}</Cta>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 06 · the last three questions, then the door ============ */}
      <section id="faq" className="scroll-mt-20 bg-ink px-6 py-24 md:px-10 md:py-36">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-y-12 md:grid-cols-12 md:gap-x-10">
            <div className="md:col-span-3">
              <Reveal>
                <Label n="06" dark>
                  {x.eyebrows.faq}
                </Label>
              </Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-5">
              <Reveal>
                <Faq items={s.faq.slice(0, 3)} onDark />
              </Reveal>

              <Reveal>
                <div className="mt-24 md:mt-32">
                  <h2 className="max-w-[16ch] break-keep text-[28px] font-extrabold leading-[1.24] tracking-tightest text-white md:text-[44px]">
                    {s.finalTitle}
                  </h2>
                  <p className="mt-6 max-w-[40ch] text-[15px] leading-[1.9] text-white/60">
                    {s.finalSub}
                  </p>
                  <div className="mt-11">
                    <Cta href={contact} dark>
                      {s.finalCta}
                    </Cta>
                  </div>
                  <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.24em] text-white/30">
                    {s.finalNote}
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
