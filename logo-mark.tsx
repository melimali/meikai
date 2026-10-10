import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * Crops the red emblem out of the full logo artwork.
 * The emblem spans roughly x 330–693, y 200–572 of the 1024px source.
 */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  const scale = size / 364
  const full = 1024 * scale

  return (
    <span
      aria-hidden="true"
      className={cn('relative inline-block shrink-0 overflow-hidden rounded-[22%]', className)}
      style={{ width: size, height: size }}
    >
      <Image
        src="/images/meikai-logo.jpeg"
        alt=""
        width={full}
        height={full}
        className="absolute max-w-none"
        style={{ width: full, height: full, left: -330 * scale, top: -202 * scale }}
      />
    </span>
  )
}
