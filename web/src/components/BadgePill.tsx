import { BADGE_BY_ID } from '../lib/meta'

export default function BadgePill({ id, size = 'sm' }: { id: string; size?: 'sm' | 'md' }) {
  const badge = BADGE_BY_ID[id]
  if (!badge) return null

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ring-1 ring-inset ${badge.pill} ${
        size === 'md' ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'
      } font-medium`}
    >
      <span aria-hidden="true">{badge.emoji}</span>
      {badge.label}
    </span>
  )
}
