import { useState } from 'react'
import { motion } from 'motion/react'

const DEFAULT_CLOCKY_SCREENSHOT = '/images/clocky/screen-1.png'

/**
 * Renders the Clocky mobile application inside a realistic iPhone-inspired
 * titanium hardware frame with Dynamic Island, tactile side buttons, inner bezel,
 * and smooth floating motion.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.shouldReduceMotion - Whether to disable animations for accessibility.
 * @param {string} [props.screenshotSrc] - Optional custom path to the Clocky screenshot.
 * @param {Function} [props.onOpenDetails] - Optional callback to open the immersive showcase.
 * @returns {JSX.Element} The rendered Clocky mockup component.
 */
export default function ClockyMockup({
  shouldReduceMotion,
  screenshotSrc = DEFAULT_CLOCKY_SCREENSHOT,
  onOpenDetails,
}) {
  const [imageError, setImageError] = useState(false)
  const showRealScreenshot = Boolean(screenshotSrc) && !imageError

  return (
    <motion.div
      className="project-mockup-stage"
      aria-label="Clocky mobile application preview"
      initial={
        shouldReduceMotion
          ? false
          : { opacity: 0, scale: 0.92, y: 28, rotateY: 8 }
      }
      whileInView={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.82,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.div
        className="mockup-orbit-ring is-outer"
        aria-hidden="true"
        animate={shouldReduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 65, repeat: Infinity, ease: 'linear' }}
      />
      <div className="mockup-orbit-ring is-inner" aria-hidden="true" />

      <motion.div
        className="card-phone-mockup iphone-hardware-frame"
        onClick={onOpenDetails}
        role={onOpenDetails ? 'button' : undefined}
        tabIndex={onOpenDetails ? 0 : undefined}
        aria-label={
          onOpenDetails ? 'Open Clocky interactive showcase' : undefined
        }
        onKeyDown={
          onOpenDetails
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onOpenDetails()
                }
              }
            : undefined
        }
        animate={
          shouldReduceMotion
            ? undefined
            : { y: [0, -7, 0], rotate: [-1.4, -0.4, -1.4] }
        }
        whileHover={
          shouldReduceMotion ? undefined : { scale: 1.025, rotate: 0 }
        }
        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          cursor: onOpenDetails ? 'pointer' : 'default',
        }}
      >
        {/* Physical iPhone side buttons */}
        <span className="iphone-side-btn is-action" aria-hidden="true" />
        <span className="iphone-side-btn is-vol-up" aria-hidden="true" />
        <span className="iphone-side-btn is-vol-down" aria-hidden="true" />
        <span className="iphone-side-btn is-power" aria-hidden="true" />

        <div className="iphone-inner-bezel">
          <div className="card-phone-screen-wrap">
            <span className="iphone-dynamic-island" aria-hidden="true">
              <span className="iphone-camera-lens" />
            </span>

            {showRealScreenshot ? (
              <img
                src={screenshotSrc}
                alt="Clocky app home screen"
                loading="lazy"
                onError={() => setImageError(true)}
                className="card-phone-screenshot"
                draggable={false}
              />
            ) : (
              <div className="card-phone-fallback-ui">
                <div className="card-phone-status-row">
                  <span>9:41</span>
                  <span>● ▰</span>
                </div>
                <div className="card-phone-kicker">YOUR TIME, YOUR WAY</div>
                <div className="card-phone-clock-digits">
                  09<span>:</span>41
                </div>
                <div className="card-phone-subkicker">YOUR EVERYDAY CLOCK</div>
                <div className="card-phone-divider" />
                {[
                  { icon: '◷', title: 'Alarm', caption: 'Wake up on time' },
                  {
                    icon: '◎',
                    title: 'Stopwatch',
                    caption: 'Track every second',
                  },
                ].map((item) => (
                  <div key={item.title} className="card-phone-mini-row">
                    <span className="card-phone-mini-icon">{item.icon}</span>
                    <span>
                      <span className="card-phone-mini-title">
                        {item.title}
                      </span>
                      <span className="card-phone-mini-caption">
                        {item.caption}
                      </span>
                    </span>
                  </div>
                ))}

                <div className="card-phone-drop-hint">
                  <code>Drop screenshot: public/images/clocky/screen-1.png</code>
                </div>

                <div className="card-phone-bottom-bar">
                  <span className="is-active">◷</span>
                  <span>◉</span>
                  <span>⚙</span>
                </div>
              </div>
            )}

            <span className="iphone-screen-glare" aria-hidden="true" />
            <span className="iphone-home-indicator" aria-hidden="true" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
