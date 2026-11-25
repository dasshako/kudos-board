import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Search, X } from 'lucide-react'
import Avatar from './Avatar'
import GifPicker from './GifPicker'
import { BADGES, TEXT_COLORS, THEMES, recipientLine, textColorOf } from '../lib/meta'
import { useI18n } from '../lib/i18n'
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
  const { t } = useI18n()
  const [recipientIds, setRecipientIds] = useState<string[]>([])
  const [badge, setBadge] = useState('teamwork')
  const [theme, setTheme] = useState('sunrise')
  const [textColor, setTextColor] = useState('default')
  const [gifUrl, setGifUrl] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [query, setQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    setRecipientIds([])
    setBadge('teamwork')
    setTheme('sunrise')
    setTextColor('default')
    setGifUrl(null)
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
  const color = textColorOf(textColor)

  function toggleRecipient(id: string) {
    setRecipientIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    )
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!valid || submitting) {
      if (!valid) setError(t('composer.errorInvalid'))
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit({
        senderId: viewer.id,
        recipientIds,
        message: trimmed,
        badge,
        theme,
        textColor,
        gifUrl,
      })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t('composer.errorGeneric'))
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
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 backdrop-blur-sm sm:items-center sm:p-6 dark:bg-black/65"
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
            className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-line/10 bg-white/95 shadow-2xl sm:rounded-3xl dark:bg-[#0d0b1e]/95 dark:shadow-lift"
          >
            <div className="flex items-start justify-between gap-4 border-b border-line/10 px-5 py-4 sm:px-6">
              <div>
                <h2 id="composer-title" className="text-base font-semibold tracking-tight">
                  {t('composer.title')}
                </h2>
                <p className="text-xs text-mist">{t('composer.subtitle')}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t('common.close')}
                className="focus-ring rounded-full p-1.5 text-mist transition hover:bg-line/10 hover:text-fg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
              <section>
                <div className="flex items-baseline justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mist/80">
                    {t('composer.whoDeserves')}
                  </p>
                  <span className="text-[11px] text-mist">
                    {t('composer.selected', { count: recipientIds.length })}
                  </span>
                </div>

                <label className="relative mt-2 block">
                  <span className="sr-only">{t('composer.searchTeammates')}</span>
                  <Search
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist/70"
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={t('composer.findPlaceholder')}
                    className="field focus-ring w-full rounded-xl py-2 pl-9 pr-3 text-sm"
                  />
                </label>

                <div className="mt-2 grid max-h-52 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                  {filtered.length === 0 && (
                    <p className="col-span-full py-4 text-center text-xs text-mist">
                      {t('composer.noMatch', { query })}
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
                            ? 'border-amber-500/40 bg-amber-100 dark:border-amber-300/50 dark:bg-amber-300/10'
                            : 'border-line/10 bg-line/[0.03] hover:border-line/25 hover:bg-line/[0.06]'
                        }`}
                      >
                        <Avatar person={person} size={30} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-medium">{person.name}</span>
                          <span className="block truncate text-[11px] text-mist">{person.team}</span>
                        </span>
                        {active && (
                          <Check size={15} className="shrink-0 text-amber-600 dark:text-amber-300" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </section>

              <section>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mist/80">
                  {t('composer.whatCelebrating')}
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
                            ? `border-transparent bg-line/[0.09] ring-1 ring-inset ${item.ring}`
                            : 'border-line/10 bg-line/[0.03] text-mist hover:border-line/25 hover:text-fg'
                        }`}
                      >
                        <span aria-hidden="true">{item.emoji}</span>
                        <span className="font-medium">{t(`badge.${item.id}`)}</span>
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
                    {t('composer.yourMessage')}
                  </label>
                  <span
                    className={`text-[11px] tabular-nums ${
                      message.length > 500 ? 'text-rose-600 dark:text-rose-300' : 'text-mist'
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
                  placeholder={t('composer.messagePlaceholder')}
                  className="field focus-ring mt-2 w-full resize-none rounded-xl px-3 py-2.5 text-sm leading-relaxed"
                />
              </section>

              <section>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mist/80">
                  {t('composer.cardStyle')}
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
                            ? 'border-line/30 bg-line/[0.06] text-fg dark:border-white/40 dark:bg-white/[0.08] dark:text-slate-100'
                            : 'border-line/10 text-mist hover:border-line/25'
                        }`}
                      >
                        <span
                          className={`h-5 w-5 rounded-full bg-gradient-to-br ${item.line} ${
                            active ? 'ring-2 ring-amber-500/50 dark:ring-white/50' : ''
                          }`}
                        />
                        {t(`cardTheme.${item.id}`)}
                      </button>
                    )
                  })}
                </div>
              </section>

              <section>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mist/80">
                  {t('composer.textColor')}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {TEXT_COLORS.map((item) => {
                    const active = textColor === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setTextColor(item.id)}
                        aria-pressed={active}
                        aria-label={t(`color.${item.id}`)}
                        title={t(`color.${item.id}`)}
                        className={`focus-ring grid h-9 w-9 place-items-center rounded-full border transition ${
                          active
                            ? 'border-line/40 ring-2 ring-amber-500/50 dark:border-white/40 dark:ring-white/50'
                            : 'border-line/10 hover:border-line/30'
                        }`}
                      >
                        <span className={`h-5 w-5 rounded-full ${item.swatch}`} />
                      </button>
                    )
                  })}
                </div>
              </section>

              <GifPicker value={gifUrl} onChange={setGifUrl} />

              <section aria-live="polite" className="rounded-2xl border border-line/10 bg-line/[0.03] p-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-mist/70">
                  {t('composer.preview')}
                </p>
                <div className={`mt-2 flex items-center gap-2 text-[13px] ${color.text}`}>
                  <Avatar person={viewer} size={24} />
                  <span>
                    <span className="font-medium">{viewer.name.split(' ')[0]}</span>{' '}
                    {t('card.celebrated')}{' '}
                    <span className="font-medium">
                      {selected.length ? recipientLine(selected, t('common.and')) : '…'}
                    </span>
                  </span>
                </div>
                <p className={`font-display mt-2 line-clamp-3 text-[15px] leading-relaxed ${color.body}`}>
                  {trimmed || t('composer.previewPlaceholder')}
                </p>
                {gifUrl && (
                  <img
                    src={gifUrl}
                    alt=""
                    className="mt-2 max-h-28 rounded-lg border border-line/10"
                  />
                )}
              </section>
            </div>

            <div className="border-t border-line/10 px-5 py-4 sm:px-6">
              {error && (
                <p role="alert" className="mb-2 text-xs text-rose-600 dark:text-rose-300">
                  {error}
                </p>
              )}
              <div className="flex items-center justify-between gap-3">
                <p className="hidden text-[11px] text-mist sm:block">
                  {t('composer.postedPublicly')}
                </p>
                <div className="flex items-center gap-2 sm:ml-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="focus-ring rounded-full border border-line/10 px-4 py-2.5 text-sm text-mist transition hover:border-line/25 hover:text-fg"
                  >
                    {t('composer.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={!valid || submitting}
                    className="focus-ring inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-300 to-rose-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-orange-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                  >
                    {submitting ? t('composer.sending') : t('composer.post')}
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
