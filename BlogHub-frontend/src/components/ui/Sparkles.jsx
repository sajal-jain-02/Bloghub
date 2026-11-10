import { useMemo } from 'react'
import { motion } from 'framer-motion'

export default function Sparkles() {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => {
      const isStar = i % 3 === 0
      return {
        id: i,
        isStar,
        left: `${((i * 19 + 7) % 96) + 2}%`,
        top: `${((i * 29 + 11) % 94) + 3}%`,
        duration: 3 + (i % 4) * 0.9,
        delay: (i % 5) * 0.4,
        floatDistance: 10 + (i % 3) * 6,
      }
    })
  }, [])

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden h-full w-full">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute select-none pointer-events-none"
          style={{
            left: p.left,
            top: p.top,
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            y: [-p.floatDistance, p.floatDistance, -p.floatDistance],
            opacity: [0.15, 0.85, 0.15],
            scale: p.isStar ? [0.85, 1.25, 0.85] : [0.9, 1.3, 0.9],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        >
          {p.isStar ? (
            <span className="text-amber-500/50 text-sm leading-none block select-none">✦</span>
          ) : (
            <span className="block w-[3px] h-[3px] rounded-full bg-accent/40 blur-[1px] shadow-[0_0_6px_rgba(217,84,30,0.6)]" />
          )}
        </motion.div>
      ))}
    </div>
  )
}
