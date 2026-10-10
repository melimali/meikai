import { Gamepad2, Smartphone, Megaphone, PenTool } from 'lucide-react'

const services = [
  { icon: Smartphone, title: 'Uygulama Geliştirme', text: 'iOS, Android ve web için hızlı, sade ve ölçeklenebilir ürünler.' },
  { icon: Gamepad2, title: 'Oyun Stüdyosu', text: 'Mobil ve PC için özgün dünyalar, akıcı oynanış ve güçlü atmosfer.' },
  { icon: Megaphone, title: 'Reklamcılık', text: 'Veriyle beslenen, akılda kalan dijital kampanyalar ve içerikler.' },
  { icon: PenTool, title: 'Tasarım', text: 'Marka kimliği, arayüz tasarımı ve görsel iletişim çözümleri.' },
]

export function Services() {
  return (
    <section id="hizmetler" className="scroll-mt-16 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading eyebrow="01 — Hizmetler" title="Tek stüdyo, dört disiplin." />
        <ul className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ icon: Icon, title, text }) => (
            <li key={title} className="bg-background p-8 transition-colors hover:bg-card">
              <Icon className="size-6 text-primary" aria-hidden="true" />
              <h3 className="mt-6 font-medium">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
    </div>
  )
}
