import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '@/components/services'

const projects = [
  {
    title: 'Kage: Gölge Yolu',
    category: 'Oyun',
    year: '2026',
    description: 'Gece ormanında geçen, atmosfer odaklı aksiyon-macera oyunu.',
    image: '/images/project-game.png',
  },
  {
    title: 'Nami',
    category: 'Mobil Uygulama',
    year: '2026',
    description: 'Odaklanma ve günlük rutinler için minimalist üretkenlik uygulaması.',
    image: '/images/project-app.png',
  },
  {
    title: 'Akai Kampanyası',
    category: 'Reklam & Marka',
    year: '2025',
    description: 'Yeni nesil bir marka için uçtan uca kimlik ve dijital kampanya.',
    image: '/images/project-brand.png',
  },
]

export function Projects() {
  return (
    <section id="projeler" className="scroll-mt-16 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading eyebrow="02 — Projelerimiz" title="Son çalışmalarımız." />
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <li key={project.title}>
              <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/40">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={`${project.title} projesinden görsel`}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    <span>{project.category}</span>
                    <span>{project.year}</span>
                  </div>
                  <h3 className="mt-4 flex items-center justify-between text-lg font-medium">
                    {project.title}
                    <ArrowUpRight
                      className="size-4 text-muted-foreground transition-colors group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
