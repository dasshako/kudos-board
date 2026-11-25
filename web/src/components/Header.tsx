import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Plus, Sparkles } from 'lucide-react'
import Avatar from './Avatar'
import LanguagePicker from './LanguagePicker'
import ThemeToggle from './ThemeToggle'
import { useI18n } from '../lib/i18n'
import type { Person } from '../lib/types'

type Props = {
  people: Person[]
  viewer: Person
  onSwitchViewer: (id: string) => void
  onGiveKudos: () => void
}

export default function Header({ people, viewer, onSwitchViewer, onGiveKudos }: Props) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-line/10 bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-amber-300 via-orange-400 to-rose-500 text-slate-950 shadow-lg shadow-orange-500/25">
            <Sparkles size={19} strokeWidth={2.4} />
          </span>
          <div className="leading-tight">
            <p className="text-[15px] font-semibold tracking-tight">Kudos</p>
            <p className="hidden text-[11px] uppercase tracking-[0.18em] text-mist/70 sm:block">
              {t('header.tagline')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <LanguagePicker />
          <ThemeToggle />

          <div className="relative" ref={wrapperRef}>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-haspopup="listbox"
              className="focus-ring flex items-center gap-2 rounded-full border border-line/10 bg-line/[0.04] py-1 pl-1 pr-3 transition hover:border-line/25 hover:bg-line/[0.08]"
            >
              <Avatar person={viewer} size={28} />
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-[10px] uppercase tracking-[0.14em] text-mist/70">
                  {t('header.viewingAs')}
                </span>
                <span className="block text-[13px] font-medium">{viewer.name}</span>
              </span>
              <ChevronDown size={14} className="text-mist" />
            </button>

            {open && (
              <div
                role="listbox"
                className="popover absolute right-0 top-full z-50 mt-2 max-h-80 w-72 overflow-y-auto p-1.5"
              >
                <p className="px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-mist/70">
                  {t('header.whoAreYou')}
                </p>
                {people.map((person) => (
                  <button
                    key={person.id}
                    type="button"
                    role="option"
                    aria-selected={person.id === viewer.id}
                    onClick={() => {
                      onSwitchViewer(person.id)
                      setOpen(false)
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition hover:bg-line/[0.06] ${
                      person.id === viewer.id ? 'bg-line/[0.06]' : ''
                    }`}
                  >
                    <Avatar person={person} size={32} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{person.name}</span>
                      <span className="block truncate text-xs text-mist">{person.role}</span>
                    </span>
                    {person.id === viewer.id && (
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-300">
                        {t('header.you')}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onGiveKudos}
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-300 to-rose-400 px-3 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-orange-500/25 transition hover:brightness-110 active:scale-[0.98] sm:px-4"
          >
            <Plus size={16} strokeWidth={2.6} />
            <span className="hidden sm:inline">{t('header.giveKudos')}</span>
            <span className="sm:hidden">{t('header.kudosShort')}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
