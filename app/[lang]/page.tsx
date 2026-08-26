import Link from 'next/link'
import Image from 'next/image'
import Reveal from '@/components/Reveal'
import ContactForm from '@/components/ContactForm'
import SectionRail from '@/components/SectionRail'
import StickyEdge from '@/components/StickyEdge'
import { getDict, isLang, type Lang, type Project } from '@/lib/content'
import { PROJECT_IMAGES } from '@/lib/images'
import { SERVICE } from '@/lib/service'

const BP = process.env.NEXT_PUBLIC_BASE_PATH || ''

/* Screenshot in a machined tray: soft outer shell, concentric inner radius. */
function Bezel({
  src,
  alt,
  priority,
  aspect = 'aspect-[4/3]',
}: {
  src: string
  alt: string
  priority?: boolean
  aspect?: string
}) {
  return (
    <div className="rounded-[28px] bg-surface p-2 ring-1 ring-ink/[0.04]">
      <div className={`relative overflow-hidden rounded-[20px] bg-white ${aspect}`}>
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={1200}
          priority={priority}
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-swift group-hover:scale-[1.025]"
        />
      </div>
    </div>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] font-bold tracking-wide text-accent">{children}</p>
}

export default function Home({ params }: { params: { lang: string } }) {
  const lang = (isLang(params.lang) ? params.lang : 'en') as Lang
  const dict = getDict(lang)

  return (
    <main>
      <SectionRail />
      {/* ------------------------------------------------ Hero */}
      <section
        data-rail
        className="relative flex min-h-[94vh] items-center overflow-hidden px-5 pb-16 pt-32 md:pt-36"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(900px_420px_at_50%_-120px,#EEF4FD,transparent_70%)]"
        />
        <div className="relative mx-auto w-full max-w-5xl text-center">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-[13px] font-semibold text-charcoal">
              {dict.hero.name} · {dict.hero.credential}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mx-auto mt-8 text-[3.2rem] font-extrabold leading-[1.05] tracking-tightest md:text-[6.4rem]">
              {dict.hero.title}
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-charcoal md:text-xl">
              {dict.hero.sub}
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/${lang}/#contact`}
                className="rounded-full bg-accent px-7 py-3.5 text-[15px] font-semibold text-white transition-[background-color,transform] duration-200 ease-swift hover:bg-accenthover active:scale-[0.97]"
              >
                {dict.nav.contact}
              </Link>
              <a
                href="#work"
                className="rounded-full bg-surface px-7 py-3.5 text-[15px] font-semibold text-ink transition-[background-color,transform] duration-200 ease-swift hover:bg-surface2 active:scale-[0.97]"
              >
                {dict.hero.cta}
              </a>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <p className="mt-10 text-xs font-medium tracking-[0.14em] text-warmgray">
              {dict.hero.fields}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------ Numbers */}
      <section data-rail className="flex min-h-[62vh] items-center px-5 py-24 md:px-8">
        <Reveal className="w-full">
          <div className="mx-auto grid max-w-5xl grid-cols-2 overflow-hidden rounded-[32px] bg-surface md:grid-cols-4">
            {dict.edge.numbers.map((n, i) => (
              <div
                key={n.l}
                className={`px-6 py-10 md:px-8 md:py-14 ${i % 2 === 1 ? 'border-l border-white' : ''} ${
                  i > 1 ? 'border-t border-white md:border-t-0' : ''
                } ${i > 0 ? 'md:border-l md:border-white' : ''}`}
              >
                <p className="text-3xl font-extrabold tracking-tight tabular-nums md:text-5xl">
                  {n.v}
                </p>
                <p className="mt-1.5 text-[12px] leading-snug text-warmgray">{n.l}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------ The Difference */}
      <section data-rail className="px-5 py-28 md:px-8 md:py-40">
        <div className="mx-auto max-w-6xl">
          <StickyEdge eyebrow={dict.edge.heading} heading={dict.edge.sub} items={dict.edge.items} />
        </div>
      </section>

      {/* ------------------------------------------------ Selected Work */}
      <section id="work" data-rail className="scroll-mt-24 px-5 pb-28 md:px-8 md:pb-44">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow>Selected Work</Eyebrow>
                <h2 className="mt-3 text-4xl font-extrabold tracking-tightest md:text-6xl">
                  {dict.workSection.heading}
                </h2>
              </div>
              <p className="text-sm text-warmgray">{dict.workSection.sub}</p>
            </div>
          </Reveal>

          <div className="mt-14 space-y-20 md:space-y-28">
            {dict.projects.map((project, index) => {
              const hasVisual = Boolean(PROJECT_IMAGES[project.slug])
              const body = (
                <div className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
                  {hasVisual && (
                    <div className={`md:col-span-7 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                      <div className="transition-transform duration-500 ease-swift group-hover:-translate-y-1.5">
                        <Bezel
                          src={PROJECT_IMAGES[project.slug].cover}
                          alt={project.title}
                          priority={index === 0}
                        />
                      </div>
                    </div>
                  )}
                  <div
                    className={
                      hasVisual
                        ? `md:col-span-5 ${index % 2 === 1 ? 'md:order-1' : ''}`
                        : 'md:col-span-8'
                    }
                  >
                    <p className="text-xs font-semibold tracking-[0.12em] text-warmgray">
                      {project.category} · {project.year}
                    </p>
                    <h3 className="mt-3 text-2xl font-extrabold tracking-tight md:text-3xl">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-[15px] font-semibold text-accent">{project.tagline}</p>
                    <p className="mt-4 text-[15px] leading-relaxed text-charcoal">
                      {project.overview}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {project.roles.slice(0, 5).map((r) => (
                        <span
                          key={r}
                          className="rounded-full bg-surface px-3 py-1 text-[11px] font-semibold text-charcoal"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                    {project.hasDetail && (
                      <p className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink transition-colors group-hover:text-accent">
                        {dict.workSection.view}
                        <span className="transition-transform duration-300 ease-swift group-hover:translate-x-0.5">
                          →
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              )

              return (
                <Reveal key={project.slug}>
                  {project.hasDetail ? (
                    <Link href={`/${lang}/work/${project.slug}/`} className="group block">
                      {body}
                    </Link>
                  ) : (
                    <div>{body}</div>
                  )}
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ The Offer */}
      <section data-rail className="px-5 pb-28 md:px-8 md:pb-44">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Link
              href={`/${lang}/services/`}
              className="group relative block overflow-hidden rounded-[32px] bg-ink text-white"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-32 right-0 h-[420px] w-[560px] bg-[radial-gradient(closest-side,rgba(49,130,246,0.28),transparent)]"
              />
              <div className="relative grid gap-10 px-7 pt-12 md:grid-cols-12 md:gap-8 md:px-14 md:pt-16">
                <div className="md:col-span-7">
                  <p className="inline-flex items-center gap-2.5 rounded-full bg-white/10 px-4 py-1.5 text-[13px] font-semibold text-white/90">
                    <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#4ADE80]" />
                    {dict.offer.label}
                  </p>
                  <h2 className="mt-6 text-3xl font-extrabold leading-[1.14] tracking-tightest md:text-[2.9rem]">
                    {dict.offer.heading}
                  </h2>
                  <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/70 md:text-base">
                    {dict.offer.body}
                  </p>
                </div>
                <div className="flex flex-col justify-between gap-8 md:col-span-4 md:col-start-9">
                  <ul className="space-y-3">
                    {dict.offer.points.map((pt) => (
                      <li key={pt} className="flex items-center gap-3 text-[15px] font-medium text-white/90">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10">
                          <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
                            <path
                              d="M2 6.2l2.6 2.6L10 3.4"
                              fill="none"
                              stroke="#3182F6"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <div>
                    <span className="inline-flex items-center gap-3 rounded-full bg-white py-2 pl-6 pr-2 text-[15px] font-semibold text-ink transition-transform duration-200 ease-swift group-hover:scale-[1.02] group-active:scale-[0.98]">
                      {dict.offer.cta}
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-tint text-accent transition-transform duration-300 ease-swift group-hover:translate-x-0.5">
                        →
                      </span>
                    </span>
                    <p className="mt-3.5 text-xs text-white/60">{dict.offer.note}</p>
                  </div>
                </div>
              </div>

              <div className="relative mt-12 flex gap-3 px-7 pb-12 md:px-14 md:pb-16">
                {SERVICE[lang].demos.map((d) => (
                  <div
                    key={d.img}
                    className="w-1/2 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10 md:w-1/4"
                  >
                    <Image
                      src={`${BP}/images/${d.img}`}
                      alt={d.label}
                      width={900}
                      height={600}
                      className="aspect-[3/2] w-full object-cover object-top opacity-85 transition-opacity duration-500 group-hover:opacity-100"
                    />
                  </div>
                ))}
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------ Contact */}
      <section id="contact" data-rail className="scroll-mt-24 px-5 pb-24 md:px-8 md:pb-32">
        <div className="mx-auto max-w-6xl rounded-[32px] bg-surface px-6 py-14 md:px-14 md:py-20">
          <div className="grid gap-12 md:grid-cols-12">
            <Reveal className="md:col-span-5">
              <h2 className="text-3xl font-extrabold leading-tight tracking-tightest md:text-4xl">
                {dict.contact.heading}
              </h2>
              <p className="mt-4 text-[15px] font-semibold text-accent">{dict.contact.line}</p>
              <p className="mt-5 text-sm leading-relaxed text-charcoal">{dict.contact.desc}</p>
              <ul className="mt-7 space-y-2.5">
                {dict.contact.bullets.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-charcoal">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={100} className="md:col-span-7">
              <div className="rounded-[24px] bg-white p-5 shadow-soft md:p-8">
                <ContactForm dict={dict} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  )
}
