import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import Avatar from './Avatar'
import BadgePill from './BadgePill'
import { EMOJI, THEMES, THEME_BY_ID, recipientLine, timeAgo } from '../lib/meta'
import type { Kudos } from '../lib/types'

type Props = {
  kudos: Kudos
  index: number
  highlighted: boolean
  onReact: (kudosId: string, emoji: string) => void
}

export default function KudosCard({ kudos, index, highlighted, onReact }: Props) {
  const [trayOpen, setTrayOpen] = useState(false)
  const theme = THEME_BY_ID[kudos.theme] ?? THEMES[0]
  const teams = [...new Set(kudos.recipients.map((person) => person.team))]

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.045, 0.27), ease: [0.22, 1, 0.36, 1] }}
      className={`glass card-hover relative overflow-hidden ${
        highlighted ? 'ring-1 ring-amber-500/60 dark:ring-amber-300/60' : ''
      }`}
    >
      <div className={`h-1 w-full bg-gradient-to-r ${theme.line}`} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-44"
        style={{ background: `radial-gradient(120% 100% at 15% 0%, ${theme.wash}, transparent 72%)` }}
      />

      <div className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar person={kudos.sender} size={40} />
            <div className="min-w-0">
              <p className="truncate text-[13px] text-mist">
                <span className="font-medium text-fg">{kudos.sender.name}</span> celebrated
              </p>
              <p className="truncate text-[15px] font-semibold tracking-tight">
                {recipientLine(kudos.recipients)}
              </p>
            </div>
          </div>
          <BadgePill id={kudos.badge} />
        </div>

        <p className="font-display mt-4 text-[17px] leading-relaxed text-fg/95">{kudos.message}</p>

        <div className="mt-4 flex items-center gap-2.5">
          <div className="flex -space-x-2">
            {kudos.recipients.map((person) => (
              <Avatar key={person.id} person={person} size={26} />
            ))}
          </div>
          <span className="truncate text-xs text-mist">{teams.join(' · ')}</span>
          <span className="ml-auto shrink-0 text-xs text-mist/70">{timeAgo(kudos.createdAt)}</span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-line/10 pt-4">
          {kudos.reactions.map((reaction) => (
            <motion.button
              key={reaction.emoji}
              type="button"
              whileTap={{ scale: 0.9 }}
              aria-pressed={reaction.mine}
              aria-label={`React with ${reaction.emoji}, ${reaction.count} so far`}
              onClick={() => onReact(kudos.id, reaction.emoji)}
              className={`focus-ring inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition ${
                reaction.mine
                  ? 'reaction-active'
                  : 'border-line/10 bg-line/[0.04] text-mist hover:border-line/25 hover:text-fg'
              }`}
            >
              <span aria-hidden="true">{reaction.emoji}</span>
              <span className="font-medium">{reaction.count}</span>
            </motion.button>
          ))}

          <div className="relative ml-auto">
            <button
              type="button"
              onClick={() => setTrayOpen((value) => !value)}
              aria-expanded={trayOpen}
              aria-label="Add a reaction"
              className="focus-ring inline-flex items-center gap-1 rounded-full border border-dashed border-line/20 px-2.5 py-1 text-xs text-mist transition hover:border-line/40 hover:text-fg"
            >
              <Plus size={13} />
              React
            </button>

            {trayOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setTrayOpen(false)} />
                <div className="popover absolute bottom-full right-0 z-20 mb-2 flex gap-0.5 rounded-full p-1">
                  {EMOJI.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        onReact(kudos.id, emoji)
                        setTrayOpen(false)
                      }}
                      className="grid h-8 w-8 place-items-center rounded-full text-base transition hover:bg-line/10 active:scale-90"
                      aria-label={`React with ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  )
}
