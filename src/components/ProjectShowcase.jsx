import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Smartphone, X } from 'lucide-react'
import {
  handleLiquidPointerLeave,
  handleLiquidPointerMove,
} from '../utils/liquidInteractions'
import ThemeToggle from './ThemeToggle'

const easeOut = [0.22, 1, 0.36, 1]

/**
 * Renders a CSS-only phone frame inside the immersive Project Showcase modal.
 * The screen area shows the active screenshot crisply and handles graceful, informative
 * fallback states for screenshot slots awaiting image files.
 */
function PhoneFrame({
  src,
  alt,
  label,
  index,
  total,
  projectTitle,
}) {
  const [imgReady, setImgReady] = useState(false)
  const [imgError, setImgError] = useState(false)
  const prevSrc = useRef(src)

  useEffect(() => {
    if (src !== prevSrc.current) {
      setImgReady(false)
      setImgError(false)
      prevSrc.current = src
    }
  }, [src])

  return (
    <div className="showcase-phone-frame" aria-hidden="true">
      <div className="showcase-phone-body iphone-hardware-frame">
        <span className="iphone-side-btn is-action" aria-hidden="true" />
        <span className="iphone-side-btn is-vol-up" aria-hidden="true" />
        <span className="iphone-side-btn is-vol-down" aria-hidden="true" />
        <span className="iphone-side-btn is-power" aria-hidden="true" />

        <div className="showcase-phone-dynamic-island">
          <span className="iphone-camera-lens" />
        </div>
        <div className="showcase-phone-screen">
          {!imgError && (
            <img
              key={src}
              src={src}
              alt={alt}
              className={`showcase-screen-img ${imgReady ? 'is-ready' : ''}`}
              onLoad={() => setImgReady(true)}
              onError={() => setImgError(true)}
              draggable={false}
            />
          )}
          {(!imgReady || imgError) && (
            <div className="showcase-screen-placeholder">
              {imgError ? (
                <div className="showcase-screen-slot-card">
                  <span className="showcase-slot-badge">
                    SCREEN {index + 1} OF {total}
                  </span>
                  <div className="showcase-slot-icon">
                    <Smartphone size={20} />
                  </div>
                  <strong className="showcase-slot-title">
                    {label || `${projectTitle} Screen ${index + 1}`}
                  </strong>
                  <p className="showcase-slot-desc">{alt}</p>
                  <code className="showcase-slot-path">public{src}</code>
                </div>
              ) : (
                <span className="showcase-screen-skeleton" />
              )}
            </div>
          )}
          <span className="iphone-screen-glare" aria-hidden="true" />
        </div>
        <div className="showcase-phone-home-indicator" />
      </div>
    </div>
  )
}

/**
 * Full-screen immersive project showcase overlay.
 * Triggered when a visitor clicks "Project Overview" on a project card.
 *
 * Shows a large CSS phone frame with the active screenshot, prev/next navigation,
 * and a dual-theme Liquid Glass project info panel (`.glass-modal`).
 * Also includes a live ThemeToggle in the top bar so visitors can switch themes
 * while inspecting project details.
 *
 * @param {Object} props
 * @param {Object|null} props.project - The selected project object, or null to close.
 * @param {Function} props.onClose - Callback to dismiss the showcase.
 * @param {'light' | 'dark'} [props.theme='light'] - Active theme.
 * @param {Function} [props.onToggleTheme] - Theme toggle callback.
 */
export default function ProjectShowcase({
  project,
  onClose,
  theme = 'light',
  onToggleTheme,
}) {
  const shouldReduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const closeButtonRef = useRef(null)
  const backdropRef = useRef(null)

  const screenshots = project?.screenshots ?? []
  const totalScreenshots = screenshots.length
  const activeShot = screenshots[activeIndex] ?? null

  // Lock body scroll while the showcase is open without losing scroll position
  useEffect(() => {
    if (!project) return undefined
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [project])

  // Keyboard navigation: ESC closes, arrow keys move between screenshots
  useEffect(() => {
    if (!project) return undefined

    const handleKey = (event) => {
      if (event.key === 'Escape') {
        onClose()
      } else if (event.key === 'ArrowRight' && totalScreenshots > 1) {
        setActiveIndex((prev) => (prev + 1) % totalScreenshots)
      } else if (event.key === 'ArrowLeft' && totalScreenshots > 1) {
        setActiveIndex(
          (prev) => (prev - 1 + totalScreenshots) % totalScreenshots,
        )
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [project, onClose, totalScreenshots])

  // Shift focus to the close button when the showcase opens
  useEffect(() => {
    if (project && closeButtonRef.current) {
      closeButtonRef.current.focus()
    }
  }, [project])

  const goNext = useCallback(() => {
    if (totalScreenshots < 2) return
    setActiveIndex((prev) => (prev + 1) % totalScreenshots)
  }, [totalScreenshots])

  const goPrev = useCallback(() => {
    if (totalScreenshots < 2) return
    setActiveIndex((prev) => (prev - 1 + totalScreenshots) % totalScreenshots)
  }, [totalScreenshots])

  // Swipe support on touch devices
  const touchStartX = useRef(null)

  const handleTouchStart = useCallback((event) => {
    touchStartX.current = event.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback(
    (event) => {
      if (touchStartX.current === null || totalScreenshots < 2) return
      const delta = touchStartX.current - event.changedTouches[0].clientX
      if (Math.abs(delta) > 40) {
        if (delta > 0) goNext()
        else goPrev()
      }
      touchStartX.current = null
    },
    [goNext, goPrev, totalScreenshots],
  )

  const handleBackdropClick = useCallback(
    (event) => {
      if (event.target === backdropRef.current) onClose()
    },
    [onClose],
  )

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          ref={backdropRef}
          className="showcase-backdrop"
          data-liquid-ignore=""
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} project showcase`}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleBackdropClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Ambient glow behind the phone, using theme-aware semantic accent */}
          <div className="showcase-ambient-glow" aria-hidden="true" />

          {/* Top-right controls: ThemeToggle + Close button */}
          <div className="showcase-top-controls">
            {onToggleTheme && (
              <ThemeToggle
                theme={theme}
                onToggle={onToggleTheme}
                reducedMotion={shouldReduceMotion}
              />
            )}
            <motion.button
              ref={closeButtonRef}
              type="button"
              className="showcase-close-btn glass-button liquid-btn"
              aria-label="Close project showcase"
              onClick={onClose}
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={shouldReduceMotion ? false : { opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.22, delay: 0.15 }}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
            >
              <X size={20} />
            </motion.button>
          </div>

          {/* Main content: phone + info panel */}
          <motion.div
            className="showcase-content"
            initial={
              shouldReduceMotion ? false : { opacity: 0, y: 32, scale: 0.96 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.97 }
            }
            transition={{ duration: 0.42, ease: easeOut }}
            onClick={(event) => event.stopPropagation()}
          >
            {/* ── Phone column ── */}
            <div className="showcase-phone-col">
              <motion.div
                className="showcase-phone-motion-wrap"
                initial={
                  shouldReduceMotion
                    ? false
                    : { scale: 0.84, y: 28, rotateY: -8 }
                }
                animate={{ scale: 1, y: 0, rotateY: 0 }}
                exit={
                  shouldReduceMotion
                    ? false
                    : { scale: 0.88, y: 20, rotateY: 6 }
                }
                transition={{ duration: 0.48, ease: easeOut }}
              >
                <PhoneFrame
                  src={activeShot?.src ?? ''}
                  alt={
                    activeShot?.alt ??
                    activeShot?.label ??
                    `${project.title} screenshot`
                  }
                  label={activeShot?.label}
                  index={activeIndex}
                  total={totalScreenshots}
                  projectTitle={project.title}
                />
              </motion.div>

              {/* Prev / Next navigation — only when multiple screenshots exist */}
              {totalScreenshots > 1 && (
                <div className="showcase-nav-row">
                  <button
                    type="button"
                    className="showcase-nav-btn glass-button liquid-btn"
                    aria-label="Previous screenshot"
                    onClick={goPrev}
                  >
                    <ArrowLeft size={18} />
                  </button>

                  {/* Dot indicators */}
                  <div
                    className="showcase-dots"
                    role="tablist"
                    aria-label="Screenshot navigation"
                  >
                    {screenshots.map((shot, index) => (
                      <button
                        key={shot.src}
                        type="button"
                        role="tab"
                        aria-selected={index === activeIndex}
                        aria-label={`Screenshot ${index + 1}: ${shot.label ?? ''}`}
                        className={`showcase-dot ${index === activeIndex ? 'is-active' : ''}`}
                        onClick={() => setActiveIndex(index)}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    className="showcase-nav-btn glass-button liquid-btn"
                    aria-label="Next screenshot"
                    onClick={goNext}
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}

              {/* Screen counter + label */}
              {totalScreenshots > 0 && (
                <p className="showcase-screen-label" aria-live="polite">
                  {activeShot?.label && (
                    <span className="showcase-label-name">
                      {activeShot.label}
                    </span>
                  )}
                  {totalScreenshots > 1 && (
                    <span className="showcase-label-counter">
                      {activeIndex + 1} / {totalScreenshots}
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* ── Info panel column ── */}
            <motion.div
              className="showcase-info-col showcase-glass-panel glass-modal liquid-glass-card"
              onPointerMove={(e) =>
                handleLiquidPointerMove(e, shouldReduceMotion)
              }
              onPointerLeave={handleLiquidPointerLeave}
              initial={shouldReduceMotion ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={shouldReduceMotion ? false : { opacity: 0, x: 16 }}
              transition={{ duration: 0.42, delay: 0.08, ease: easeOut }}
            >
              <div className="showcase-info-header" style={{ position: 'relative', zIndex: 2 }}>
                <span className="showcase-info-pill">{project.category}</span>
                {project.badge && (
                  <span className="showcase-info-badge">{project.badge}</span>
                )}
              </div>

              <h2 className="showcase-info-title" style={{ position: 'relative', zIndex: 2 }}>
                {project.title}
                <span className="showcase-title-accent">{project.accent}</span>
              </h2>

              <p className="showcase-info-role" style={{ position: 'relative', zIndex: 2 }}>
                {project.role}
              </p>
              <p className="showcase-info-desc" style={{ position: 'relative', zIndex: 2 }}>
                {project.description}
              </p>

              {project.highlights?.length > 0 && (
                <div className="showcase-info-section" style={{ position: 'relative', zIndex: 2 }}>
                  <h3 className="showcase-info-section-heading">Highlights</h3>
                  <ul className="showcase-info-highlights">
                    {project.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {project.techStack?.length > 0 && (
                <div className="showcase-info-section" style={{ position: 'relative', zIndex: 2 }}>
                  <h3 className="showcase-info-section-heading">Tech Stack</h3>
                  <div className="showcase-info-tags">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="showcase-info-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.links?.length > 0 && (
                <div className="showcase-info-links" style={{ position: 'relative', zIndex: 2 }}>
                  {project.links.map((link) =>
                    link.href ? (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="showcase-info-link-btn glass-button liquid-btn"
                      >
                        <span>{link.label}</span>{' '}
                        <span aria-hidden="true">{link.symbol}</span>
                      </a>
                    ) : (
                      <span
                        key={link.label}
                        className="showcase-info-link-btn is-disabled"
                      >
                        <span>{link.label}</span>{' '}
                        <span aria-hidden="true">{link.symbol}</span>
                      </span>
                    ),
                  )}
                </div>
              )}

              {project.repoNote && (
                <p className="showcase-info-repo-note" style={{ position: 'relative', zIndex: 2 }}>
                  {project.repoNote}
                </p>
              )}

              <button
                type="button"
                className="showcase-done-btn glass-button liquid-btn"
                onClick={onClose}
                style={{ position: 'relative', zIndex: 2 }}
              >
                <span>← Back to Projects</span>
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
