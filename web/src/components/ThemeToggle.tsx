import { useCallback, useEffect, useState } from 'react'
import { Check, Monitor, Moon, Sun } from 'lucide-react'
import { useI18n } from '../lib/i18n'
import { useDismiss } from '../lib/useDismiss'

type Mode = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'kudos.theme'

const MODES: { id: Mode; icon: typeof Sun }[] = [
  { id: 'light', icon: Sun },
  { id: 'dark', icon: Moon },
  { id: 'system', icon: Monitor },
]

function readMode(): Mode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  } catch {
    /* storage can be unavailable */
  }
  return 'system'
}

function prefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyMode(mode: Mode) {
  const dark = mode === 'dark' || (mode === 'system' && prefersDark())
  document.documentElement.classList.toggle('dark', dark)
}

export default function ThemeToggle() {
  const { t } = useI18n()
  const [mode, setMode] = useState<Mode>(readMode)
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const wrapperRef = useDismiss(open, close)

  useEffect(() => {
    applyMode(mode)
    try {
      localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      /* storage can be unavailable; the choice still applies for this visit */
    }
  }, [mode])

  useEffect(() => {
    if (mode !== 'system') return
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyMode('system')
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [mode])

  const labels: Record<Mode, string> = {
    light: t('theme.light'),
    dark: t('theme.dark'),
    system: t('theme.system'),
  }
  const CurrentIcon = mode === 'dark' ? Moon : mode === 'light' ? Sun : Monitor

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`${t('theme.label')}: ${labels[mode]}`}
        title={`${t('theme.label')}: ${labels[mode]}`}
        className="focus-ring grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line/10 bg-line/[0.04] text-mist transition hover:border-line/25 hover:bg-line/[0.08] hover:text-fg sm:h-9 sm:w-9"
      >
        <CurrentIcon size={16} />
      </button>

      {open && (
        <div role="menu" className="popover absolute right-0 top-full z-50 mt-2 w-56 p-1.5">
          <p className="px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-mist/70">
            {t('theme.label')}
          </p>
          {MODES.map(({ id, icon: Icon }) => {
            const active = mode === id
            return (
              <button
                key={id}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setMode(id)
                  close()
                }}
                className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition hover:bg-line/[0.06] ${
                  active ? 'bg-line/[0.06]' : ''
                }`}
              >
                <Icon size={15} className="shrink-0 text-mist" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{labels[id]}</span>
                  {id === 'system' && (
                    <span className="block text-[11px] text-mist">{t('theme.systemHint')}</span>
                  )}
                </span>
                {active && (
                  <Check size={14} className="shrink-0 text-amber-600 dark:text-amber-300" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
