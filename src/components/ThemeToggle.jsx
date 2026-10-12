import { AnimatePresence, motion } from 'motion/react'
import { Moon, Sun } from 'lucide-react'

const easeStandard = [0.22, 1, 0.36, 1]

/**
 * Reusable Liquid Glass theme toggle button.
 * Switches between Clay & Butter (light mode) and Midnight Espresso (dark mode)
 * with a water-fluid circular reveal originating from the button's exact click position.
 *
 * @param {Object} props
 * @param {'light' | 'dark'} props.theme - Active theme ('light' or 'dark')
 * @param {Function} props.onToggle - Handler that triggers the fluid theme transition
 * @param {boolean} [props.reducedMotion=false] - Whether reduced motion is preferred
 * @param {string} [props.className=''] - Optional extra class names
 */
export default function ThemeToggle({
  theme = 'light',
  onToggle,
  reducedMotion = false,
  className = '',
}) {
  const isDark = theme === 'dark'
  const nextLabel = isDark
    ? 'Switch to Clay & Butter light theme'
    : 'Switch to Midnight Espresso dark theme'

  return (
    <motion.button
      type="button"
      className={`theme-toggle-btn glass-button liquid-btn ${className}`.trim()}
      onClick={(event) => onToggle?.(event)}
      aria-label={nextLabel}
      aria-pressed={!isDark}
      title={nextLabel}
      whileHover={reducedMotion ? undefined : { y: -2, scale: 1.03 }}
      whileTap={reducedMotion ? undefined : { scale: 0.94 }}
    >
      <span className="theme-toggle-sheen" aria-hidden="true" />
      <span className="theme-toggle-icon-wrap" aria-hidden="true">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="sun-icon"
              className="theme-toggle-icon is-sun"
              initial={
                reducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, rotate: -70, scale: 0.55 }
              }
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={
                reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, rotate: 70, scale: 0.55 }
              }
              transition={{
                duration: reducedMotion ? 0 : 0.28,
                ease: easeStandard,
              }}
            >
              <Sun size={17} strokeWidth={1.9} />
            </motion.span>
          ) : (
            <motion.span
              key="moon-icon"
              className="theme-toggle-icon is-moon"
              initial={
                reducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, rotate: 70, scale: 0.55 }
              }
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={
                reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, rotate: -70, scale: 0.55 }
              }
              transition={{
                duration: reducedMotion ? 0 : 0.28,
                ease: easeStandard,
              }}
            >
              <Moon size={16.5} strokeWidth={1.9} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span className="theme-toggle-mode-label">
        {isDark ? 'Light' : 'Dark'}
      </span>
    </motion.button>
  )
}

