import { useState } from 'react'
import { motion } from 'motion/react'
import {
  ChevronDown,
  Clock,
  Compass,
  Flame,
  Home,
  Plus,
  Search,
  ShoppingBag,
  Star,
  User,
} from 'lucide-react'

const DEFAULT_NOMNOM_SCREENSHOT = '/images/nomnom/screen-1.png'

/**
 * Renders the NomNom food delivery mobile application inside a realistic iPhone-inspired
 * titanium hardware frame with Dynamic Island, tactile side buttons, inner bezel,
 * and smooth floating motion.
 *
 * Displays real application screenshots if placed in `public/images/nomnom/`,
 * or renders a rich, high-fidelity Flutter Food Delivery UI preview.
 *
 * @param {Object} props
 * @param {boolean} [props.shouldReduceMotion=false] - Whether to disable animations for accessibility.
 * @param {string} [props.screenshotSrc] - Optional custom path to screenshot.
 * @param {Function} [props.onOpenDetails] - Callback to open the immersive showcase modal.
 * @param {string} [props.floatingBadge] - Optional floating badge beside the phone.
 * @returns {JSX.Element} The rendered NomNom mockup component.
 */
export default function NomNomMockup({
  shouldReduceMotion = false,
  screenshotSrc = DEFAULT_NOMNOM_SCREENSHOT,
  onOpenDetails,
  floatingBadge = '+ Fast Delivery Flow',
}) {
  const [imageError, setImageError] = useState(false)
  const showRealScreenshot = Boolean(screenshotSrc) && !imageError

  return (
    <motion.div
      className="project-mockup-stage"
      aria-label="NomNom Food Delivery application preview"
      initial={
        shouldReduceMotion
          ? false
          : { opacity: 0, scale: 0.92, y: 28, rotateY: -8 }
      }
      whileInView={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.82,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Orbital ambient rings */}
      <motion.div
        className="mockup-orbit-ring is-outer is-nomnom"
        aria-hidden="true"
        animate={shouldReduceMotion ? undefined : { rotate: -360 }}
        transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
      />
      <div className="mockup-orbit-ring is-inner is-nomnom" aria-hidden="true" />

      <motion.div
        className="card-phone-mockup iphone-hardware-frame"
        onClick={onOpenDetails}
        role={onOpenDetails ? 'button' : undefined}
        tabIndex={onOpenDetails ? 0 : undefined}
        aria-label={
          onOpenDetails ? 'Open NomNom interactive showcase' : undefined
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
            : { y: [0, -7, 0], rotate: [-1.2, 0.5, -1.2] }
        }
        whileHover={
          shouldReduceMotion ? undefined : { scale: 1.025, rotate: 0 }
        }
        transition={{ duration: 5.6, repeat: Infinity, ease: 'easeInOut' }}
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
                alt="NomNom food delivery app home screen"
                loading="lazy"
                onError={() => setImageError(true)}
                className="card-phone-screenshot"
                draggable={false}
              />
            ) : (
              <div className="card-phone-fallback-ui is-nomnom">
                {/* Status Bar */}
                <div className="card-phone-status-row">
                  <span>9:41</span>
                  <span className="card-phone-status-pills">
                    <span className="status-live-dot" /> LIVE · 20m
                  </span>
                </div>

                {/* Top Location Bar */}
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

                {/* Search Bar */}
                <div className="nomnom-search-bar">
                  <Search size={12} className="nomnom-search-icon" />
                  <span>Search burgers, ramen, pizza...</span>
                </div>

                {/* Cuisine Filter Tags */}
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

                {/* Featured Dish Card */}
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

                {/* Mini Popular Row */}
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

                {/* Floating Cart Chip */}
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

                {/* Bottom App Navigation */}
                <div className="nomnom-bottom-nav" aria-hidden="true">
                  <span className="nomnom-nav-item is-active">
                    <Home size={13} />
                    <small>Home</small>
                  </span>
                  <span className="nomnom-nav-item">
                    <Compass size={13} />
                    <small>Explore</small>
                  </span>
                  <span className="nomnom-nav-item">
                    <ShoppingBag size={13} />
                    <small>Orders</small>
                  </span>
                  <span className="nomnom-nav-item">
                    <User size={13} />
                    <small>Profile</small>
                  </span>
                </div>
              </div>
            )}

            <span className="iphone-screen-glare" aria-hidden="true" />
            <span className="iphone-home-indicator" aria-hidden="true" />
          </div>
        </div>
      </motion.div>

      {floatingBadge && (
        <motion.div
          className="mockup-floating-badge is-nomnom"
          aria-hidden="true"
          initial={shouldReduceMotion ? false : { opacity: 0, x: -14, y: -6 }}
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
