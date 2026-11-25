import { Trophy } from 'lucide-react'
import Avatar from './Avatar'
import { BADGE_BY_ID } from '../lib/meta'
import { useI18n } from '../lib/i18n'
import type { Stats } from '../lib/types'

export default function Spotlight({ stats }: { stats: Stats | null }) {
  const { t } = useI18n()
  const leaderboard = stats?.leaderboard ?? []
  const max = Math.max(1, ...leaderboard.map((entry) => entry.received))
  const categories = stats?.categories ?? []
  const categoryTotal = Math.max(1, categories.reduce((total, item) => total + item.count, 0))

  return (
    <aside id="spotlight" className="space-y-4 lg:sticky lg:top-24">
      <div className="glass p-5">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-amber-200/80 to-rose-200/80 text-amber-700 ring-1 ring-inset ring-line/10 dark:from-amber-300/25 dark:to-rose-400/25 dark:text-amber-200">
            <Trophy size={15} />
          </span>
          <div>
            <h2 className="text-sm font-semibold tracking-tight">{t('spotlight.title')}</h2>
            <p className="text-[11px] text-mist">{t('spotlight.subtitle')}</p>
          </div>
        </div>

        <ol className="mt-4 space-y-3">
          {leaderboard.length === 0 && (
            <li className="rounded-xl border border-dashed border-line/15 px-3 py-4 text-center text-xs text-mist">
              {t('spotlight.empty')}
            </li>
          )}
          {leaderboard.map((entry, index) => (
            <li key={entry.id} className="flex items-center gap-3">
              <span
                className={`w-4 shrink-0 text-center text-xs font-semibold tabular-nums ${
                  index === 0 ? 'text-amber-600 dark:text-amber-300' : 'text-mist/60'
                }`}
              >
                {index + 1}
              </span>
              <Avatar person={entry} size={32} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-[13px] font-medium">{entry.name}</p>
                  <span className="shrink-0 text-[11px] tabular-nums text-mist">
                    {entry.received}
                  </span>
                </div>
                <div className="track mt-1 h-1.5 overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-300 to-rose-400"
                    style={{ width: `${Math.max(6, (entry.received / max) * 100)}%` }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="glass p-5">
        <h2 className="text-sm font-semibold tracking-tight">{t('spotlight.categoriesTitle')}</h2>
        <p className="text-[11px] text-mist">{t('spotlight.categoriesSubtitle')}</p>

        <ul className="mt-4 space-y-2.5">
          {categories.length === 0 && (
            <li className="text-xs text-mist">{t('spotlight.categoriesEmpty')}</li>
          )}
          {categories.map((item) => {
            const badge = BADGE_BY_ID[item.badge]
            if (!badge) return null
            return (
              <li key={item.badge}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-fg">
                    <span aria-hidden="true">{badge.emoji}</span> {t(`badge.${badge.id}`)}
                  </span>
                  <span className="tabular-nums text-mist">{item.count}</span>
                </div>
                <div className="track mt-1.5 h-1.5 overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-sky-500 dark:from-violet-400/80 dark:to-sky-400/80"
                    style={{ width: `${Math.max(6, (item.count / categoryTotal) * 100)}%` }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-100/80 to-rose-100/60 p-5 dark:border-amber-300/20 dark:from-amber-300/[0.09] dark:to-rose-400/[0.05]">
        <p className="font-display text-[15px] leading-relaxed text-fg/90">
          {t('spotlight.quote')}
        </p>
        <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-mist/70">
          {t('spotlight.quoteAuthor')}
        </p>
      </div>
    </aside>
  )
}
