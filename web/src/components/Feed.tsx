import { Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import KudosCard from './KudosCard'
import { BADGES } from '../lib/meta'
import type { Filters, Kudos, Sort } from '../lib/types'

type Props = {
  kudos: Kudos[]
  loading: boolean
  filters: Filters
  onChange: (next: Partial<Filters>) => void
  onReact: (kudosId: string, emoji: string) => void
  highlightId: string | null
  onGiveKudos: () => void
}

const SORTS: { id: Sort; label: string }[] = [
  { id: 'new', label: 'Newest' },
  { id: 'top', label: 'Most loved' },
]

export default function Feed({
  kudos,
  loading,
  filters,
  onChange,
  onReact,
  highlightId,
  onGiveKudos,
}: Props) {
  return (
    <section aria-label="Kudos wall" className="min-w-0">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">The wall</h2>
          <p className="text-sm text-mist">
            {loading ? 'Gathering the latest…' : `${kudos.length} in view`}
          </p>
        </div>

        <div
          role="group"
          aria-label="Sort kudos"
          className="inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1"
        >
          {SORTS.map((sort) => (
            <button
              key={sort.id}
              type="button"
              onClick={() => onChange({ sort: sort.id })}
              aria-pressed={filters.sort === sort.id}
              className={`focus-ring rounded-full px-3 py-1.5 text-xs font-medium transition ${
                filters.sort === sort.id
                  ? 'bg-white/10 text-slate-100 shadow-sm'
                  : 'text-mist hover:text-slate-200'
              }`}
            >
              {sort.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <label className="relative block">
          <span className="sr-only">Search kudos by teammate or message</span>
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mist/70"
          />
          <input
            type="search"
            value={filters.q}
            onChange={(event) => onChange({ q: event.target.value })}
            placeholder="Search a name or a word…"
            className="focus-ring w-full rounded-full border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder:text-mist/60 transition hover:border-white/20 focus:border-amber-300/40"
          />
        </label>

        <div className="no-scrollbar -mx-1 flex items-center gap-1.5 overflow-x-auto px-1 pb-1">
          <span className="mr-1 hidden shrink-0 items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-mist/70 sm:flex">
            <SlidersHorizontal size={12} />
            Filter
          </span>
          <FilterChip
            active={filters.badge === 'all'}
            onClick={() => onChange({ badge: 'all' })}
            label="All"
          />
          {BADGES.map((badge) => (
            <FilterChip
              key={badge.id}
              active={filters.badge === badge.id}
              onClick={() => onChange({ badge: badge.id })}
              label={`${badge.emoji} ${badge.label}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {loading && kudos.length === 0 ? (
          <SkeletonList />
        ) : kudos.length === 0 ? (
          <EmptyState onGiveKudos={onGiveKudos} hasFilters={filters.badge !== 'all' || filters.q !== ''} />
        ) : (
          kudos.map((kudo, index) => (
            <KudosCard
              key={kudo.id}
              kudos={kudo}
              index={index}
              highlighted={kudo.id === highlightId}
              onReact={onReact}
            />
          ))
        )}
      </div>
    </section>
  )
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`focus-ring shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? 'border-amber-300/50 bg-amber-300/15 text-amber-100'
          : 'border-white/10 bg-white/[0.03] text-mist hover:border-white/25 hover:text-slate-200'
      }`}
    >
      {label}
    </button>
  )
}

function SkeletonList() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((index) => (
        <div key={index} className="glass overflow-hidden">
          <div className="h-1 w-full animate-shimmer bg-gradient-to-r from-white/10 via-white/25 to-white/10 bg-[length:200%_100%]" />
          <div className="space-y-3 p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/10" />
              <div className="space-y-2">
                <div className="h-3 w-32 rounded-full bg-white/10" />
                <div className="h-3 w-24 rounded-full bg-white/5" />
              </div>
            </div>
            <div className="h-3 w-full rounded-full bg-white/5" />
            <div className="h-3 w-4/5 rounded-full bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ onGiveKudos, hasFilters }: { onGiveKudos: () => void; hasFilters: boolean }) {
  return (
    <div className="glass flex flex-col items-center px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-amber-300/20 to-rose-400/20 text-amber-200 ring-1 ring-inset ring-white/10">
        <Sparkles size={24} />
      </span>
      <h3 className="mt-4 text-base font-semibold">
        {hasFilters ? 'Nothing matches that yet' : 'The wall is waiting for its first kudos'}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-mist">
        {hasFilters
          ? 'Try a different badge or clear the search to see the whole wall.'
          : 'Be the first to make someone’s day — a few honest words go a long way.'}
      </p>
      <button
        type="button"
        onClick={onGiveKudos}
        className="focus-ring mt-5 rounded-full bg-gradient-to-r from-amber-300 to-rose-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110"
      >
        Give kudos
      </button>
    </div>
  )
}
