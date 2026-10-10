import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import useActiveSection from '../hooks/useActiveSection'
import MagneticButton from './MagneticButton'

const NAV_LINKS = [
  { label: 'Work', href: '#work', id: 'work' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Skills', href: '#skills', id: 'skills' },
  { label: 'Contact', href: '#contact', id: 'contact' },
]

const SECTION_IDS = ['home', 'work', 'about', 'skills', 'contact']

/**
 * Main navigation bar component.
 * Features a sliding active indicator on desktop and an accessible menu drawer on mobile.
 */
export default function Navbar({ reveal, linkHover, reducedMotion }) {
  const active = useActiveSection(SECTION_IDS)
  const [hovered, setHovered] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const indicatorTarget = hovered ?? active

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <motion.header className="navbar-wrapper" {...reveal(0.05, -12)}>
      <nav className="navbar" aria-label="Main navigation">
        <a
          className="wordmark"
          href="#home"
          aria-label="Mrh Rafi home"
          onClick={closeMobileMenu}
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
          <MagneticButton shouldReduceMotion={reducedMotion} strength={15}>
            <motion.a
              className="nav-contact"
              href="#contact"
              {...reveal(0.35, -8)}
              whileHover={linkHover}
              whileTap={reducedMotion ? undefined : { scale: 0.97 }}
            >
              Let&apos;s talk <span aria-hidden="true">↗</span>
            </motion.a>
          </MagneticButton>

          <button
            type="button"
            className="mobile-menu-toggle"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            className="mobile-nav-drawer"
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
                  className={`mobile-nav-link${isActive ? ' is-active' : ''}`}
                  onClick={closeMobileMenu}
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
