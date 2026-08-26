import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Reveal from '@/components/Reveal'
import { getDict, isLang, langs, type Lang } from '@/lib/content'
import { PROJECT_IMAGES } from '@/lib/images'

const DETAIL_SLUGS = ['atelier-why', 'food-school']

const DETAIL_TONES: Record<string, string> = {
  'atelier-why': 'bg-[#E4E3DE]',
  'food-school': 'bg-[#DCDBD5]',
}

const BP = process.env.NEXT_PUBLIC_BASE_PATH || ''

export function generateStaticParams() {
  return langs.flatMap((lang) => DETAIL_SLUGS.map((slug) => ({ lang, slug })))
}

export function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string }
}): Metadata {
  const lang = (isLang(params.lang) ? params.lang : 'en') as Lang
  const dict = getDict(lang)
  const project = dict.projects.find((p) => p.slug === params.slug)
  if (!project) return {}
  return {
    title: `${project.title} — ${dict.meta.title}`,
    description: project.overview,
    alternates: {
      languages: {
        ja: `/ja/work/${params.slug}/`,
        ko: `/ko/work/${params.slug}/`,
        en: `/en/work/${params.slug}/`,
      },
    },
  }
}

function SectionRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <div className="grid gap-4 border-t border-line py-12 md:grid-cols-12 md:gap-8 md:py-16">
        <h2 className="text-xs uppercase tracking-[0.25em] text-warmgray md:col-span-3">{label}</h2>
        <div className="md:col-span-9">{children}</div>
      </div>
    </Reveal>
  )
}

export default function WorkDetail({ params }: { params: { lang: string; slug: string } }) {
  if (!isLang(params.lang) || !DETAIL_SLUGS.includes(params.slug)) notFound()
  const lang = params.lang as Lang
  const dict = getDict(lang)
  const labels = dict.detailLabels

  const project = dict.projects.find((p) => p.slug === params.slug)
  if (!project?.detail) notFound()
  const detail = project.detail
  const visual = Boolean(detail.manifesto)

  const detailProjects = dict.projects.filter((p) => p.hasDetail)
  const nextProject =
    detailProjects[(detailProjects.findIndex((p) => p.slug === project.slug) + 1) % detailProjects.length]

  return (
    <main className="px-5 pt-28 md:px-8 md:pt-32">
      <div className="mx-auto max-w-6xl pb-24">
        <Reveal>
          <Link
            href={`/${lang}/#work`}
            className="text-xs uppercase tracking-[0.2em] text-warmgray transition-colors hover:text-ink"
          >
            ← {labels.back}
          </Link>
          <p className="mt-10 text-[10px] uppercase tracking-[0.25em] text-warmgray">
            {project.category} · {project.year}
          </p>
          <h1 className="mt-4 text-5xl font-medium tracking-tightest md:text-8xl">{project.title}</h1>
          <p className="mt-6 max-w-2xl text-xl font-semibold tracking-tight text-accent md:text-2xl">
            {project.tagline}
          </p>
        </Reveal>

        {visual ? (
          <>
            <Reveal>
              <div className="border-b border-line py-24 text-center md:py-36">
                <p className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.2] tracking-tightest md:text-6xl">
                  {detail.manifesto}
                </p>
                <div className="mt-12 flex flex-wrap justify-center gap-x-7 gap-y-2 text-[10px] uppercase tracking-[0.28em] text-warmgray">
                  {project.roles.slice(0, 6).map((r) => (
                    <span key={r}>{r}</span>
                  ))}
                </div>
              </div>
            </Reveal>

            {detail.showcase && (
              <Reveal>
                <a
                  href={`${BP}/${detail.showcase.href}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative mt-16 block overflow-hidden rounded-[28px] bg-ink"
                >
                  {detail.showcase.img && (
                    <Image
                      src={`${BP}/images/${detail.showcase.img}`}
                      alt={detail.showcase.label}
                      width={1600}
                      height={1000}
                      priority
                      className="aspect-[16/10] w-full object-cover object-top opacity-80 transition-all duration-700 group-hover:scale-[1.02] group-hover:opacity-100 md:aspect-[16/7]"
                    />
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink/40 text-paper transition-colors group-hover:bg-ink/25">
                    <span className="text-4xl font-extrabold tracking-tightest md:text-6xl">
                      {detail.showcase.label}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.42em] opacity-80 transition-all group-hover:tracking-[0.5em]">
                      Enter →
                    </span>
                  </div>
                </a>
              </Reveal>
            )}

            {detail.demos && (
              <div className="mt-6 grid gap-x-6 gap-y-14 md:mt-8 md:grid-cols-2">
                {detail.demos.map((d, i) => (
                  <Reveal key={d.href} delay={(i % 2) * 100}>
                    <a href={`${BP}/${d.href}`} target="_blank" rel="noopener noreferrer" className="group block">
                      {d.img && (
                        <div className="overflow-hidden rounded-[20px] bg-surface">
                          <Image
                            src={`${BP}/images/${d.img}`}
                            alt={d.label}
                            width={1500}
                            height={1000}
                            className="aspect-[3/2] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                        </div>
                      )}
                      <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-3">
                        <span className="text-sm font-medium tracking-[0.12em] transition-colors group-hover:text-accent">
                          {d.label}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-warmgray">
                          {d.genre}
                        </span>
                      </div>
                    </a>
                  </Reveal>
                ))}
              </div>
            )}

            <Reveal>
              <div className="mt-24 flex flex-wrap items-baseline justify-between gap-x-10 gap-y-6 border-t border-line pt-10">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  {detail.process.map((step, i) => (
                    <span key={step} className="flex items-center gap-3">
                      {i > 0 && <span className="text-warmgray">→</span>}
                      <span className="text-base font-bold tracking-tight md:text-lg">{step}</span>
                    </span>
                  ))}
                </div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-warmgray">JA · EN · KO · FR</div>
              </div>
            </Reveal>
          </>
        ) : (
          <>
            <Reveal delay={150}>
              {PROJECT_IMAGES[project.slug] ? (
                <div className="relative mt-14 aspect-[16/9] overflow-hidden rounded-[28px] bg-surface">
                  <Image
                    src={PROJECT_IMAGES[project.slug].cover}
                    alt={project.title}
                    width={1600}
                    height={1000}
                    priority
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                </div>
              ) : (
                <div
                  className={`mt-14 flex aspect-[16/9] items-end overflow-hidden rounded-[28px] ${DETAIL_TONES[project.slug] ?? 'bg-[#E4E3DE]'}`}
                >
                  <span className="select-none px-6 pb-2 text-[22vw] font-extrabold leading-none text-charcoal/[0.12] md:text-[14rem]">
                    {project.title.replace(/ .*/, '')}
                  </span>
                </div>
              )}
            </Reveal>

            <div className="mt-20">
              <SectionRow label={labels.about}>
                <p className="max-w-2xl text-lg leading-relaxed tracking-tight md:text-xl">{detail.about}</p>
                {detail.link && (
                  <a
                    href={detail.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-block text-sm tracking-[0.05em] text-ink underline underline-offset-4 transition-colors hover:text-accent"
                  >
                    {detail.link.label} ↗
                  </a>
                )}
              </SectionRow>

              <SectionRow label={labels.challenge}>
                <p className="max-w-2xl text-base leading-relaxed text-charcoal md:text-lg">
                  {detail.challenge}
                </p>
              </SectionRow>

              <SectionRow label={labels.concept}>
                <p className="max-w-2xl text-base leading-relaxed text-charcoal md:text-lg">
                  {detail.concept}
                </p>
              </SectionRow>

              <SectionRow label={labels.role}>
                <div className="flex flex-wrap gap-x-2 gap-y-3">
                  {project.roles.map((role) => (
                    <span
                      key={role}
                      className="border border-line px-4 py-1.5 text-xs tracking-[0.08em] text-charcoal"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </SectionRow>

              <SectionRow label={labels.process}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-4">
                  {detail.process.map((step, i) => (
                    <span key={step} className="flex items-center gap-3">
                      {i > 0 && <span className="text-warmgray">→</span>}
                      <span className="text-lg font-bold tracking-tight md:text-xl">{step}</span>
                    </span>
                  ))}
                </div>
              </SectionRow>

              <SectionRow label={labels.visual}>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {PROJECT_IMAGES[project.slug]
                    ? PROJECT_IMAGES[project.slug].grid.map((src) => (
                        <div key={src} className="relative aspect-square overflow-hidden bg-[#E4E3DE]">
                          <Image
                            src={src}
                            alt={project.title}
                            width={800}
                            height={800}
                            loading="eager"
                            className="absolute inset-0 h-full w-full object-cover object-top"
                          />
                        </div>
                      ))
                    : [1, 2, 3].map((n) => (
                        <div
                          key={n}
                          className={`flex aspect-square items-end p-3 ${DETAIL_TONES[project.slug] ?? 'bg-[#E4E3DE]'}`}
                        >
                          <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal/40">
                            {labels.visualNote}
                          </span>
                        </div>
                      ))}
                </div>
              </SectionRow>

              <SectionRow label={labels.result}>
                <ul className="max-w-2xl space-y-4">
                  {detail.result.map((item) => (
                    <li
                      key={item}
                      className="border-b border-line pb-4 text-base leading-relaxed text-charcoal md:text-lg"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </SectionRow>
            </div>
          </>
        )}

        <Reveal>
          <Link
            href={`/${lang}/work/${nextProject.slug}/`}
            className="group mt-24 block border-t border-line pt-12"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-warmgray">{labels.next}</p>
            <p className="mt-4 text-4xl font-medium tracking-tightest transition-colors group-hover:text-accent md:text-6xl">
              {nextProject.title} →
            </p>
          </Link>
        </Reveal>
      </div>
    </main>
  )
}
