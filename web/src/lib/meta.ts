import type { Translate } from './i18n'

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
    pill: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/15 dark:text-emerald-200 dark:ring-emerald-400/30',
    ring: 'ring-emerald-500/50 dark:ring-emerald-400/50',
  },
  {
    id: 'innovation',
    label: 'Innovation',
    emoji: '💡',
    pill: 'bg-violet-50 text-violet-700 ring-violet-600/20 dark:bg-violet-400/15 dark:text-violet-200 dark:ring-violet-400/30',
    ring: 'ring-violet-500/50 dark:ring-violet-400/50',
  },
  {
    id: 'kindness',
    label: 'Kindness',
    emoji: '💗',
    pill: 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-400/15 dark:text-rose-200 dark:ring-rose-400/30',
    ring: 'ring-rose-500/50 dark:ring-rose-400/50',
  },
  {
    id: 'impact',
    label: 'Impact',
    emoji: '⚡',
    pill: 'bg-amber-50 text-amber-800 ring-amber-600/20 dark:bg-amber-400/15 dark:text-amber-200 dark:ring-amber-400/30',
    ring: 'ring-amber-500/50 dark:ring-amber-400/50',
  },
  {
    id: 'leadership',
    label: 'Leadership',
    emoji: '🧭',
    pill: 'bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-400/15 dark:text-sky-200 dark:ring-sky-400/30',
    ring: 'ring-sky-500/50 dark:ring-sky-400/50',
  },
  {
    id: 'craft',
    label: 'Craft',
    emoji: '✨',
    pill: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-600/20 dark:bg-fuchsia-400/15 dark:text-fuchsia-200 dark:ring-fuchsia-400/30',
    ring: 'ring-fuchsia-500/50 dark:ring-fuchsia-400/50',
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

export type TextColorMeta = {
  id: string
  swatch: string
  text: string
  body: string
}

// Card text colours: one pair per colour so the ink stays readable on both the
// light card and the dark one. `text` styles names, `body` the kudos message.
export const TEXT_COLORS: TextColorMeta[] = [
  { id: 'default', swatch: 'bg-fg', text: 'text-fg', body: 'text-fg/95' },
  {
    id: 'violet',
    swatch: 'bg-violet-500',
    text: 'text-violet-700 dark:text-violet-200',
    body: 'text-violet-800 dark:text-violet-200',
  },
  {
    id: 'blue',
    swatch: 'bg-sky-500',
    text: 'text-sky-700 dark:text-sky-200',
    body: 'text-sky-800 dark:text-sky-200',
  },
  {
    id: 'emerald',
    swatch: 'bg-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-200',
    body: 'text-emerald-800 dark:text-emerald-200',
  },
  {
    id: 'amber',
    swatch: 'bg-amber-500',
    text: 'text-amber-700 dark:text-amber-200',
    body: 'text-amber-800 dark:text-amber-200',
  },
  {
    id: 'rose',
    swatch: 'bg-rose-500',
    text: 'text-rose-700 dark:text-rose-200',
    body: 'text-rose-800 dark:text-rose-200',
  },
]

export function textColorOf(id: string | null | undefined) {
  return TEXT_COLORS.find((color) => color.id === id) ?? TEXT_COLORS[0]
}

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

export function timeAgo(iso: string, t: Translate, locale: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.round(diff / 60000)
  if (minutes < 1) return t('time.justNow')
  if (minutes < 60) return t('time.minutes', { count: minutes })
  const hours = Math.round(minutes / 60)
  if (hours < 24) return t('time.hours', { count: hours })
  const days = Math.round(hours / 24)
  if (days < 7) return t('time.days', { count: days })
  return new Date(iso).toLocaleDateString(locale, { month: 'short', day: 'numeric' })
}

export function recipientLine(recipients: { name: string }[], andWord: string) {
  const names = recipients.map((person) => person.name)
  if (names.length === 0) return ''
  if (names.length === 1) return names[0]
  if (names.length === 2) return `${names[0]} ${andWord} ${names[1]}`
  return `${names.slice(0, -1).join(', ')} ${andWord} ${names[names.length - 1]}`
}
