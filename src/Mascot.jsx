import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

const MOODS = [
  'Byte online.',
  'System stabil.',
  'Mission: ship it.',
  'Build passed ✨',
]

function Mascot() {
  const [moodIndex, setMoodIndex] = useState(0)
  const [pressed, setPressed] = useState(false)
  const [isBoost, setIsBoost] = useState(false)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => setCursor({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setMoodIndex((i) => (i + 1) % MOODS.length), 4500)
    return () => clearInterval(id)
  }, [])

  const pupilOffset = useMemo(() => {
    const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0
    const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0
    const dx = Math.max(-4, Math.min(4, (cursor.x - centerX) / 55))
    const dy = Math.max(-3, Math.min(3, (cursor.y - centerY) / 75))
    return { x: dx, y: dy }
  }, [cursor])

  const onPress = () => {
    setPressed(true)
    setIsBoost(true)
    setMoodIndex((i) => (i + 1) % MOODS.length)
    setTimeout(() => setPressed(false), 180)
    setTimeout(() => setIsBoost(false), 520)
  }

  return (
    <motion.div
      className={`mascot ${isBoost ? 'mascot--boost' : ''}`}
      drag
      dragMomentum
      dragElastic={0.08}
      dragConstraints={{ left: -90, right: 90, top: -70, bottom: 90 }}
      whileDrag={{ rotate: -7, scale: 1.04 }}
      animate={{ y: [0, -5, 0], rotate: [0, -1.2, 0, 1.2, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      onTap={onPress}
      role="button"
      tabIndex={0}
      aria-label="Interaktives Maskottchen"
    >
      <div className={`mascot-shell ${pressed ? 'mascot-shell--pressed' : ''}`}>
        <div className="mascot-antenna" />
        <div className="mascot-ear mascot-ear--left" />
        <div className="mascot-ear mascot-ear--right" />
        <div className="mascot-screen">
        <div className="mascot-gloss" />
        <div className="mascot-face">
          <div className="mascot-eye">
            <span style={{ transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)` }} />
          </div>
          <div className="mascot-eye">
            <span style={{ transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)` }} />
          </div>
        </div>
        <div className={`mascot-mouth ${pressed ? 'mascot-mouth--smile' : ''}`} />
        </div>
      </div>
      <div className="mascot-neck" />
      <div className="mascot-base" />
      <div className={`mascot-shadow ${isBoost ? 'mascot-shadow--boost' : ''}`} />
      <div className="mascot-bubble">{MOODS[moodIndex]}</div>
    </motion.div>
  )
}

export default Mascot
