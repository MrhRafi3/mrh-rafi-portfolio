import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const SEEN_KEY = 'mrh-intro-seen'
const easeOut = [0.22, 1, 0.36, 1]
const easeInOut = [0.76, 0, 0.24, 1]

/**
 * Checks if the user has already seen the intro animation in this session.
 *
 * @returns {boolean} True if the intro has been seen, otherwise false.
 */
function hasSeenIntro() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * Marks the intro animation as seen in the current session.
 */
function markIntroSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    // Ignore storage errors
  }
}

/**
 * Renders the introductory animation sequence for the portfolio.
 * Plays only once per session and respects reduced motion preferences.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.reducedMotion - Whether to skip the animation for accessibility.
 * @param {Function} props.onDone - Callback triggered when the intro finishes or is skipped.
 * @returns {JSX.Element} The rendered intro component.
 */
export default function Intro({ reducedMotion, onDone }) {
  const [skipIntro] = useState(() => Boolean(reducedMotion) || hasSeenIntro())
  const [visible, setVisible] = useState(!skipIntro)

  useEffect(() => {
    if (skipIntro) {
      onDone()
      return undefined
    }

    const doneTimer = window.setTimeout(() => {
      markIntroSeen()
      onDone()
    }, 1050)
    const hideTimer = window.setTimeout(() => setVisible(false), 1150)

    return () => {
      window.clearTimeout(doneTimer)
      window.clearTimeout(hideTimer)
    }
  }, [skipIntro, onDone])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="intro-screen"
          aria-hidden="true"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: easeInOut }}
        >
          <motion.span
            className="intro-mark"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            mrh<span>.</span>rafi
          </motion.span>

          <span className="intro-bar">
            <motion.span
              className="intro-bar-fill"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.15, ease: easeOut }}
            />
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
