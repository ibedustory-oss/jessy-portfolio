import type { Metadata } from 'next'
import Image from 'next/image'
import Reveal from '@/components/Reveal'
import { getDict, isLang, langs, type Lang } from '@/lib/content'
import { PORTRAIT } from '@/lib/images'

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }))
}

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = (isLang(params.lang) ? params.lang : 'en') as Lang
  const dict = getDict(lang)
  return {
    title: `${dict.nav.about} — ${dict.meta.title}`,
    description: dict.about.body[0],
    alternates: { languages: { ja: '/ja/about/', ko: '/ko/about/', en: '/en/about/' } },
  }
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

export default function About({ params }: { params: { lang: string } }) {
  const lang = (isLang(params.lang) ? params.lang : 'en') as Lang
  const dict = getDict(lang)

  return (
    <main className="pt-24 md:pt-32">
      {/* -------------------------------------------------- Who */}
      <section className="px-5 pb-16 pt-8 md:px-8 md:pb-24">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-12">
          <div className={PORTRAIT ? 'md:col-span-7' : 'md:col-span-9'}>
            <Reveal>
              <p className="inline-flex rounded-full bg-surface px-4 py-1.5 text-[13px] font-semibold text-charcoal">
                {dict.about.heading}
              </p>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tightest md:text-6xl">
                {dict.about.title}
              </h1>
              <p className="mt-6 text-lg font-bold tracking-tight">{dict.about.name}</p>
              <p className="mt-1 text-sm text-warmgray">{dict.about.credential}</p>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-9 max-w-2xl space-y-5 text-base leading-relaxed text-charcoal">
                {dict.about.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
          </div>
          {PORTRAIT && (
            <Reveal delay={200} className="md:col-span-4 md:col-start-9">
              <Image
                src={PORTRAIT}
                alt={dict.about.name}
                width={900}
                height={1200}
                className="aspect-[3/4] w-full rounded-[28px] object-cover"
              />
            </Reveal>
          )}
        </div>
      </section>

      {/* -------------------------------------------------- How I work */}
      <section className="px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl">
          <Head eyebrow="Process" title={dict.how.heading} note={dict.how.sub} />
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {dict.how.steps.map((step, i) => (
              <Reveal key={step.name} delay={i * 80}>
                <div className="h-full rounded-[24px] bg-surface p-6">
                  <p aria-hidden="true" className="text-3xl font-extrabold tabular-nums tracking-tight text-accentlit/25">
                    {step.num}
                  </p>
                  <h3 className="mt-3 text-lg font-bold tracking-tight">{step.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal">{step.desc}</p>
                  <p className="mt-5 text-xs leading-relaxed text-warmgray">
                    {step.items.join(' · ')}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- What I do */}
      <section className="px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl">
          <Head eyebrow="Services" title={dict.services.heading} note={dict.services.note} />
          <div className="mt-8 space-y-4">
            {dict.services.groups.map((group, i) => (
              <Reveal key={group.name} delay={i * 60}>
                <div className="grid gap-3 rounded-[24px] bg-surface p-6 md:grid-cols-12 md:items-center md:gap-8 md:p-8">
                  <p aria-hidden="true" className="text-sm font-extrabold tabular-nums text-accentlit/40 md:col-span-1">
                    {group.num}
                  </p>
                  <div className="md:col-span-4">
                    <h3 className="text-xl font-bold tracking-tight">{group.name}</h3>
                    <p className="mt-1 text-sm text-warmgray">{group.sub}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 md:col-span-7">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-charcoal"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- Career */}
      <section className="px-5 pb-24 pt-14 md:px-8 md:pb-32 md:pt-16">
        <div className="mx-auto max-w-6xl">
          <Head eyebrow="Career" title={dict.career.heading} note={dict.career.sub} />
          <div className="mt-6">
            {dict.career.items.map((item, i) => (
              <Reveal key={`${item.period}-${item.org}`} delay={i * 40}>
                <div className="grid gap-2 border-b border-line py-7 md:grid-cols-12 md:gap-8">
                  <p className="text-[13px] font-semibold tabular-nums text-warmgray md:col-span-2 md:pt-0.5">
                    {item.period}
                  </p>
                  <div className="md:col-span-4">
                    <h3 className="text-base font-bold tracking-tight">{item.role}</h3>
                    <p className="mt-0.5 text-sm text-warmgray">{item.org}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-charcoal md:col-span-6 md:pt-0.5">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
