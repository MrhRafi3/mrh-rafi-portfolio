import { useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { Menu, X } from 'lucide-react'
import useActiveSection from '../hooks/useActiveSection'
import MagneticButton from './MagneticButton'
import ThemeToggle from './ThemeToggle'

const NAV_LINKS = [
  { label: 'Work', href: '#work', id: 'work' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Skills', href: '#skills', id: 'skills' },
  { label: 'Contact', href: '#contact', id: 'contact' },
]

const SECTION_IDS = [
  'home',
  'work',
  'clocky',
  'expify',
  'expify-beta',
  'nomnom',
  'about',
  'skills',
  'contact',
]

/**
 * Main navigation bar component.
 * Features a floating Liquid Glass bar (`.glass-nav` + Layer A `liquid-gl` lens),
 * integrated Water-Fluid Theme Switcher, top-edge scroll progress indicator,
 * smooth active section indicator, and an accessible menu drawer on mobile.
 */
export default function Navbar({
  reveal,
  linkHover,
  reducedMotion,
  scrollProgress,
  theme,
  onToggleTheme,
  activeSection,
  onNavigate,
}) {
  const detectedActive = useActiveSection(SECTION_IDS)
  const rawActive = activeSection || detectedActive
  const isWorkActive = ['work', 'clocky', 'expify', 'expify-beta', 'nomnom'].includes(rawActive)
  const active = isWorkActive ? 'work' : rawActive
  const [hovered, setHovered] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { scrollYProgress: fallbackScroll } = useScroll()
  const activeScrollProgress = scrollProgress || fallbackScroll
  const smoothScrollProgress = useSpring(activeScrollProgress, {
    stiffness: 220,
    damping: 32,
    mass: 0.4,
  })

  const indicatorTarget = hovered ?? active

  const closeMobileMenu = () => setMobileMenuOpen(false)

  const handleLinkClick = (e, targetId) => {
    if (onNavigate) {
      e.preventDefault()
      onNavigate(targetId)
    }
    closeMobileMenu()
  }

  return (
    <motion.header className="navbar-wrapper" {...reveal(0.05, -12)}>
      <div className="scroll-progress-track" aria-hidden="true">
        <motion.div
          className="scroll-progress-bar"
          style={{
            scaleX: reducedMotion ? activeScrollProgress : smoothScrollProgress,
          }}
        />
      </div>

      <div className="navbar-shell">
        {/* Layer A: Authentic WebGPU/WebGL liquid-gl optical lens backdrop */}
        <div
          className="navbar-glass-lens glass-nav liquid-gl-target"
          aria-hidden="true"
        />

        <nav className="navbar glass-nav" aria-label="Main navigation">
          <a
            className="wordmark"
            href="#home"
            aria-label="Mrh Rafi home"
            onClick={(e) => handleLinkClick(e, 'home')}
          >
            mrh<span>.</span>rafi
          </a>

          <div className="nav-links" onMouseLeave={() => setHovered(null)}>
            {NAV_LINKS.map((link, index) => {
              const isActive = active === link.id

              return (
                <motion.a
                  key={link.id}
                  href={link.href}
                  className={`nav-link${isActive ? ' is-active' : ''}`}
                  aria-current={isActive ? 'location' : undefined}
                  onMouseEnter={() => setHovered(link.id)}
                  onFocus={() => setHovered(link.id)}
                  onBlur={() => setHovered(null)}
                  onClick={(e) => handleLinkClick(e, link.id)}
                  {...reveal(0.12 + index * 0.08, -8)}
                >
                  <span>{link.label}</span>

                  {indicatorTarget === link.id && (
                    <motion.span
                      className="nav-indicator"
                      layoutId="nav-indicator"
                      aria-hidden="true"
                      transition={
                        reducedMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 500, damping: 38 }
                      }
                    />
                  )}
                </motion.a>
              )
            })}
          </div>

          <div className="nav-right-actions">
            <motion.div {...reveal(0.3, -8)}>
              <ThemeToggle
                theme={theme}
                onToggle={onToggleTheme}
                reducedMotion={reducedMotion}
              />
            </motion.div>

            <MagneticButton shouldReduceMotion={reducedMotion} strength={14}>
              <motion.a
                className="nav-contact glass-button liquid-btn"
                href="#contact"
                {...reveal(0.35, -8)}
                whileHover={linkHover}
                whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                onClick={(e) => handleLinkClick(e, 'contact')}
              >
                <span>Let&apos;s talk</span> <span aria-hidden="true">↗</span>
              </motion.a>
            </MagneticButton>

            <button
              type="button"
              className="mobile-menu-toggle glass-button liquid-btn"
              aria-label={
                mobileMenuOpen
                  ? 'Close navigation menu'
                  : 'Open navigation menu'
              }
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            className="mobile-nav-drawer glass-panel liquid-glass-card"
            data-liquid-ignore=""
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
          >
            {NAV_LINKS.map((link) => {
              const isActive = active === link.id
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`mobile-nav-link liquid-btn${isActive ? ' is-active' : ''}`}
                  onClick={(e) => handleLinkClick(e, link.id)}
                >
                  <span>{link.label}</span>
                  <span aria-hidden="true">→</span>
                </a>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
