import { LogoMark } from '@/components/logo-mark'

const links = [
  { href: '#hizmetler', label: 'Hizmetler' },
  { href: '#projeler', label: 'Projeler' },
  { href: '#iletisim', label: 'İletişim' },
]

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-3" aria-label="Meikai Digital ana sayfa">
          <LogoMark size={28} />
          <span className="text-sm font-semibold tracking-[0.25em]">
            MEIKAI <span className="font-normal text-muted-foreground">DIGITAL</span>
          </span>
        </a>
        <nav aria-label="Ana menü">
          <ul className="flex items-center gap-6 text-sm text-muted-foreground">
            {links.map((link) => (
              <li key={link.href} className="hidden sm:block">
                <a href={link.href} className="transition-colors hover:text-foreground">
                  {link.label}
                </a>
              </li>
            ))}
            <li className="sm:hidden">
              <a href="#iletisim" className="transition-colors hover:text-foreground">
                İletişim
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
