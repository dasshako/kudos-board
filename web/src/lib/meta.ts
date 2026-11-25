export const ACCENTS: Record<string, string> = {
  amber: 'from-amber-300 to-orange-500',
  violet: 'from-violet-400 to-indigo-600',
  rose: 'from-rose-400 to-pink-600',
  sky: 'from-sky-300 to-blue-600',
  teal: 'from-teal-300 to-emerald-600',
  fuchsia: 'from-fuchsia-400 to-purple-600',
  lime: 'from-lime-300 to-emerald-500',
  orange: 'from-orange-300 to-rose-500',
  indigo: 'from-indigo-400 to-blue-700',
  emerald: 'from-emerald-300 to-teal-600',
  red: 'from-red-400 to-rose-600',
  pink: 'from-pink-300 to-fuchsia-600',
}

export type BadgeMeta = {
  id: string
  label: string
  emoji: string
  pill: string
  ring: string
}

export const BADGES: BadgeMeta[] = [
  {
    id: 'teamwork',
    label: 'Teamwork',
    emoji: '🤝',
    pill: 'bg-emerald-400/15 text-emerald-200 ring-emerald-400/30',
    ring: 'ring-emerald-400/40',
  },
  {
    id: 'innovation',
    label: 'Innovation',
    emoji: '💡',
    pill: 'bg-violet-400/15 text-violet-200 ring-violet-400/30',
    ring: 'ring-violet-400/40',
  },
  {
    id: 'kindness',
    label: 'Kindness',
    emoji: '💗',
    pill: 'bg-rose-400/15 text-rose-200 ring-rose-400/30',
    ring: 'ring-rose-400/40',
  },
  {
    id: 'impact',
    label: 'Impact',
    emoji: '⚡',
    pill: 'bg-amber-400/15 text-amber-200 ring-amber-400/30',
    ring: 'ring-amber-400/40',
  },
  {
    id: 'leadership',
    label: 'Leadership',
    emoji: '🧭',
    pill: 'bg-sky-400/15 text-sky-200 ring-sky-400/30',
    ring: 'ring-sky-400/40',
  },
  {
    id: 'craft',
    label: 'Craft',
    emoji: '✨',
    pill: 'bg-fuchsia-400/15 text-fuchsia-200 ring-fuchsia-400/30',
    ring: 'ring-fuchsia-400/40',
  },
]

export const BADGE_BY_ID: Record<string, BadgeMeta> = Object.fromEntries(
  BADGES.map((badge) => [badge.id, badge])
)

export type ThemeMeta = {
  id: string
  label: string
  line: string
  wash: string
}

export const THEMES: ThemeMeta[] = [
  {
    id: 'sunrise',
    label: 'Sunrise',
    line: 'from-amber-300 via-orange-400 to-rose-500',
    wash: 'rgba(251,146,60,0.12)',
  },
  {
    id: 'ocean',
    label: 'Ocean',
    line: 'from-cyan-300 via-sky-400 to-blue-600',
    wash: 'rgba(56,189,248,0.12)',
  },
  {
    id: 'orchid',
    label: 'Orchid',
    line: 'from-fuchsia-400 via-violet-500 to-indigo-600',
    wash: 'rgba(192,132,252,0.12)',
  },
  {
    id: 'forest',
    label: 'Forest',
    line: 'from-lime-300 via-emerald-400 to-teal-600',
    wash: 'rgba(52,211,153,0.12)',
  },
]

export const THEME_BY_ID: Record<string, ThemeMeta> = Object.fromEntries(
  THEMES.map((theme) => [theme.id, theme])
)

export const EMOJI = ['👏', '🔥', '🚀', '💜', '🙌']

export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.round(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function recipientLine(recipients: { name: string }[]) {
  const names = recipients.map((person) => person.name)
  if (names.length === 0) return ''
  if (names.length === 1) return names[0]
  if (names.length === 2) return `${names[0]} and ${names[1]}`
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}
