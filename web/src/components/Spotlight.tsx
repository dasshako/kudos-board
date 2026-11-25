import { Trophy } from 'lucide-react'
import Avatar from './Avatar'
import { BADGE_BY_ID } from '../lib/meta'
import type { Stats } from '../lib/types'

export default function Spotlight({ stats }: { stats: Stats | null }) {
  const leaderboard = stats?.leaderboard ?? []
  const max = Math.max(1, ...leaderboard.map((entry) => entry.received))
  const categories = stats?.categories ?? []
  const categoryTotal = Math.max(1, categories.reduce((total, item) => total + item.count, 0))

  return (
    <aside id="spotlight" className="space-y-4 lg:sticky lg:top-24">
      <div className="glass p-5">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-amber-300/25 to-rose-400/25 text-amber-200 ring-1 ring-inset ring-white/10">
            <Trophy size={15} />
          </span>
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Spotlight</h2>
            <p className="text-[11px] text-mist">Most appreciated, all time</p>
          </div>
        </div>

        <ol className="mt-4 space-y-3">
          {leaderboard.length === 0 && (
            <li className="rounded-xl border border-dashed border-white/10 px-3 py-4 text-center text-xs text-mist">
              No kudos yet — the spotlight is wide open.
            </li>
          )}
          {leaderboard.map((entry, index) => (
            <li key={entry.id} className="flex items-center gap-3">
              <span
                className={`w-4 shrink-0 text-center text-xs font-semibold tabular-nums ${
                  index === 0 ? 'text-amber-300' : 'text-mist/60'
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
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
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
        <h2 className="text-sm font-semibold tracking-tight">What we celebrate</h2>
        <p className="text-[11px] text-mist">Kudos by badge</p>

        <ul className="mt-4 space-y-2.5">
          {categories.length === 0 && (
            <li className="text-xs text-mist">Nothing yet — the first kudos sets the tone.</li>
          )}
          {categories.map((item) => {
            const badge = BADGE_BY_ID[item.badge]
            if (!badge) return null
            return (
              <li key={item.badge}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200">
                    <span aria-hidden="true">{badge.emoji}</span> {badge.label}
                  </span>
                  <span className="tabular-nums text-mist">{item.count}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-400/80 to-sky-400/80"
                    style={{ width: `${Math.max(6, (item.count / categoryTotal) * 100)}%` }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="rounded-3xl border border-amber-300/20 bg-gradient-to-br from-amber-300/[0.09] to-rose-400/[0.05] p-5">
        <p className="font-display text-[15px] leading-relaxed text-slate-100/90">
          “People will forget what you said, forget what you did, but never forget how you made
          them feel.”
        </p>
        <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-mist/70">Maya Angelou</p>
      </div>
    </aside>
  )
}
