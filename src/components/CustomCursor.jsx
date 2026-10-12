import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], .card-phone-mockup, .liquid-btn, .switcher-pill'
const CARD_SELECTOR =
  '.project-card, .about-pillar-card, .skill-category-card, .about-narrative-card'
const TEXT_INPUT_SELECTOR =
  'input, textarea, select, [contenteditable="true"]'

/**
 * Renders a refined dual-layer custom cursor (precision dot + trailing liquid-glass ring)
 * on fine-pointer desktop devices.
 *
 * Uses Motion values and refs so pointer movement updates GPU transforms directly
 * without causing React re-renders on every mousemove frame.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.shouldReduceMotion - Whether to disable the custom cursor for accessibility.
 */
export default function CustomCursor({ shouldReduceMotion }) {
  const [isVisible, setIsVisible] = useState(false)
  const [cursorMode, setCursorMode] = useState('default')
  const [isPressed, setIsPressed] = useState(false)
  const [isFinePointer, setIsFinePointer] = useState(
    () =>
      typeof window !== 'undefined' &&
      Boolean(window.matchMedia?.('(hover: hover) and (pointer: fine)').matches),
  )

  const visibleRef = useRef(false)
  const modeRef = useRef('default')

  const pointerX = useMotionValue(-100)
  const pointerY = useMotionValue(-100)

  // Precision inner dot follows pointer with near-instant responsiveness
  const dotX = useSpring(pointerX, { stiffness: 820, damping: 42, mass: 0.16 })
  const dotY = useSpring(pointerY, { stiffness: 820, damping: 42, mass: 0.16 })

  // Outer liquid-glass ring trails with a smooth, restrained fluid spring
  const ringX = useSpring(pointerX, { stiffness: 380, damping: 30, mass: 0.4 })
  const ringY = useSpring(pointerY, { stiffness: 380, damping: 30, mass: 0.4 })

  useEffect(() => {
    if (shouldReduceMotion || typeof window === 'undefined') return undefined

    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const handlePointerChange = (event) => setIsFinePointer(event.matches)
    mediaQuery.addEventListener?.('change', handlePointerChange)

    if (!mediaQuery.matches) {
      return () =>
        mediaQuery.removeEventListener?.('change', handlePointerChange)
    }

    const updateMode = (nextMode) => {
      if (modeRef.current !== nextMode) {
        modeRef.current = nextMode
        setCursorMode(nextMode)
      }
    }

    const handlePointerMove = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') return
      pointerX.set(event.clientX)
      pointerY.set(event.clientY)

      if (!visibleRef.current) {
        visibleRef.current = true
        setIsVisible(true)
      }
    }

    const handlePointerOver = (event) => {
      const target = event.target
      if (!target || typeof target.closest !== 'function') return

      if (target.closest(TEXT_INPUT_SELECTOR)) {
        updateMode('hidden')
      } else if (target.closest(INTERACTIVE_SELECTOR)) {
        updateMode('interactive')
      } else if (target.closest(CARD_SELECTOR)) {
        updateMode('card')
      } else {
        updateMode('default')
      }
    }

    const handlePointerDown = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') return
      setIsPressed(true)
    }

    const handlePointerUp = () => {
      setIsPressed(false)
    }

    const handleMouseEnter = () => {
      if (!visibleRef.current) {
        visibleRef.current = true
        setIsVisible(true)
      }
    }

    const handleMouseLeave = () => {
      if (visibleRef.current) {
        visibleRef.current = false
        setIsVisible(false)
      }
      setIsPressed(false)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerover', handlePointerOver, { passive: true })
    window.addEventListener('pointerdown', handlePointerDown, { passive: true })
    window.addEventListener('pointerup', handlePointerUp, { passive: true })
    document.documentElement.addEventListener('mouseenter', handleMouseEnter)
    document.documentElement.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      mediaQuery.removeEventListener?.('change', handlePointerChange)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerover', handlePointerOver)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      document.documentElement.removeEventListener(
        'mouseenter',
        handleMouseEnter,
      )
      document.documentElement.removeEventListener(
        'mouseleave',
        handleMouseLeave,
      )
    }
  }, [pointerX, pointerY, shouldReduceMotion])

  if (shouldReduceMotion || !isFinePointer) return null

  const showCursor = isVisible && cursorMode !== 'hidden'
  const stateClasses = [
    cursorMode === 'interactive' ? 'is-interactive' : '',
    cursorMode === 'card' ? 'is-card' : '',
    isPressed ? 'is-pressed' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={`custom-cursor-layer ${showCursor ? 'is-visible' : ''} ${stateClasses}`.trim()}
      aria-hidden="true"
      data-liquid-ignore=""
    >
      <motion.div
        className="custom-cursor-ring"
        style={{
          x: ringX,
          y: ringY,
        }}
      />
      <motion.div
        className="custom-cursor-dot"
        style={{
          x: dotX,
          y: dotY,
        }}
      />
    </div>
  )
}
