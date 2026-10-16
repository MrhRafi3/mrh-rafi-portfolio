import { motion, useMotionValue, useSpring } from 'motion/react'
import {
  handleLiquidPointerLeave,
  handleLiquidPointerMove,
} from '../utils/liquidInteractions'

const easeOut = [0.22, 1, 0.36, 1]

function GitHubRepoIcon({ size = 15 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

/**
 * Renders an interactive project showcase card with dual-theme Liquid Glass
 * layering, cursor-following specular reflection, and subtle 3D perspective response.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.project - The project data object.
 * @param {boolean} props.shouldReduceMotion - Whether to disable animations for accessibility.
 * @param {Object} props.linkHover - The motion object for link hover state.
 * @param {Function} [props.onOpenDetails] - Optional callback to open the project showcase.
 * @param {React.ReactNode} props.children - Visual mockup rendered alongside the project copy.
 * @returns {JSX.Element} The rendered project card component.
 */
export default function ProjectCard({
  project,
  shouldReduceMotion,
  linkHover,
  onOpenDetails,
  children,
}) {
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  const springConfig = { stiffness: 280, damping: 30, mass: 1 }
  const springRotateX = useSpring(rotateX, springConfig)
  const springRotateY = useSpring(rotateY, springConfig)

  function handlePointerMove(event) {
    handleLiquidPointerMove(event, shouldReduceMotion)

    if (shouldReduceMotion) return
    if (event.pointerType && event.pointerType !== 'mouse') return
    if (window.matchMedia?.('(pointer: coarse)').matches) return

    const bounds = event.currentTarget.getBoundingClientRect()
    if (bounds.width === 0 || bounds.height === 0) return

    const xPct = (event.clientX - bounds.left) / bounds.width - 0.5
    const yPct = (event.clientY - bounds.top) / bounds.height - 0.5

    rotateX.set(yPct * -2.2)
    rotateY.set(xPct * 2.2)
  }

  function handlePointerLeave(event) {
    handleLiquidPointerLeave(event)
    rotateX.set(0)
    rotateY.set(0)
  }

  const repoLinks = Array.isArray(project.links) ? project.links : []

  return (
    <div className="project-card-stage" data-project={project.id}>
      <div className="project-card-ambient-glow" aria-hidden="true" />

      <motion.article
        className="project-card glass-card liquid-glass-card"
        data-liquid-intensity="medium"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        initial={
          shouldReduceMotion ? false : { opacity: 0, y: 28, scale: 0.985 }
        }
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.14 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.72, ease: easeOut }}
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="project-card-copy">
          <div className="project-card-meta-row">
            <span className="project-category-pill">{project.category}</span>
            {project.badge && (
              <span className="project-beta-badge">
                <span className="project-beta-dot" aria-hidden="true" />
                {project.badge}
              </span>
            )}
          </div>

          <p className="project-tagline">{project.tagline}</p>

          <h3
            className="project-title"
            onClick={onOpenDetails ? () => onOpenDetails(project) : undefined}
            role={onOpenDetails ? 'button' : undefined}
            tabIndex={onOpenDetails ? 0 : undefined}
            onKeyDown={
              onOpenDetails
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onOpenDetails(project)
                    }
                  }
                : undefined
            }
            style={onOpenDetails ? { cursor: 'pointer' } : undefined}
          >
            {project.title}
            <span className="project-title-accent">{project.accent}</span>
          </h3>

          <p className="project-description">{project.description}</p>

          {project.techStack?.length > 0 && (
            <div aria-label="Technologies used" className="project-tech-stack">
              {project.techStack.map((tech) => (
                <span key={tech} className="project-tech-pill">
                  {tech}
                </span>
              ))}
            </div>
          )}

          <div className="project-features-grid">
            {project.features.map((feature, index) => (
              <motion.div
                key={feature.name}
                className="project-feature-card glass-panel"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.45,
                  delay: shouldReduceMotion ? 0 : index * 0.07,
                  ease: easeOut,
                }}
                whileHover={shouldReduceMotion ? undefined : { y: -2 }}
              >
                <span className="project-feature-icon" aria-hidden="true">
                  {feature.icon}
                </span>
                <p className="project-feature-name">{feature.name}</p>
                <p className="project-feature-detail">{feature.detail}</p>
              </motion.div>
            ))}
          </div>

          <div className="project-actions-row">
            {onOpenDetails && (
              <motion.button
                type="button"
                className="liquid-btn glass-button project-overview-btn"
                onClick={() => onOpenDetails(project)}
                whileHover={linkHover}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              >
                <span>Project Overview</span>
                <span className="btn-arrow" aria-hidden="true">
                  →
                </span>
              </motion.button>
            )}

            {repoLinks.map((link) =>
              link.href ? (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="liquid-btn glass-button project-secondary-link"
                  whileHover={linkHover}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                >
                  <GitHubRepoIcon size={15} />
                  <span>{link.label}</span>
                  <span className="btn-arrow" aria-hidden="true">
                    {link.symbol || '↗'}
                  </span>
                </motion.a>
              ) : (
                <span
                  key={link.label}
                  aria-disabled="true"
                  className="project-disabled-link"
                  title={project.repoNote || undefined}
                >
                  <GitHubRepoIcon size={14} />
                  <span>{link.label}</span>
                </span>
              ),
            )}
          </div>
        </div>

        <div className="project-card-visual">{children}</div>
      </motion.article>
    </div>
  )
}
