import { useState } from 'react'
import { motion } from 'motion/react'
import useActiveSection from '../hooks/useActiveSection'

const NAV_LINKS = [
  { label: 'Work', href: '#work', id: 'work' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Skills', href: '#skills', id: 'skills' },
]

const SECTION_IDS = ['home', 'work', 'about', 'skills', 'contact']

export default function Navbar({ reveal, linkHover, reducedMotion }) {
  const active = useActiveSection(SECTION_IDS)
  const [hovered, setHovered] = useState(null)

  // One red underline slides to the hovered link, or rests on the active one.
  const indicatorTarget = hovered ?? active

  return (
    <motion.nav
      className="navbar"
      aria-label="Main navigation"
      {...reveal(0.05, -12)}
    >
      <a className="wordmark" href="#home" aria-label="Mrh Rafi home">
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

      <motion.a
        className="nav-contact"
        href="#contact"
        {...reveal(0.35, -8)}
        whileHover={linkHover}
        whileTap={reducedMotion ? undefined : { scale: 0.97 }}
      >
        Let's talk <span aria-hidden="true">↗</span>
      </motion.a>
    </motion.nav>
  )
}
