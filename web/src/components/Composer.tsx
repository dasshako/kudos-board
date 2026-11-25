import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Search, X } from 'lucide-react'
import Avatar from './Avatar'
import { BADGES, THEMES, recipientLine } from '../lib/meta'
import type { CreateKudosInput } from '../lib/api'
import type { Person } from '../lib/types'

type Props = {
  open: boolean
  people: Person[]
  viewer: Person
  onClose: () => void
  onSubmit: (input: CreateKudosInput) => Promise<void>
}

export default function Composer({ open, people, viewer, onClose, onSubmit }: Props) {
  const [recipientIds, setRecipientIds] = useState<string[]>([])
  const [badge, setBadge] = useState('teamwork')
  const [theme, setTheme] = useState('sunrise')
  const [message, setMessage] = useState('')
  const [query, setQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    setRecipientIds([])
    setBadge('teamwork')
    setTheme('sunrise')
    setMessage('')
    setQuery('')
    setError(null)
    setSubmitting(false)
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  const colleagues = useMemo(() => people.filter((person) => person.id !== viewer.id), [people, viewer.id])
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return colleagues
    return colleagues.filter(
      (person) =>
        person.name.toLowerCase().includes(needle) ||
        person.team.toLowerCase().includes(needle) ||
        person.role.toLowerCase().includes(needle)
    )
  }, [colleagues, query])

  const selected = colleagues.filter((person) => recipientIds.includes(person.id))
  const trimmed = message.trim()
  const valid = recipientIds.length > 0 && trimmed.length >= 10 && trimmed.length <= 500

  function toggleRecipient(id: string) {
    setRecipientIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    )
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!valid || submitting) {
      if (!valid) setError('Add a teammate and at least 10 characters to send this kudos.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit({ senderId: viewer.id, recipientIds, message: trimmed, badge, theme })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not send that kudos.')
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 backdrop-blur-sm sm:items-center sm:p-6"
        >
          <motion.form
            role="dialog"
            aria-modal="true"
            aria-labelledby="composer-title"
            onClick={(event) => event.stopPropagation()}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 28, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.985 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[#0d0b1e]/95 shadow-lift sm:rounded-3xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/5 px-5 py-4 sm:px-6">
              <div>
                <h2 id="composer-title" className="text-base font-semibold tracking-tight">
                  Give kudos
                </h2>
                <p className="text-xs text-mist">
                  Say it out loud — the whole team will see it.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="focus-ring rounded-full p-1.5 text-mist transition hover:bg-white/10 hover:text-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
              <section>
                <div className="flex items-baseline justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mist/80">
                    Who deserves it
                  </p>
                  <span className="text-[11px] text-mist">
                    {recipientIds.length} selected
                  </span>
                </div>

                <label className="relative mt-2 block">
                  <span className="sr-only">Search teammates</span>
                  <Search
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist/70"
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Find a teammate…"
                    className="focus-ring w-full rounded-xl border border-white/10 bg-white/[0.04] py-2 pl-9 pr-3 text-sm placeholder:text-mist/60"
                  />
                </label>

                <div className="mt-2 grid max-h-52 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                  {filtered.length === 0 && (
                    <p className="col-span-full py-4 text-center text-xs text-mist">
                      No teammate matches “{query}”.
                    </p>
                  )}
                  {filtered.map((person) => {
                    const active = recipientIds.includes(person.id)
                    return (
                      <button
                        key={person.id}
                        type="button"
                        onClick={() => toggleRecipient(person.id)}
                        aria-pressed={active}
                        className={`focus-ring flex items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition ${
                          active
                            ? 'border-amber-300/50 bg-amber-300/10'
                            : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]'
                        }`}
                      >
                        <Avatar person={person} size={30} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-medium">{person.name}</span>
                          <span className="block truncate text-[11px] text-mist">{person.team}</span>
                        </span>
                        {active && <Check size={15} className="shrink-0 text-amber-300" />}
                      </button>
                    )
                  })}
                </div>
              </section>

              <section>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mist/80">
                  What are you celebrating
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {BADGES.map((item) => {
                    const active = badge === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setBadge(item.id)}
                        aria-pressed={active}
                        className={`focus-ring flex items-center gap-2 rounded-xl border px-2.5 py-2 text-left text-[13px] transition ${
                          active
                            ? `border-transparent bg-white/[0.09] ring-1 ring-inset ${item.ring}`
                            : 'border-white/10 bg-white/[0.03] text-mist hover:border-white/25 hover:text-slate-200'
                        }`}
                      >
                        <span aria-hidden="true">{item.emoji}</span>
                        <span className="font-medium">{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              </section>

              <section>
                <div className="flex items-baseline justify-between">
                  <label
                    htmlFor="kudos-message"
                    className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mist/80"
                  >
                    Your message
                  </label>
                  <span
                    className={`text-[11px] tabular-nums ${
                      message.length > 500 ? 'text-rose-300' : 'text-mist'
                    }`}
                  >
                    {message.length}/500
                  </span>
                </div>
                <textarea
                  id="kudos-message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={4}
                  maxLength={520}
                  placeholder="Be specific — what did they do, and why did it matter?"
                  className="focus-ring mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm leading-relaxed placeholder:text-mist/60"
                />
              </section>

              <section>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mist/80">
                  Card style
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {THEMES.map((item) => {
                    const active = theme === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setTheme(item.id)}
                        aria-pressed={active}
                        className={`focus-ring flex items-center gap-2 rounded-full border px-2 py-1.5 pr-3 text-xs transition ${
                          active
                            ? 'border-white/40 bg-white/[0.08] text-slate-100'
                            : 'border-white/10 text-mist hover:border-white/25'
                        }`}
                      >
                        <span
                          className={`h-5 w-5 rounded-full bg-gradient-to-br ${item.line} ${
                            active ? 'ring-2 ring-white/50' : ''
                          }`}
                        />
                        {item.label}
                      </button>
                    )
                  })}
                </div>
              </section>

              <section aria-live="polite" className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-mist/70">Preview</p>
                <div className="mt-2 flex items-center gap-2 text-[13px]">
                  <Avatar person={viewer} size={24} />
                  <span className="text-mist">
                    <span className="text-slate-100">{viewer.name.split(' ')[0]}</span> celebrated{' '}
                    <span className="text-slate-100">
                      {selected.length ? recipientLine(selected) : '…'}
                    </span>
                  </span>
                </div>
                <p className="font-display mt-2 line-clamp-3 text-[15px] leading-relaxed text-slate-100/90">
                  {trimmed || 'Your words of appreciation will appear here.'}
                </p>
              </section>
            </div>

            <div className="border-t border-white/5 px-5 py-4 sm:px-6">
              {error && (
                <p role="alert" className="mb-2 text-xs text-rose-300">
                  {error}
                </p>
              )}
              <div className="flex items-center justify-between gap-3">
                <p className="hidden text-[11px] text-mist sm:block">
                  Posted publicly to the team wall.
                </p>
                <div className="flex items-center gap-2 sm:ml-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="focus-ring rounded-full border border-white/10 px-4 py-2.5 text-sm text-mist transition hover:border-white/25 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!valid || submitting}
                    className="focus-ring inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-300 to-rose-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-orange-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                  >
                    {submitting ? 'Sending…' : 'Post kudos'}
                  </button>
                </div>
              </div>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
