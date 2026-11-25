import { useEffect, useState } from 'react'
import { Bell, BellRing } from 'lucide-react'
import { useI18n } from '../lib/i18n'

const STORAGE_KEY = 'kudos.weeklyGifs'

export default function SubscribeButton() {
  const { t } = useI18n()
  const [subscribed, setSubscribed] = useState(
    () => localStorage.getItem(STORAGE_KEY) === '1'
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, subscribed ? '1' : '0')
  }, [subscribed])

  return (
    <button
      type="button"
      onClick={() => setSubscribed((value) => !value)}
      aria-pressed={subscribed}
      title={subscribed ? t('subscribe.remove') : t('subscribe.add')}
      className={`focus-ring inline-flex items-center gap-1.5 rounded-full border px-4 py-3 text-sm font-medium transition ${
        subscribed
          ? 'border-amber-500/40 bg-amber-400/15 text-amber-700 hover:bg-amber-400/25 dark:border-amber-300/40 dark:text-amber-200'
          : 'border-line/10 bg-line/[0.04] text-fg hover:border-line/25 hover:bg-line/[0.08]'
      }`}
    >
      {subscribed ? <BellRing size={15} /> : <Bell size={15} />}
      {subscribed ? t('subscribe.on') : t('subscribe.cta')}
    </button>
  )
}
