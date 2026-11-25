import { ACCENTS, initials } from '../lib/meta'
import type { Person } from '../lib/types'

type Props = {
  person: Pick<Person, 'name' | 'accent'>
  size?: number
  ring?: boolean
  className?: string
}

export default function Avatar({ person, size = 40, ring = true, className = '' }: Props) {
  const gradient = ACCENTS[person.accent] || ACCENTS.violet

  return (
    <span
      aria-hidden="true"
      className={`relative inline-grid shrink-0 place-items-center rounded-full bg-gradient-to-br ${gradient} font-semibold text-slate-950 ${
        ring ? 'ring-2 ring-white/15' : ''
      } ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
    >
      {initials(person.name)}
    </span>
  )
}
