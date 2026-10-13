import { useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from 'motion/react'
import { Expand, Smartphone } from 'lucide-react'

const easeCinematic = [0.22, 1, 0.36, 1]

const screenTransitionVariants = {
  enter: (direction) => ({
    opacity: 0,
    scale: 1.04,
    x: direction > 0 ? 28 : direction < 0 ? -28 : 0,
    y: direction === 0 ? 18 : 0,
  }),
  center: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
  },
  exit: (direction) => ({
    opacity: 0,
    scale: 0.965,
    x: direction > 0 ? -24 : direction < 0 ? 24 : 0,
    y: direction === 0 ? -14 : 0,
  }),
}

/**
 * Shared, reusable iPhone-inspired titanium hardware mockup component.
 * Used across the cinematic project showcase and project previews to present
 * real Flutter application screenshots with authentic device proportions,
 * Dynamic Island, tactile side buttons, restrained 3D perspective response,
 * and coordinated screen transitions.
 *
 * @param {Object} props
 * @param {Object} props.screenshot - Active screenshot object ({ src, label, alt }).
 * @param {string} props.projectId - Active project identifier ('clocky' | 'expify-beta').
 * @param {string} props.projectTitle - Display name of the active project.
 * @param {number} [props.screenIndex=0] - Zero-based index of the active screenshot.
 * @param {number} [props.totalScreens=1] - Total screenshots available for the project.
 * @param {number} [props.direction=0] - Transition direction (-1 prev, 0 project switch, 1 next).
 * @param {boolean} [props.shouldReduceMotion=false] - Respects user reduced-motion preference.
 * @param {Function} [props.onOpenDetails] - Callback to open the fullscreen showcase modal.
 * @param {string} [props.floatingBadge] - Optional floating craft pill beside the device.
 * @param {string} [props.statusBadge] - Optional telemetry pill above/beside the device.
 */
export default function PhoneMockup({
  screenshot,
  projectId,
  projectTitle,
  screenIndex = 0,
  totalScreens = 1,
  direction = 0,
  shouldReduceMotion = false,
  onOpenDetails,
  floatingBadge,
  statusBadge,
}) {
  const [failedSrcs, setFailedSrcs] = useState({})

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springConfig = { stiffness: 260, damping: 28, mass: 0.9 }
  const springRotateX = useSpring(rotateX, springConfig)
  const springRotateY = useSpring(rotateY, springConfig)

  const currentSrc = screenshot?.src || ''
  const isImageAvailable = Boolean(currentSrc) && !failedSrcs[currentSrc]

  const handleImageError = (src) => {
    if (!src) return
    setFailedSrcs((prev) => ({ ...prev, [src]: true }))
  }

  const handlePointerMove = (event) => {
    if (shouldReduceMotion) return
    if (event.pointerType && event.pointerType !== 'mouse') return
    if (window.matchMedia?.('(pointer: coarse)').matches) return

    const bounds = event.currentTarget.getBoundingClientRect()
    if (!bounds.width || !bounds.height) return

    const xPct = (event.clientX - bounds.left) / bounds.width - 0.5
    const yPct = (event.clientY - bounds.top) / bounds.height - 0.5

    rotateX.set(yPct * -5.5)
    rotateY.set(xPct * 6.5)
  }

  const handlePointerLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <div
      className="cinematic-device-anchor"
      data-project={projectId}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Architectural orbital rings & ambient halo behind the anchored device */}
      <div className="cinematic-device-halo" aria-hidden="true" />
      <motion.div
        className="mockup-orbit-ring is-outer"
        aria-hidden="true"
        animate={shouldReduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 68, repeat: Infinity, ease: 'linear' }}
      />
      <div className="mockup-orbit-ring is-inner" aria-hidden="true" />

      {/* Top-left telemetry badge synchronized with active project & screen */}
      {statusBadge && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${projectId}-${screenIndex}-status`}
            className="mockup-telemetry-badge glass-surface"
            aria-hidden="true"
            initial={
              shouldReduceMotion ? false : { opacity: 0, y: 8, scale: 0.95 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              shouldReduceMotion ? undefined : { opacity: 0, y: -6, scale: 0.95 }
            }
            transition={{ duration: shouldReduceMotion ? 0 : 0.28, ease: easeCinematic }}
          >
            <span className="telemetry-dot" />
            <span>{statusBadge}</span>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Anchored iPhone Hardware Frame with subtle perspective shift on project change */}
      <motion.div
        key={projectId}
        className="cinematic-phone-perspective-wrap"
        initial={
          shouldReduceMotion
            ? false
            : { scale: 0.96, y: 12, rotateY: direction >= 0 ? -6 : 6 }
        }
        animate={{ scale: 1, y: 0, rotateY: 0 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.56,
          ease: easeCinematic,
        }}
        style={{
          rotateX: shouldReduceMotion ? 0 : springRotateX,
          rotateY: shouldReduceMotion ? 0 : springRotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.div
          className="card-phone-mockup cinematic-phone-hardware iphone-hardware-frame"
          onClick={onOpenDetails}
          role={onOpenDetails ? 'button' : undefined}
          tabIndex={onOpenDetails ? 0 : undefined}
          aria-label={
            onOpenDetails
              ? `Inspect ${projectTitle} — ${screenshot?.label || 'app screen'} in fullscreen showcase`
              : `${projectTitle} device preview`
          }
          onKeyDown={
            onOpenDetails
              ? (event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onOpenDetails()
                  }
                }
              : undefined
          }
          whileHover={
            shouldReduceMotion ? undefined : { scale: 1.018 }
          }
          whileTap={
            shouldReduceMotion ? undefined : { scale: 0.99 }
          }
          transition={{ duration: 0.28, ease: easeCinematic }}
        >
          {/* Physical iPhone side buttons */}
          <span className="iphone-side-btn is-action" aria-hidden="true" />
          <span className="iphone-side-btn is-vol-up" aria-hidden="true" />
          <span className="iphone-side-btn is-vol-down" aria-hidden="true" />
          <span className="iphone-side-btn is-power" aria-hidden="true" />

          <div className="iphone-inner-bezel">
            <div className="card-phone-screen-wrap cinematic-screen-viewport">
              <span className="iphone-dynamic-island" aria-hidden="true">
                <span className="iphone-camera-lens" />
              </span>

              <AnimatePresence
                mode="popLayout"
                initial={false}
                custom={direction}
              >
                <motion.div
                  key={`${projectId}-${currentSrc}`}
                  className="cinematic-screen-slide"
                  custom={direction}
                  variants={
                    shouldReduceMotion ? undefined : screenTransitionVariants
                  }
                  initial={shouldReduceMotion ? { opacity: 1 } : 'enter'}
                  animate={shouldReduceMotion ? { opacity: 1 } : 'center'}
                  exit={shouldReduceMotion ? { opacity: 0 } : 'exit'}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.42,
                    ease: easeCinematic,
                  }}
                >
                  {isImageAvailable ? (
                    <img
                      src={currentSrc}
                      alt={
                        screenshot?.alt ||
                        `${projectTitle} — ${screenshot?.label || 'screen preview'}`
                      }
                      className="card-phone-screenshot"
                      draggable={false}
                      onError={() => handleImageError(currentSrc)}
                    />
                  ) : (
                    <div className="card-phone-fallback-ui is-expify">
                      <div className="card-phone-status-row">
                        <span>9:41</span>
                        <span>
                          {screenIndex + 1} / {totalScreens}
                        </span>
                      </div>

                      <div className="card-phone-slot-box">
                        <div className="card-phone-slot-icon">
                          <Smartphone size={18} />
                        </div>
                        <p className="card-phone-slot-title">
                          {screenshot?.label || `${projectTitle} Screen`}
                        </p>
                        <p className="card-phone-slot-desc">
                          {screenshot?.alt || 'Real Flutter application view'}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <span className="iphone-screen-glare" aria-hidden="true" />
              <span className="iphone-home-indicator" aria-hidden="true" />

              {onOpenDetails && (
                <span className="cinematic-phone-zoom-pill" aria-hidden="true">
                  <Expand size={11} />
                  <span>Inspect</span>
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom-right floating craft badge */}
      {floatingBadge && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${projectId}-floating-badge`}
            className="mockup-floating-badge"
            aria-hidden="true"
            initial={
              shouldReduceMotion ? false : { opacity: 0, x: 14, y: 6 }
            }
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={
              shouldReduceMotion ? undefined : { opacity: 0, x: 10, y: 4 }
            }
            transition={{
              duration: shouldReduceMotion ? 0 : 0.38,
              delay: shouldReduceMotion ? 0 : 0.08,
              ease: easeCinematic,
            }}
          >
            {floatingBadge}
          </motion.div>
        </AnimatePresence>
      )}

      <div className="cinematic-device-pedestal" aria-hidden="true" />
    </div>
  )
}

