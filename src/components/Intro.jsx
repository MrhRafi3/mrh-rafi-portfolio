import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const SEEN_KEY = 'mrh-intro-seen'
const easeOut = [0.22, 1, 0.36, 1]
const easeInOut = [0.76, 0, 0.24, 1]

function hasSeenIntro() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

function markIntroSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    // Storage can be blocked (private mode). The intro just plays again.
  }
}

// Short (about 1.1s) intro. It plays once per browser tab session, and never
// for people who prefer reduced motion. `onDone` tells the page to start
// the hero animations.
export default function Intro({ reducedMotion, onDone }) {
  // Decided once, so it cannot flip while the intro is playing.
  const [skipIntro] = useState(() => Boolean(reducedMotion) || hasSeenIntro())
  const [visible, setVisible] = useState(!skipIntro)

  useEffect(() => {
    if (skipIntro) {
      onDone()
      return undefined
    }

    // The hero starts revealing just as the curtain begins to lift.
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
