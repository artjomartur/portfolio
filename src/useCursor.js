import { useState, useEffect, useRef } from 'react'

export function useCursor() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [smoothMouse, setSmoothMouse] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      setMouse({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleLeave = () => setIsVisible(false)
    const handleEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', handleMove)
    document.body.addEventListener('mouseleave', handleLeave)
    document.body.addEventListener('mouseenter', handleEnter)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      document.body.removeEventListener('mouseleave', handleLeave)
      document.body.removeEventListener('mouseenter', handleEnter)
    }
  }, [])

  useEffect(() => {
    const lerp = (start, end, factor) => start + (end - start) * factor
    let rafId

    const update = () => {
      const target = mouseRef.current
      setSmoothMouse((prev) => ({
        x: lerp(prev.x, target.x, 0.15),
        y: lerp(prev.y, target.y, 0.15),
      }))
      rafId = requestAnimationFrame(update)
    }
    rafId = requestAnimationFrame(update)

    return () => cancelAnimationFrame(rafId)
  }, [])

  const handleHover = () => setIsHovering(true)
  const handleLeave = () => setIsHovering(false)

  return { mouse, smoothMouse, isHovering, isVisible, handleHover, handleLeave }
}
