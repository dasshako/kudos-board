import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Check, Loader2 } from 'lucide-react'
import Header from './components/Header'
import Hero from './components/Hero'
import Feed from './components/Feed'
import Spotlight from './components/Spotlight'
import Composer from './components/Composer'
import Confetti from './components/Confetti'
import {
  createKudos,
  fetchKudos,
  fetchPeople,
  fetchStats,
  toggleReaction,
  type CreateKudosInput,
} from './lib/api'
import { EMOJI } from './lib/meta'
import type { Filters, Kudos, Person, Stats } from './lib/types'

const VIEWER_KEY = 'kudos.viewer'

type Toast = { kind: 'success' | 'error'; message: string }

export default function App() {
  const [people, setPeople] = useState<Person[]>([])
  const [viewerId, setViewerId] = useState<string | null>(() => localStorage.getItem(VIEWER_KEY))
  const [kudos, setKudos] = useState<Kudos[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [filters, setFilters] = useState<Filters>({ badge: 'all', q: '', sort: 'new' })
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [initialLoading, setInitialLoading] = useState(true)
  const [composerOpen, setComposerOpen] = useState(false)
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const [burst, setBurst] = useState(0)
  const [toast, setToast] = useState<Toast | null>(null)
  const [bootError, setBootError] = useState<string | null>(null)

  const viewer = people.find((person) => person.id === viewerId) ?? null

  useEffect(() => {
    fetchPeople()
      .then(setPeople)
      .catch((error: Error) => setBootError(error.message))
  }, [])

  useEffect(() => {
    if (!people.length) return
    if (!viewerId || !people.some((person) => person.id === viewerId)) {
      setViewerId(people[0].id)
    }
  }, [people, viewerId])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(filters.q), 250)
    return () => clearTimeout(timer)
  }, [filters.q])

  const loadFeed = useCallback(async () => {
    if (!viewerId) return
    try {
      const [feed, statsData] = await Promise.all([
        fetchKudos({ ...filters, q: debouncedQuery }, viewerId),
        fetchStats(),
      ])
      setKudos(feed)
      setStats(statsData)
      setBootError(null)
    } catch (error) {
      setToast({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Could not load the board.',
      })
    } finally {
      setInitialLoading(false)
    }
  }, [viewerId, filters.badge, filters.sort, debouncedQuery])

  useEffect(() => {
    loadFeed()
  }, [loadFeed])

  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') loadFeed()
    }, 15000)
    return () => clearInterval(timer)
  }, [loadFeed])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3800)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (!highlightId) return
    const timer = setTimeout(() => setHighlightId(null), 4500)
    return () => clearTimeout(timer)
  }, [highlightId])

  function switchViewer(id: string) {
    setViewerId(id)
    localStorage.setItem(VIEWER_KEY, id)
  }

  async function handleReact(kudosId: string, emoji: string) {
    if (!viewerId) return

    setKudos((current) =>
      current.map((kudo) => {
        if (kudo.id !== kudosId) return kudo
        const existing = kudo.reactions.find((reaction) => reaction.emoji === emoji)
        let reactions
        if (!existing) {
          reactions = [...kudo.reactions, { emoji, count: 1, mine: true }]
        } else if (existing.mine) {
          reactions = kudo.reactions
            .map((reaction) =>
              reaction.emoji === emoji
                ? { ...reaction, count: reaction.count - 1, mine: false }
                : reaction
            )
            .filter((reaction) => reaction.count > 0)
        } else {
          reactions = kudo.reactions.map((reaction) =>
            reaction.emoji === emoji
              ? { ...reaction, count: reaction.count + 1, mine: true }
              : reaction
          )
        }
        reactions = [...reactions].sort(
          (a, b) => EMOJI.indexOf(a.emoji) - EMOJI.indexOf(b.emoji)
        )
        return {
          ...kudo,
          reactions,
          reactionTotal: reactions.reduce((total, reaction) => total + reaction.count, 0),
        }
      })
    )

    try {
      const result = await toggleReaction(kudosId, emoji, viewerId)
      setKudos((current) =>
        current.map((kudo) =>
          kudo.id === kudosId
            ? { ...kudo, reactions: result.reactions, reactionTotal: result.reactionTotal }
            : kudo
        )
      )
      fetchStats().then(setStats).catch(() => undefined)
    } catch (error) {
      setToast({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Could not save that reaction.',
      })
      loadFeed()
    }
  }

  async function handleCreate(input: CreateKudosInput) {
    const { id } = await createKudos(input)
    setComposerOpen(false)
    setBurst((value) => value + 1)
    setToast({ kind: 'success', message: 'Kudos sent — that teammate will feel it.' })
    setFilters({ badge: 'all', q: '', sort: 'new' })
    setDebouncedQuery('')
    setHighlightId(id)

    // Refresh right away so the new kudos is on the wall without waiting for the poll.
    const [feed, statsData] = await Promise.all([
      fetchKudos({ badge: 'all', q: '', sort: 'new' }, input.senderId),
      fetchStats(),
    ])
    setKudos(feed)
    setStats(statsData)
  }

  if (bootError && people.length === 0) {
    return (
      <div className="grid min-h-screen place-items-center px-6">
        <div className="glass max-w-md p-6 text-center">
          <AlertTriangle className="mx-auto text-amber-300" size={26} />
          <h1 className="mt-3 text-lg font-semibold">The board is out of reach</h1>
          <p className="mt-1.5 text-sm text-mist">{bootError}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-full bg-line/10 px-4 py-2 text-sm font-medium transition hover:bg-line/20"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!viewer) {
    return (
      <div className="grid min-h-screen place-items-center text-mist">
        <Loader2 className="animate-spin" size={22} />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-16">
      <Header
        people={people}
        viewer={viewer}
        onSwitchViewer={switchViewer}
        onGiveKudos={() => setComposerOpen(true)}
      />

      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Hero
          stats={stats}
          onGiveKudos={() => setComposerOpen(true)}
          onSeeSpotlight={() =>
            document.getElementById('spotlight')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start">
          <Feed
            kudos={kudos}
            loading={initialLoading}
            filters={filters}
            onChange={(next) => setFilters((current) => ({ ...current, ...next }))}
            onReact={handleReact}
            highlightId={highlightId}
            onGiveKudos={() => setComposerOpen(true)}
          />
          <Spotlight stats={stats} />
        </div>

        <footer className="mt-12 flex flex-wrap items-center justify-between gap-2 border-t border-line/10 pt-5 text-[11px] text-mist/60">
          <p>Kudos · built for teams who say thanks out loud.</p>
          <p>Updates every few seconds — no refresh needed.</p>
        </footer>
      </main>

      <Composer
        open={composerOpen}
        people={people}
        viewer={viewer}
        onClose={() => setComposerOpen(false)}
        onSubmit={handleCreate}
      />

      <AnimatePresence>{burst > 0 && <Confetti key={burst} />}</AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 px-4"
          >
            <div
              role="status"
              className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm shadow-xl backdrop-blur-xl dark:shadow-lift ${
                toast.kind === 'success'
                  ? 'border-emerald-600/25 bg-emerald-50 text-emerald-800 dark:border-emerald-300/30 dark:bg-emerald-400/15 dark:text-emerald-100'
                  : 'border-rose-600/25 bg-rose-50 text-rose-800 dark:border-rose-300/30 dark:bg-rose-400/15 dark:text-rose-100'
              }`}
            >
              {toast.kind === 'success' ? <Check size={15} /> : <AlertTriangle size={15} />}
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
