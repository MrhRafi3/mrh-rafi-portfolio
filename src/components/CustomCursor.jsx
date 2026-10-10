import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

/**
 * Renders a subtle custom cursor ring that trails the mouse on desktop devices.
 * Automatically disabled on touch devices and when reduced motion is preferred.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.shouldReduceMotion - Whether to disable the custom cursor for accessibility.
 */
export default function CustomCursor({ shouldReduceMotion }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isFinePointer, setIsFinePointer] = useState(
    () =>
      typeof window !== 'undefined' &&
      Boolean(window.matchMedia?.('(hover: hover) and (pointer: fine)').matches),
  )

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { stiffness: 460, damping: 30, mass: 0.45 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    if (shouldReduceMotion || typeof window === 'undefined') return undefined

    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const handlePointerChange = (event) => setIsFinePointer(event.matches)
    mediaQuery.addEventListener?.('change', handlePointerChange)

    if (!mediaQuery.matches) {
      return () => mediaQuery.removeEventListener?.('change', handlePointerChange)
    }

    const moveCursor = (event) => {
      cursorX.set(event.clientX - 14)
      cursorY.set(event.clientY - 14)
      setIsVisible(true)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    window.addEventListener('mousemove', moveCursor, { passive: true })
    document.documentElement.addEventListener('mouseenter', handleMouseEnter)
    document.documentElement.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      mediaQuery.removeEventListener?.('change', handlePointerChange)
      window.removeEventListener('mousemove', moveCursor)
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter)
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [cursorX, cursorY, shouldReduceMotion])

  if (shouldReduceMotion || !isFinePointer) return null

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        border: '1px solid rgba(241, 100, 54, 0.35)',
        backgroundColor: 'rgba(241, 100, 54, 0.06)',
        boxShadow: '0 0 16px rgba(241, 100, 54, 0.14)',
        pointerEvents: 'none',
        zIndex: 9999,
        x: cursorXSpring,
        y: cursorYSpring,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ opacity: { duration: 0.2 } }}
    />
  )
}

