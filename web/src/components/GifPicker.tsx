import { useEffect, useState } from 'react'
import { Loader2, Search, Sparkles, X } from 'lucide-react'
import { searchGifs } from '../lib/api'
import { useI18n } from '../lib/i18n'
import type { GifResult } from '../lib/types'

type Props = {
  value: string | null
  onChange: (url: string | null) => void
}

export default function GifPicker({ value, onChange }: Props) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GifResult[]>([])
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setLoading(true)
    setFailed(false)

    const timer = setTimeout(
      () => {
        searchGifs(query.trim())
          .then((items) => {
            if (!cancelled) setResults(items)
          })
          .catch(() => {
            if (cancelled) return
            setResults([])
            setFailed(true)
          })
          .finally(() => {
            if (!cancelled) setLoading(false)
          })
      },
      query ? 320 : 0
    )

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [open, query])

  function pick(url: string) {
    onChange(url)
    setOpen(false)
  }

  return (
    <section>
      <div className="flex items-baseline justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mist/80">
          {t('composer.gif')}
        </p>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="focus-ring rounded-full text-[11px] text-mist transition hover:text-fg"
          >
            {t('composer.gifRemove')}
          </button>
        )}
      </div>

      {value && (
        <img
          src={value}
          alt=""
          className="mt-2 max-h-40 rounded-xl border border-line/10"
        />
      )}

      {open ? (
        <div className="mt-2 rounded-2xl border border-line/10 bg-line/[0.03] p-2.5">
          <div className="flex items-center gap-2">
            <label className="relative block flex-1">
              <span className="sr-only">{t('composer.gifSearch')}</span>
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist/70"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('composer.gifSearchPlaceholder')}
                className="field focus-ring w-full rounded-xl py-2 pl-9 pr-3 text-sm"
              />
            </label>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t('common.close')}
              className="focus-ring rounded-full p-1.5 text-mist transition hover:bg-line/10 hover:text-fg"
            >
              <X size={16} />
            </button>
          </div>

          <div className="mt-2 max-h-56 overflow-y-auto">
            {loading && (
              <p className="flex items-center justify-center gap-2 py-6 text-xs text-mist">
                <Loader2 size={14} className="animate-spin" />
                {t('composer.gifLoading')}
              </p>
            )}
            {!loading && failed && (
              <p className="py-6 text-center text-xs text-mist">{t('composer.gifError')}</p>
            )}
            {!loading && !failed && results.length === 0 && (
              <p className="py-6 text-center text-xs text-mist">{t('composer.gifEmpty')}</p>
            )}
            {!loading && results.length > 0 && (
              <div className="grid grid-cols-3 gap-1.5">
                {results.map((gif) => (
                  <button
                    key={gif.id}
                    type="button"
                    onClick={() => pick(gif.url)}
                    title={gif.title}
                    className={`focus-ring overflow-hidden rounded-lg border transition ${
                      value === gif.url
                        ? 'border-amber-500/60 ring-1 ring-amber-500/40 dark:border-amber-300/60'
                        : 'border-line/10 hover:border-line/30'
                    }`}
                  >
                    <img
                      src={gif.url}
                      alt={gif.title}
                      loading="lazy"
                      className="h-24 w-full bg-line/[0.04] object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="focus-ring mt-2 inline-flex items-center gap-2 rounded-full border border-line/10 px-3 py-1.5 text-xs text-mist transition hover:border-line/25 hover:text-fg"
        >
          <Sparkles size={14} />
          {value ? t('composer.gifChange') : t('composer.gifAdd')}
        </button>
      )}
    </section>
  )
}
