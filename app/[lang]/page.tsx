import Link from 'next/link'
import Image from 'next/image'
import Reveal from '@/components/Reveal'
import ContactForm from '@/components/ContactForm'
import { getDict, isLang, type Lang, type Project } from '@/lib/content'
import { PROJECT_IMAGES } from '@/lib/images'

const PROJECT_TONES: Record<string, string> = {
  'atelier-why': 'bg-[#EDE9E1]',
  'food-school': 'bg-[#E5E1D6]',
  'web-projects': 'bg-[#EAE5DD]',
  'social-brand': 'bg-[#E8E2D8]',
}

function ProjectVisual({ project }: { project: Project }) {
  const images = PROJECT_IMAGES[project.slug]

  if (images) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden bg-[#EAE5DD]">
        <Image
          src={images.cover}
          alt={project.title}
          width={1600}
          height={1000}
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
        />
      </div>
    )
  }

  // Typographic placeholder for projects without visuals yet.
  return (
    <div
      className={`relative flex aspect-[4/3] items-end overflow-hidden ${PROJECT_TONES[project.slug] ?? 'bg-[#EAE5DD]'}`}
    >
      <span className="pointer-events-none absolute left-4 top-4 text-[10px] uppercase tracking-[0.25em] text-charcoal/50">
        {project.category}
      </span>
      <span className="select-none px-4 pb-2 font-serif text-[17vw] italic leading-none text-charcoal/[0.13] md:text-[8rem]">
        {project.title.replace(/ .*/, '')}
      </span>
    </div>
  )
}

export default function Home({ params }: { params: { lang: string } }) {
  const lang = (isLang(params.lang) ? params.lang : 'en') as Lang
  const dict = getDict(lang)

  return (
    <main>
      {/* ------------------------------------------------ Hero */}
      <section className="flex min-h-screen flex-col justify-end px-5 pb-14 pt-28 md:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.25em] text-warmgray">
              {dict.hero.name} — {dict.hero.credential}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-6 max-w-5xl text-[13vw] font-medium leading-[0.98] tracking-tightest md:text-[6.5rem]">
              {dict.hero.title}
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-charcoal md:text-lg">
              {dict.hero.sub}
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-12 flex flex-col gap-4 border-t border-line pt-5 md:flex-row md:items-center md:justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-warmgray">{dict.hero.fields}</p>
              <a
                href="#work"
                className="text-sm tracking-[0.05em] text-ink transition-colors hover:text-accent"
              >
                {dict.hero.cta} ↓
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------ Intro */}
      <section className="border-t border-line px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-3">
            <h2 className="text-xs uppercase tracking-[0.25em] text-warmgray">
              {dict.intro.heading}
            </h2>
          </Reveal>
          <div className="md:col-span-9">
            <Reveal>
              <p className="max-w-2xl text-xl leading-relaxed tracking-tight md:text-2xl">
                {dict.intro.body}
              </p>
            </Reveal>
            <Reveal delay={150}>
              <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-4">
                {dict.intro.words.map((word) => (
                  <p
                    key={word}
                    className="border-t border-line pt-3 font-serif text-2xl italic md:text-3xl"
                  >
                    {word}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Selected Work */}
      <section id="work" className="scroll-mt-16 border-t border-line px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-4xl font-medium tracking-tightest md:text-6xl">
                {dict.workSection.heading}
              </h2>
              <p className="text-sm text-warmgray">{dict.workSection.sub}</p>
            </div>
          </Reveal>

          <div className="mt-16 space-y-24 md:space-y-32">
            {dict.projects.map((project, index) => {
              const body = (
                <div className="grid gap-8 md:grid-cols-12 md:gap-12">
                  <div className={`md:col-span-7 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                    <ProjectVisual project={project} />
                  </div>
                  <div className={`md:col-span-5 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-warmgray">
                      {String(index + 1).padStart(2, '0')} — {project.category} · {project.year}
                    </p>
                    <h3 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
                      {project.title}
                    </h3>
                    <p className="mt-3 font-serif text-xl italic text-charcoal">
                      {project.tagline}
                    </p>
                    <p className="mt-5 text-sm leading-relaxed text-charcoal md:text-base">
                      {project.overview}
                    </p>
                    <p className="mt-6 text-xs leading-relaxed tracking-[0.05em] text-warmgray">
                      {project.roles.join(' / ')}
                    </p>
                    {project.hasDetail && (
                      <p className="mt-6 text-sm tracking-[0.05em] text-ink transition-colors group-hover:text-accent">
                        {dict.workSection.view} →
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

      {/* ------------------------------------------------ How I Work */}
      <section className="border-t border-line px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="font-serif text-5xl italic tracking-tight md:text-7xl">
              {dict.how.heading}
            </h2>
            <p className="mt-4 max-w-xl text-sm text-warmgray md:text-base">{dict.how.sub}</p>
          </Reveal>
          <div className="mt-16 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-4">
            {dict.how.steps.map((step, i) => (
              <Reveal key={step.name} delay={i * 80} className="bg-paper p-6 md:p-8">
                <p className="text-[10px] tracking-[0.25em] text-warmgray">{step.num}</p>
                <h3 className="mt-6 text-2xl font-medium tracking-tight">{step.name}</h3>
                <p className="mt-3 min-h-12 text-sm leading-relaxed text-charcoal">{step.desc}</p>
                <p className="mt-6 text-xs leading-relaxed tracking-[0.05em] text-warmgray">
                  {step.items.join(' / ')}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Services */}
      <section
        id="services"
        className="scroll-mt-16 border-t border-line px-5 py-24 md:px-8 md:py-32"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-4xl font-medium tracking-tightest md:text-6xl">
                {dict.services.heading}
              </h2>
              <p className="text-sm text-warmgray">{dict.services.note}</p>
            </div>
          </Reveal>
          <div className="mt-16 space-y-0">
            {dict.services.groups.map((group, i) => (
              <Reveal key={group.name} delay={i * 60}>
                <div className="grid gap-4 border-t border-line py-10 md:grid-cols-12 md:gap-8">
                  <p className="text-[10px] tracking-[0.25em] text-warmgray md:col-span-1">
                    {group.num}
                  </p>
                  <div className="md:col-span-5">
                    <h3 className="text-2xl font-medium tracking-tight md:text-3xl">{group.name}</h3>
                    <p className="mt-2 text-sm text-warmgray">{group.sub}</p>
                  </div>
                  <p className="text-sm leading-loose text-charcoal md:col-span-6">
                    {group.items.join(' / ')}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ About */}
      <section id="about" className="scroll-mt-16 border-t border-line px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-3">
            <h2 className="text-xs uppercase tracking-[0.25em] text-warmgray">
              {dict.about.heading}
            </h2>
          </Reveal>
          <div className="md:col-span-6">
            <Reveal>
              <p className="text-2xl font-medium tracking-tight">{dict.about.name}</p>
              <p className="mt-1 text-sm text-warmgray">{dict.about.credential}</p>
              <p className="mt-6 font-serif text-2xl italic md:text-3xl">{dict.about.title}</p>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-8 space-y-5 text-base leading-relaxed text-charcoal">
                {dict.about.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={200} className="md:col-span-3">
            {/* Portrait placeholder — swap for a natural, at-work photo */}
            <div className="flex aspect-[3/4] items-end bg-[#E8E4DB] p-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal/40">
                Portrait — coming soon
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------ Career */}
      <section className="border-t border-line px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-4xl font-medium tracking-tightest md:text-6xl">
                {dict.career.heading}
              </h2>
              <p className="text-sm text-warmgray">{dict.career.sub}</p>
            </div>
          </Reveal>
          <div className="mt-16">
            {dict.career.items.map((item, i) => (
              <Reveal key={`${item.period}-${item.org}`} delay={i * 40}>
                <div className="grid gap-2 border-t border-line py-7 md:grid-cols-12 md:gap-8">
                  <p className="text-xs tracking-[0.15em] text-warmgray md:col-span-2 md:pt-1">
                    {item.period}
                  </p>
                  <div className="md:col-span-4">
                    <h3 className="text-lg font-medium tracking-tight">{item.role}</h3>
                    <p className="mt-0.5 text-sm text-warmgray">{item.org}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-charcoal md:col-span-6 md:pt-1">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Contact */}
      <section
        id="contact"
        className="scroll-mt-16 border-t border-line px-5 py-24 md:px-8 md:py-32"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="max-w-3xl text-4xl font-medium leading-tight tracking-tightest md:text-6xl">
              {dict.contact.heading}
            </h2>
            <p className="mt-6 font-serif text-2xl italic text-charcoal">{dict.contact.line}</p>
          </Reveal>
          <div className="mt-14 grid gap-12 md:grid-cols-12">
            <Reveal className="md:col-span-5">
              <p className="text-sm text-warmgray">{dict.contact.desc}</p>
              <ul className="mt-6 space-y-3">
                {dict.contact.bullets.map((item) => (
                  <li key={item} className="border-b border-line pb-3 text-sm text-charcoal">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={120} className="md:col-span-7">
              <ContactForm dict={dict} />
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  )
}
