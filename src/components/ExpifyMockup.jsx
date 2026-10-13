import { useState } from 'react'
import { motion } from 'motion/react'
import { Image as ImageIcon, Smartphone } from 'lucide-react'

/**
 * Renders the interactive iPhone-inspired device preview for Expify Beta.
 * Displays real application screenshots when placed in `public/images/expify/`,
 * and shows a truthful, clearly marked screenshot slot placeholder until supplied,
 * without fabricating unverified app screens or statistics.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.shouldReduceMotion - Whether to disable animations for accessibility.
 * @param {Array<{src: string, label: string, alt: string}>} props.screenshots - Configured screenshot paths.
 * @param {Function} props.onOpenDetails - Callback to open the project details modal.
 * @param {string} [props.floatingBadge] - Optional floating badge label beside the phone.
 * @returns {JSX.Element} The rendered Expify Beta preview component.
 */
export default function ExpifyMockup({
  shouldReduceMotion,
  screenshots = [],
  onOpenDetails,
  floatingBadge,
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [failedImages, setFailedImages] = useState({})

  const currentShot = screenshots[activeIndex] || screenshots[0]
  const isCurrentImageAvailable =
    currentShot && !failedImages[currentShot.src]

  const handleImageError = (src) => {
    setFailedImages((prev) => ({ ...prev, [src]: true }))
  }

  return (
    <motion.div
      className="project-mockup-stage"
      aria-label="Expify Beta application preview"
      initial={
        shouldReduceMotion ? false : { opacity: 0, scale: 0.92, y: 28 }
      }
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.82,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.div
        className="mockup-orbit-ring is-outer"
        aria-hidden="true"
        animate={shouldReduceMotion ? undefined : { rotate: -360 }}
        transition={{ duration: 75, repeat: Infinity, ease: 'linear' }}
      />
      <div className="mockup-orbit-ring is-inner" aria-hidden="true" />

      <div className="project-phone-column">
        <motion.div
          className="card-phone-mockup iphone-hardware-frame"
          onClick={onOpenDetails}
          role={onOpenDetails ? 'button' : undefined}
          tabIndex={onOpenDetails ? 0 : undefined}
          aria-label={
            onOpenDetails ? 'Open Expify Beta interactive showcase' : undefined
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
              : { y: [0, -7, 0], rotate: [1.3, 0.4, 1.3] }
          }
          whileHover={
            shouldReduceMotion ? undefined : { scale: 1.025, rotate: 0 }
          }
          transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut' }}
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

              {isCurrentImageAvailable ? (
                <img
                  key={currentShot.src}
                  src={currentShot.src}
                  alt={currentShot.alt}
                  loading="lazy"
                  onError={() => handleImageError(currentShot.src)}
                  className="card-phone-screenshot"
                  draggable={false}
                />
              ) : (
                <div className="card-phone-fallback-ui is-expify">
                  <div className="card-phone-status-row">
                    <span>9:41</span>
                    <span>
                      {activeIndex + 1} / {screenshots.length || 1} · BETA
                    </span>
                  </div>

                  <div className="card-phone-slot-box">
                    <div className="card-phone-slot-icon">
                      <ImageIcon size={18} />
                    </div>

                    <p className="card-phone-slot-title">
                      {currentShot?.label || 'Expify Beta Screen'}
                    </p>
                    <p className="card-phone-slot-desc">
                      {currentShot?.alt || 'Awaiting real app screenshot asset:'}
                    </p>
                    <code className="card-phone-slot-code">
                      {currentShot
                        ? `public${currentShot.src}`
                        : 'public/images/expify/screen-1.png'}
                    </code>
                  </div>

                  <div className="card-phone-expify-footer">
                    <span className="card-phone-expify-tag">
                      <Smartphone size={11} /> Expense Tracker
                    </span>
                    {onOpenDetails && (
                      <span className="card-phone-expify-cta">Showcase ↗</span>
                    )}
                  </div>
                </div>
              )}

              <span className="iphone-screen-glare" aria-hidden="true" />
              <span className="iphone-home-indicator" aria-hidden="true" />
            </div>
          </div>
        </motion.div>

        {screenshots.length > 1 && (
          <div
            role="tablist"
            aria-label="Select Expify Beta screenshot"
            className="card-phone-dots-row"
          >
            {screenshots.map((shot, idx) => {
              const active = idx === activeIndex
              return (
                <button
                  key={shot.src}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Preview ${shot.label}`}
                  onClick={() => setActiveIndex(idx)}
                  className={`card-phone-dot${active ? ' is-active' : ''}`}
                />
              )
            })}
          </div>
        )}
      </div>

      {floatingBadge && (
        <motion.div
          className="mockup-floating-badge"
          aria-hidden="true"
          initial={shouldReduceMotion ? false : { opacity: 0, x: 14, y: -6 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.68,
            delay: shouldReduceMotion ? 0 : 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {floatingBadge}
        </motion.div>
      )}
    </motion.div>
  )
}
