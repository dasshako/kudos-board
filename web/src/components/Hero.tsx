import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Heart, Sparkles, Users } from 'lucide-react'
import type { Stats } from '../lib/types'

type Props = {
  stats: Stats | null
  onGiveKudos: () => void
  onSeeSpotlight: () => void
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}

export default function Hero({ stats, onGiveKudos, onSeeSpotlight }: Props) {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="glass relative mt-6 overflow-hidden p-6 sm:p-9"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl dark:bg-amber-400/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl dark:bg-violet-500/15"
      />

      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
        <div>
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-line/10 bg-line/[0.05] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-mist"
          >
            <Sparkles size={13} className="text-amber-600 dark:text-amber-300" />
            Public recognition
          </motion.span>

          <motion.h1
            variants={item}
            className="font-display mt-4 text-4xl leading-[1.05] tracking-tight sm:text-5xl"
          >
            Great work deserves
            <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-violet-500 bg-clip-text text-transparent dark:from-amber-200 dark:via-rose-300 dark:to-violet-300">
              {' '}
              an audience.
            </span>
          </motion.h1>

          <motion.p variants={item} className="mt-4 max-w-xl text-[15px] leading-relaxed text-mist">
            Call out the people who made your week better. Say thanks out loud, make it stick, and
            watch the whole team light up.
          </motion.p>

          <motion.div variants={item} className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onGiveKudos}
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-300 to-rose-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-orange-500/25 transition hover:brightness-110 active:scale-[0.98]"
            >
              <Heart size={16} strokeWidth={2.6} />
              Celebrate a teammate
            </button>
            <button
              type="button"
              onClick={onSeeSpotlight}
              className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-line/10 bg-line/[0.04] px-4 py-3 text-sm font-medium text-fg transition hover:border-line/25 hover:bg-line/[0.08]"
            >
              See the spotlight
              <ArrowUpRight size={15} />
            </button>
          </motion.div>
        </div>

        <motion.dl variants={item} className="grid grid-cols-3 gap-3 lg:grid-cols-1">
          <Stat
            icon={<Sparkles size={14} />}
            label="Kudos this week"
            value={stats ? stats.week : '—'}
            tone="text-amber-600 dark:text-amber-300"
          />
          <Stat
            icon={<Users size={14} />}
            label="People celebrated"
            value={stats ? stats.totals.people : '—'}
            tone="text-violet-600 dark:text-violet-300"
          />
          <Stat
            icon={<Heart size={14} />}
            label="Kudos all time"
            value={stats ? stats.totals.kudos : '—'}
            tone="text-rose-600 dark:text-rose-300"
          />
        </motion.dl>
      </div>
    </motion.section>
  )
}

function Stat({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode
  label: string
  value: number | string
  tone: string
}) {
  return (
    <div className="rounded-2xl border border-line/10 bg-line/[0.04] px-4 py-3">
      <dt className={`flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] ${tone}`}>
        {icon}
        <span className="text-mist/80">{label}</span>
      </dt>
      <dd className="mt-1 text-2xl font-semibold tracking-tight">{value}</dd>
    </div>
  )
}
