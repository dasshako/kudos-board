import { useMemo } from 'react'
import { motion } from 'framer-motion'

const COLORS = ['#fbbf24', '#fb7185', '#a78bfa', '#34d399', '#38bdf8', '#f472b6']

export default function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 32 }, (_, index) => ({
        id: index,
        x: (Math.random() - 0.5) * 680,
        y: -140 - Math.random() * 140,
        rotate: Math.random() * 540 - 270,
        color: COLORS[index % COLORS.length],
        delay: Math.random() * 0.14,
        size: 6 + Math.random() * 7,
      })),
    []
  )

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] grid place-items-center overflow-hidden"
    >
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute rounded-[2px]"
          style={{ width: piece.size, height: piece.size, background: piece.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: piece.x, y: piece.y + 460, opacity: 0, rotate: piece.rotate }}
          transition={{ duration: 1.15 + piece.delay, ease: 'easeOut', delay: piece.delay }}
        />
      ))}
    </div>
  )
}
