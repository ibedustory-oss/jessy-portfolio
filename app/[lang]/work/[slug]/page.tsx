import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Reveal from '@/components/Reveal'
import { getDict, isLang, langs, type Lang } from '@/lib/content'

const DETAIL_SLUGS = ['atelier-why', 'food-school']

const DETAIL_TONES: Record<string, string> = {
  'atelier-why': 'bg-[#EDE9E1]',
  'food-school': 'bg-[#E5E1D6]',
}

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

function SectionRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
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

  const detailProjects = dict.projects.filter((p) => p.hasDetail)
  const nextProject =
    detailProjects[(detailProjects.findIndex((p) => p.slug === project.slug) + 1) % detailProjects.length]

  return (
    <main className="px-5 pt-28 md:px-8">
      <div className="mx-auto max-w-6xl pb-24">
        {/* ------------------------------------------------ Hero */}
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
          <h1 className="mt-4 text-5xl font-medium tracking-tightest md:text-8xl">
            {project.title}
          </h1>
          <p className="mt-6 max-w-2xl font-serif text-2xl italic text-charcoal md:text-3xl">
            {project.tagline}
          </p>
        </Reveal>

        <Reveal delay={150}>
          <div
            className={`mt-14 flex aspect-[16/9] items-end overflow-hidden ${DETAIL_TONES[project.slug] ?? 'bg-[#EAE5DD]'}`}
          >
            <span className="select-none px-6 pb-2 font-serif text-[22vw] italic leading-none text-charcoal/[0.12] md:text-[14rem]">
              {project.title.replace(/ .*/, '')}
            </span>
          </div>
        </Reveal>

        {/* ------------------------------------------------ Sections */}
        <div className="mt-20">
          <SectionRow label={labels.about}>
            <p className="max-w-2xl text-lg leading-relaxed tracking-tight md:text-xl">
              {detail.about}
            </p>
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
                  <span className="font-serif text-xl italic md:text-2xl">{step}</span>
                </span>
              ))}
            </div>
          </SectionRow>

          <SectionRow label={labels.visual}>
            {/* Placeholder grid — swap for screenshots / photography */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={`flex aspect-square items-end p-3 ${DETAIL_TONES[project.slug] ?? 'bg-[#EAE5DD]'}`}
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

        {/* ------------------------------------------------ Next */}
        <Reveal>
          <Link href={`/${lang}/work/${nextProject.slug}/`} className="group block border-t border-line pt-12">
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
