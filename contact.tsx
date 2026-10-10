import { Mail } from 'lucide-react'

export const CONTACT_EMAIL = 'hello@meikaidigital.com'

export function Contact() {
  return (
    <section id="iletisim" className="scroll-mt-16 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-28 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">03 — İletişim</p>
        <h2 className="mt-3 max-w-xl text-balance text-2xl font-semibold tracking-tight sm:text-4xl">
          Bir projeniz mi var? Birlikte üretelim.
        </h2>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-10 inline-flex items-center gap-3 border-b border-border pb-2 text-xl font-medium transition-colors hover:border-primary hover:text-primary sm:text-3xl"
        >
          <Mail className="size-6 text-primary" aria-hidden="true" />
          {CONTACT_EMAIL}
        </a>
      </div>
    </section>
  )
}
