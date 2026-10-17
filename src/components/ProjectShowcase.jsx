import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Clock,
  Flame,
  Plus,
  Search,
  ShoppingBag,
  Smartphone,
  Star,
  X,
} from 'lucide-react'
import {
  handleLiquidPointerLeave,
  handleLiquidPointerMove,
} from '../utils/liquidInteractions'
import ThemeToggle from './ThemeToggle'

const easeOut = [0.22, 1, 0.36, 1]

/**
 * Procedural NomNom Food Delivery screen preview rendered inside the phone frame
 * when screenshot image files are not on disk.
 */
export function NomNomScreenPreview({ index = 0 }) {
  if (index === 1) {
    // Screen 1: Restaurant & Menu Storefront
    return (
      <div className="card-phone-fallback-ui is-nomnom is-menu">
        <div className="card-phone-status-row">
          <span>9:41</span>
          <span className="card-phone-status-pills">STOREFRONT</span>
        </div>
        <div className="nomnom-store-header">
          <span className="nomnom-store-badge">THE BURGER LOFT</span>
          <h4 className="nomnom-store-title">Gourmet Burgers &amp; Shakes</h4>
          <div className="nomnom-store-meta">
            <span>★ 4.9 (1.4k)</span>
            <span>·</span>
            <span>20-25 min</span>
            <span>·</span>
            <span>৳ 40 Delivery</span>
          </div>
        </div>
        <div className="nomnom-menu-tabs">
          <span className="is-active">Specials</span>
          <span>Burgers</span>
          <span>Sides</span>
          <span>Drinks</span>
        </div>
        <div className="nomnom-menu-list">
          <div className="nomnom-menu-item">
            <div>
              <strong>Truffle Wagyu Melt</strong>
              <p>Brioche, wagyu patty, black truffle butter.</p>
              <span className="nomnom-item-price">৳ 580</span>
            </div>
            <span className="nomnom-item-add">+ Add</span>
          </div>
          <div className="nomnom-menu-item">
            <div>
              <strong>Smoky BBQ Crisp</strong>
              <p>Double beef, smoked cheddar, crispy shallots.</p>
              <span className="nomnom-item-price">৳ 480</span>
            </div>
            <span className="nomnom-item-add">+ Add</span>
          </div>
          <div className="nomnom-menu-item">
            <div>
              <strong>Parmesan Garlic Fries</strong>
              <p>Hand-cut potatoes, aged parmesan, rosemary.</p>
              <span className="nomnom-item-price">৳ 220</span>
            </div>
            <span className="nomnom-item-add">+ Add</span>
          </div>
        </div>
        <div className="nomnom-floating-cart is-inline">
          <span>🛍 View Cart (2 items)</span>
          <strong>৳ 700 →</strong>
        </div>
      </div>
    )
  }

  if (index === 2) {
    // Screen 2: Dish Customizer Sheet
    return (
      <div className="card-phone-fallback-ui is-nomnom is-customizer">
        <div className="card-phone-status-row">
          <span>9:41</span>
          <span className="card-phone-status-pills">CUSTOMIZER</span>
        </div>
        <div className="nomnom-custom-banner">
          <span className="nomnom-custom-tag">CUSTOMIZE DISH</span>
          <h4>Artisan Truffle Smash</h4>
          <span className="nomnom-custom-base">Base: ৳ 450</span>
        </div>
        <div className="nomnom-options-group">
          <span className="nomnom-opt-heading">PATTY SELECTION</span>
          <div className="nomnom-opt-row is-selected">
            <span>Double Smash Patty (Standard)</span>
            <small>Included</small>
          </div>
          <div className="nomnom-opt-row">
            <span>Triple Beast Patty (+150g)</span>
            <small>+৳ 120</small>
          </div>
        </div>
        <div className="nomnom-options-group">
          <span className="nomnom-opt-heading">ADD-ONS &amp; SAUCE</span>
          <div className="nomnom-opt-row is-selected">
            <span>Extra Aged Cheddar Melt</span>
            <small>+৳ 60</small>
          </div>
          <div className="nomnom-opt-row is-selected">
            <span>Black Truffle Aioli Shot</span>
            <small>+৳ 40</small>
          </div>
          <div className="nomnom-opt-row">
            <span>Crispy Turkey Bacon Strips</span>
            <small>+৳ 80</small>
          </div>
        </div>
        <div className="nomnom-custom-footer">
          <div className="nomnom-stepper">
            <span>-</span>
            <span>1</span>
            <span>+</span>
          </div>
          <div className="nomnom-add-order-btn">
            <span>Add to Order · ৳ 550</span>
          </div>
        </div>
      </div>
    )
  }

  if (index === 3) {
    // Screen 3: Cart & Checkout Summary
    return (
      <div className="card-phone-fallback-ui is-nomnom is-cart">
        <div className="card-phone-status-row">
          <span>9:41</span>
          <span className="card-phone-status-pills">MY CART</span>
        </div>
        <div className="nomnom-cart-heading">
          <h4>Order Summary</h4>
          <span>2 items</span>
        </div>
        <div className="nomnom-cart-items">
          <div className="nomnom-cart-line">
            <span>1× Artisan Truffle Smash</span>
            <strong>৳ 550</strong>
          </div>
          <div className="nomnom-cart-line">
            <span>1× Parmesan Garlic Fries</span>
            <strong>৳ 220</strong>
          </div>
        </div>
        <div className="nomnom-promo-box">
          <span>🏷 NOMNOM20 applied</span>
          <small>-৳ 100</small>
        </div>
        <div className="nomnom-bill-breakdown">
          <div>
            <span>Subtotal</span>
            <span>৳ 770</span>
          </div>
          <div>
            <span>Delivery Fee</span>
            <span>৳ 40</span>
          </div>
          <div>
            <span>Voucher Discount</span>
            <span className="is-discount">-৳ 100</span>
          </div>
          <div className="nomnom-bill-total">
            <strong>Total Amount</strong>
            <strong>৳ 710</strong>
          </div>
        </div>
        <div className="nomnom-place-order-btn">
          <span>Place Order · ৳ 710 →</span>
        </div>
      </div>
    )
  }

  if (index === 4) {
    // Screen 4: Live Order Tracker
    return (
      <div className="card-phone-fallback-ui is-nomnom is-tracker">
        <div className="card-phone-status-row">
          <span>9:41</span>
          <span className="card-phone-status-pills">LIVE TRACKING</span>
        </div>
        <div className="nomnom-tracker-card">
          <div className="nomnom-tracker-top">
            <span className="nomnom-pulse-dot" />
            <span>ORDER #4092 ON THE WAY</span>
          </div>
          <h3 className="nomnom-tracker-eta">16 mins</h3>
          <p>Estimated arrival at 24th Baker St</p>
        </div>
        <div className="nomnom-tracker-steps">
          <div className="nomnom-step is-done">
            <span className="nomnom-step-dot" />
            <div>
              <strong>Order Confirmed</strong>
              <small>09:32 PM · The Burger Loft</small>
            </div>
          </div>
          <div className="nomnom-step is-done">
            <span className="nomnom-step-dot" />
            <div>
              <strong>Prepared by Chef</strong>
              <small>09:40 PM · Freshly packed</small>
            </div>
          </div>
          <div className="nomnom-step is-active">
            <span className="nomnom-step-dot" />
            <div>
              <strong>Courier is En Route 🛵</strong>
              <small>Rider: Rafiq M. (4.9 ★)</small>
            </div>
          </div>
          <div className="nomnom-step">
            <span className="nomnom-step-dot" />
            <div>
              <strong>Delivered to Door</strong>
              <small>Pending arrival</small>
            </div>
          </div>
        </div>
        <div className="nomnom-courier-row">
          <div>
            <strong>Rafiq M.</strong>
            <small>Yamaha FZ · Red (DH-492)</small>
          </div>
          <span className="nomnom-call-btn">📞 Call Rider</span>
        </div>
      </div>
    )
  }

  // Screen 0 (Default): Food Discovery & Categories
  return (
    <div className="card-phone-fallback-ui is-nomnom">
      <div className="card-phone-status-row">
        <span>9:41</span>
        <span className="card-phone-status-pills">
          <span className="status-live-dot" /> LIVE · 20m
        </span>
      </div>
      <div className="nomnom-header-row">
        <div>
          <span className="nomnom-kicker">DELIVER TO</span>
          <div className="nomnom-location-title">
            <span>24th Baker St, Suite 4B</span>
            <ChevronDown size={12} className="nomnom-chevron" />
          </div>
        </div>
        <div className="nomnom-avatar-badge" aria-hidden="true">
          <span>🍔</span>
        </div>
      </div>
      <div className="nomnom-search-bar">
        <Search size={12} className="nomnom-search-icon" />
        <span>Search burgers, ramen, pizza...</span>
      </div>
      <div className="nomnom-cuisines-row" aria-hidden="true">
        <span className="nomnom-cuisine-pill is-active">
          <span>🍔</span> Burgers
        </span>
        <span className="nomnom-cuisine-pill">
          <span>🍕</span> Pizza
        </span>
        <span className="nomnom-cuisine-pill">
          <span>🍜</span> Asian
        </span>
        <span className="nomnom-cuisine-pill">
          <span>🥗</span> Bowls
        </span>
      </div>
      <div className="nomnom-featured-card">
        <div className="nomnom-card-banner">
          <span className="nomnom-card-tag">
            <Flame size={10} /> TRENDING #1
          </span>
          <span className="nomnom-card-eta">
            <Clock size={10} /> 20-25m
          </span>
        </div>
        <div className="nomnom-card-body">
          <div className="nomnom-dish-header">
            <div>
              <h4 className="nomnom-dish-title">Artisan Truffle Smash</h4>
              <div className="nomnom-rating-row">
                <Star size={10} fill="#f59e0b" color="#f59e0b" />
                <span>4.9 (1.2k reviews)</span>
              </div>
            </div>
            <span className="nomnom-dish-price">৳ 450</span>
          </div>
          <p className="nomnom-dish-desc">
            Double smash beef, aged cheddar, black truffle aioli on brioche.
          </p>
          <div className="nomnom-card-actions">
            <span className="nomnom-badge-free">Free Delivery</span>
            <span className="nomnom-add-btn">
              <Plus size={12} /> Add
            </span>
          </div>
        </div>
      </div>
      <div className="nomnom-mini-row">
        <div className="nomnom-mini-item">
          <span className="nomnom-mini-thumb">🍟</span>
          <div>
            <span className="nomnom-mini-name">Truffle Fries</span>
            <span className="nomnom-mini-price">৳ 180</span>
          </div>
        </div>
        <div className="nomnom-mini-item">
          <span className="nomnom-mini-thumb">🥟</span>
          <div>
            <span className="nomnom-mini-name">Crispy Gyoza</span>
            <span className="nomnom-mini-price">৳ 260</span>
          </div>
        </div>
      </div>
      <div className="nomnom-floating-cart">
        <div className="nomnom-cart-left">
          <span className="nomnom-cart-icon-wrap">
            <ShoppingBag size={12} />
            <span className="nomnom-cart-count">2</span>
          </span>
          <span>View Cart (2 items)</span>
        </div>
        <span className="nomnom-cart-total">৳ 630 →</span>
      </div>
    </div>
  )
}

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
  projectId,
  shouldReduceMotion = false,
}) {
  const [imgError, setImgError] = useState(false)
  const prevSrc = useRef(src)

  useEffect(() => {
    if (src !== prevSrc.current) {
      setImgError(false)
      prevSrc.current = src
    }
  }, [src])

  const isNomNom = projectId === 'nomnom'
  const isImageAvailable = Boolean(src) && !imgError

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
          <AnimatePresence mode="popLayout" initial={false}>
            {isImageAvailable && (
              <motion.img
                key={src}
                src={src}
                alt={alt}
                className="showcase-screen-img is-ready"
                initial={
                  shouldReduceMotion ? false : { opacity: 0, scale: 1.015 }
                }
                animate={{ opacity: 1, scale: 1 }}
                exit={
                  shouldReduceMotion ? false : { opacity: 0, scale: 0.985 }
                }
                transition={{ duration: 0.28, ease: easeOut }}
                onError={() => setImgError(true)}
                draggable={false}
              />
            )}

            {!isImageAvailable && isNomNom && (
              <motion.div
                key={`nomnom-${index}`}
                initial={
                  shouldReduceMotion ? false : { opacity: 0, scale: 1.015 }
                }
                animate={{ opacity: 1, scale: 1 }}
                exit={
                  shouldReduceMotion ? false : { opacity: 0, scale: 0.985 }
                }
                transition={{ duration: 0.28, ease: easeOut }}
                style={{ width: '100%', height: '100%' }}
              >
                <NomNomScreenPreview index={index} />
              </motion.div>
            )}

            {!isImageAvailable && !isNomNom && (
              <div key={`slot-${index}`} className="showcase-screen-placeholder">
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
              </div>
            )}
          </AnimatePresence>

          <span className="iphone-screen-glare" aria-hidden="true" />
        </div>
        <div className="showcase-phone-home-indicator" />
      </div>
    </div>
  )
}

/**
 * Full-screen immersive project showcase overlay.
 * Triggered when a visitor clicks a project card or "Project Overview".
 *
 * Shows a large CSS phone frame with the active screenshot, prev/next navigation,
 * dot indicators, and a dual-theme Liquid Glass project info panel.
 *
 * @param {Object} props
 * @param {Object|null} props.project - The selected project object, or null to close.
 * @param {number} [props.initialIndex=0] - Starting screenshot index.
 * @param {Function} props.onClose - Callback to dismiss the showcase.
 * @param {'light' | 'dark'} [props.theme='light'] - Active theme.
 * @param {Function} [props.onToggleTheme] - Theme toggle callback.
 */
export default function ProjectShowcase({
  project,
  initialIndex = 0,
  onClose,
  theme = 'light',
  onToggleTheme,
  onScreenIndexChange,
}) {
  const shouldReduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const [cachedProject, setCachedProject] = useState(project)
  const [prevProjectKey, setPrevProjectKey] = useState(
    project ? `${project.id}-${initialIndex}` : '',
  )
  const closeButtonRef = useRef(null)
  const backdropRef = useRef(null)
  const previouslyFocusedElementRef = useRef(null)

  // Retain the last active project & synchronize active screenshot index when project/initialIndex changes
  const currentProjectKey = project ? `${project.id}-${initialIndex}` : ''
  if (project && currentProjectKey !== prevProjectKey) {
    setPrevProjectKey(currentProjectKey)
    setActiveIndex(initialIndex)
    setCachedProject(project)
  }

  const displayProject = project || cachedProject

  const screenshots = displayProject?.screenshots ?? []
  const totalScreenshots = screenshots.length
  const activeShot = screenshots[activeIndex] ?? screenshots[0] ?? null

  // Preload all project screenshots for instantaneous switching
  useEffect(() => {
    if (displayProject?.screenshots && displayProject.screenshots.length > 0) {
      displayProject.screenshots.forEach((shot) => {
        if (shot.src) {
          const img = new window.Image()
          img.src = shot.src
        }
      })
    }
  }, [displayProject?.id, displayProject?.screenshots])

  // Lock body scroll while the showcase is open without losing scroll position
  useEffect(() => {
    if (!project) return undefined
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [project])

  // Shift focus to the close button when opened, and restore focus to trigger on close
  useEffect(() => {
    if (project) {
      previouslyFocusedElementRef.current = document.activeElement
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    } else {
      if (previouslyFocusedElementRef.current?.focus) {
        previouslyFocusedElementRef.current.focus()
      }
    }
  }, [project])

  const handleIndexChange = useCallback(
    (newIndex) => {
      setActiveIndex(newIndex)
      onScreenIndexChange?.(newIndex)
    },
    [onScreenIndexChange],
  )

  const goNext = useCallback(() => {
    if (totalScreenshots < 2) return
    const nextIdx = (activeIndex + 1) % totalScreenshots
    handleIndexChange(nextIdx)
  }, [activeIndex, totalScreenshots, handleIndexChange])

  const goPrev = useCallback(() => {
    if (totalScreenshots < 2) return
    const prevIdx = (activeIndex - 1 + totalScreenshots) % totalScreenshots
    handleIndexChange(prevIdx)
  }, [activeIndex, totalScreenshots, handleIndexChange])

  // Keyboard navigation: ESC closes, arrows navigate screenshots
  useEffect(() => {
    if (!project) return undefined

    const handleKey = (event) => {
      if (event.key === 'Escape') {
        onClose()
      } else if (event.key === 'ArrowRight' && totalScreenshots > 1) {
        goNext()
      } else if (event.key === 'ArrowLeft' && totalScreenshots > 1) {
        goPrev()
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [project, onClose, totalScreenshots, goNext, goPrev])

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
      {project && displayProject && (
        <motion.div
          key="project-showcase-backdrop"
          ref={backdropRef}
          className="showcase-backdrop"
          data-liquid-ignore=""
          role="dialog"
          aria-modal="true"
          aria-label={`${displayProject.title} project showcase`}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32, ease: easeOut }}
          onClick={handleBackdropClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Ambient glow behind the phone, using theme-aware semantic accent */}
          <motion.div
            className="showcase-ambient-glow"
            aria-hidden="true"
            initial={
              shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }
            }
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.4, ease: easeOut }}
          />

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
              transition={{ duration: 0.2 }}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
            >
              <X size={20} />
            </motion.button>
          </div>

          {/* Main content: phone + info panel with spatial zoom origin */}
          <motion.div
            className="showcase-content"
            initial={
              shouldReduceMotion ? false : { opacity: 0, scale: 0.88, y: 16 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              shouldReduceMotion ? false : { opacity: 0, scale: 0.88, y: 14 }
            }
            transition={{ duration: 0.36, ease: easeOut }}
            onClick={(event) => event.stopPropagation()}
          >
            {/* ── Phone column ── */}
            <div className="showcase-phone-col">
              <motion.div
                className="showcase-phone-motion-wrap"
                initial={
                  shouldReduceMotion ? false : { opacity: 0, scale: 0.92, y: 12 }
                }
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={
                  shouldReduceMotion ? false : { opacity: 0, scale: 0.92, y: 10 }
                }
                transition={{ duration: 0.34, ease: easeOut }}
              >
                <PhoneFrame
                  src={activeShot?.src ?? ''}
                  alt={
                    activeShot?.alt ??
                    activeShot?.label ??
                    `${displayProject.title} screenshot`
                  }
                  label={activeShot?.label}
                  index={activeIndex}
                  total={totalScreenshots}
                  projectTitle={displayProject.title}
                  projectId={displayProject.id}
                  shouldReduceMotion={Boolean(shouldReduceMotion)}
                />
              </motion.div>

              {/* Prev / Next navigation + Dot indicators */}
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

                  <div
                    className="showcase-dots"
                    role="tablist"
                    aria-label="Screenshot navigation"
                  >
                    {screenshots.map((shot, index) => (
                      <button
                        key={shot.src || index}
                        type="button"
                        role="tab"
                        aria-selected={index === activeIndex}
                        aria-label={`Screenshot ${index + 1}: ${shot.label ?? ''}`}
                        className={`showcase-dot ${index === activeIndex ? 'is-active' : ''}`}
                        onClick={() => handleIndexChange(index)}
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
              initial={
                shouldReduceMotion ? false : { opacity: 0, x: 24, scale: 0.96 }
              }
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={
                shouldReduceMotion ? false : { opacity: 0, x: 16, scale: 0.96 }
              }
              transition={{ duration: 0.32, delay: 0.04, ease: easeOut }}
            >
              <div
                className="showcase-info-header"
                style={{ position: 'relative', zIndex: 2 }}
              >
                <span className="showcase-info-pill">{displayProject.category}</span>
                {displayProject.badge && (
                  <span className="showcase-info-badge">{displayProject.badge}</span>
                )}
              </div>

              <h2
                className="showcase-info-title"
                style={{ position: 'relative', zIndex: 2 }}
              >
                {displayProject.title}
                <span className="showcase-title-accent">{displayProject.accent}</span>
              </h2>

              <p
                className="showcase-info-role"
                style={{ position: 'relative', zIndex: 2 }}
              >
                {displayProject.role}
              </p>
              <p
                className="showcase-info-desc"
                style={{ position: 'relative', zIndex: 2 }}
              >
                {displayProject.description}
              </p>

              {/* Highlights Section */}
              {displayProject.highlights?.length > 0 && (
                <div
                  className="showcase-info-section"
                  style={{ position: 'relative', zIndex: 2 }}
                >
                  <h3 className="showcase-info-section-heading">Highlights</h3>
                  <ul className="showcase-info-highlights">
                    {displayProject.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech Stack Section */}
              {displayProject.techStack?.length > 0 && (
                <div
                  className="showcase-info-section"
                  style={{ position: 'relative', zIndex: 2 }}
                >
                  <h3 className="showcase-info-section-heading">Tech Stack</h3>
                  <div className="showcase-info-tags">
                    {displayProject.techStack.map((tech) => (
                      <span key={tech} className="showcase-info-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {displayProject.links?.length > 0 && (
                <div
                  className="showcase-info-links"
                  style={{ position: 'relative', zIndex: 2 }}
                >
                  {displayProject.links.map((link) =>
                    link.href ? (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="showcase-info-link-btn glass-button liquid-btn"
                      >
                        <span>{link.label}</span>{' '}
                        <span aria-hidden="true">{link.symbol || '↗'}</span>
                      </a>
                    ) : (
                      <span
                        key={link.label}
                        className="showcase-info-link-btn is-disabled"
                      >
                        <span>{link.label}</span>{' '}
                        <span aria-hidden="true">{link.symbol || '•'}</span>
                      </span>
                    ),
                  )}
                </div>
              )}

              {displayProject.repoNote && (
                <p
                  className="showcase-info-repo-note"
                  style={{ position: 'relative', zIndex: 2 }}
                >
                  {displayProject.repoNote}
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
