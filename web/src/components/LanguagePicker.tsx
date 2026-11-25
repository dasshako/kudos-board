import { useCallback, useState } from 'react'
import { Check, Languages } from 'lucide-react'
import { LANGUAGES, useI18n } from '../lib/i18n'
import { useDismiss } from '../lib/useDismiss'

export default function LanguagePicker() {
  const { lang, setLang, t } = useI18n()
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const wrapperRef = useDismiss(open, close)
  const current = LANGUAGES.find((language) => language.id === lang) ?? LANGUAGES[0]

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`${t('language.label')}: ${current.label}`}
        title={`${t('language.label')}: ${current.label}`}
        className="focus-ring grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line/10 bg-line/[0.04] text-mist transition hover:border-line/25 hover:bg-line/[0.08] hover:text-fg sm:h-9 sm:w-9"
      >
        <Languages size={16} />
      </button>

      {open && (
        <div role="menu" className="popover absolute right-0 top-full z-50 mt-2 w-52 p-1.5">
          <p className="px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-mist/70">
            {t('language.label')}
          </p>
          {LANGUAGES.map((language) => {
            const active = language.id === lang
            return (
              <button
                key={language.id}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setLang(language.id)
                  close()
                }}
                className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm transition hover:bg-line/[0.06] ${
                  active ? 'bg-line/[0.06] font-medium' : ''
                }`}
              >
                <span className="min-w-0 flex-1 truncate">{language.label}</span>
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
