import { motion, useMotionValue, useSpring } from 'motion/react'

/**
 * A wrapper component that creates a "magnetic" effect pulling the element towards the cursor.
 * 
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The element to make magnetic. Must be an HTML/motion element.
 * @param {number} props.strength - How strongly the element pulls towards the cursor (higher = more pull).
 * @param {boolean} props.shouldReduceMotion - Whether to disable animations.
 */
export default function MagneticButton({ children, strength = 40, shouldReduceMotion }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { stiffness: 350, damping: 20, mass: 1.5 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = (event) => {
    if (shouldReduceMotion) return
    const { currentTarget, clientX, clientY } = event
    const { left, top, width, height } = currentTarget.getBoundingClientRect()
    
    // Calculate distance from center
    const xDist = (clientX - (left + width / 2))
    const yDist = (clientY - (top + height / 2))
    
    x.set((xDist / width) * strength)
    y.set((yDist / height) * strength)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      style={{ display: 'inline-block', x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  )
}

