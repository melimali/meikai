import { LogoMark } from '@/components/logo-mark'
import { CONTACT_EMAIL } from '@/components/contact'

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-3">
          <LogoMark size={22} />
          <span>© {new Date().getFullYear()} Meikai Digital. Tüm hakları saklıdır.</span>
        </div>
        <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors hover:text-foreground">
          {CONTACT_EMAIL}
        </a>
      </div>
    </footer>
  )
}
