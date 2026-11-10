import { useMemo } from 'react'
import { motion } from 'framer-motion'

export default function Sparkles() {
  const particles = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => {
      const isStar = i % 3 === 0
      const dotSize = (i % 3) + 3 // 3px, 4px, or 5px
      return {
        id: i,
        isStar,
        dotSize,
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
            <span className="text-crimson/50 text-sm leading-none block select-none">✦</span>
          ) : (
            <span
              className="block rounded-full bg-crimson/50 blur-[1px] shadow-[0_0_8px_rgba(255,0,60,0.7)]"
              style={{
                width: `${p.dotSize}px`,
                height: `${p.dotSize}px`,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  )
}
