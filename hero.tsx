import Image from 'next/image'
import { ArrowDown } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 pt-16 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[140px]"
      />

      <div className="relative flex flex-col items-center">
        <Image
          src="/images/meikai-logo.jpeg"
          alt="Meikai logosu"
          width={1024}
          height={1024}
          priority
          className="-my-4 size-44 sm:size-56 [mask-image:radial-gradient(circle,black_55%,transparent_72%)]"
        />

        <p className="mt-2 font-mono text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Uygulama · Oyun · Reklam · Tasarım
        </p>

        <h1 className="mt-6 max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Fikirleri dijital deneyimlere dönüştüren çok yönlü stüdyo.
        </h1>

        <p className="mt-5 max-w-lg text-pretty leading-relaxed text-muted-foreground">
          Meikai Digital; mobil uygulamalar, oyunlar, reklam kampanyaları ve marka kimlikleri
          tasarlayıp geliştirir.
        </p>

        <a
          href="#projeler"
          className="group mt-10 inline-flex items-center gap-3 rounded-full bg-primary px-10 py-5 text-base font-medium text-primary-foreground shadow-[0_0_40px_-8px] shadow-primary/60 transition-all hover:scale-[1.03] hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 sm:px-12 sm:text-lg"
        >
          Yeni projelerimizi keşfedin
          <ArrowDown
            className="size-5 transition-transform group-hover:translate-y-0.5"
            aria-hidden="true"
          />
        </a>
      </div>
    </section>
  )
}
