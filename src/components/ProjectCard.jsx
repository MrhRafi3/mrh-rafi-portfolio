import { motion, useMotionValue, useSpring } from 'motion/react'

const easeOut = [0.22, 1, 0.36, 1]

/**
 * Renders an interactive project showcase card with spotlight hover, subtle 3D tilt,
 * verified tech badges, and support for both live links and pending repositories.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.project - The project data object.
 * @param {boolean} props.shouldReduceMotion - Whether to disable animations for accessibility.
 * @param {Object} props.linkHover - The motion object for link hover state.
 * @param {Function} [props.onOpenDetails] - Optional callback to open the project details modal.
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

  const springConfig = { stiffness: 300, damping: 30, mass: 1 }
  const springRotateX = useSpring(rotateX, springConfig)
  const springRotateY = useSpring(rotateY, springConfig)

  function handleMouseMove(event) {
    if (shouldReduceMotion) return
    if (window.matchMedia?.('(pointer: coarse)').matches) return

    const bounds = event.currentTarget.getBoundingClientRect()

    event.currentTarget.style.setProperty(
      '--spotlight-x',
      `${event.clientX - bounds.left}px`,
    )
    event.currentTarget.style.setProperty(
      '--spotlight-y',
      `${event.clientY - bounds.top}px`,
    )

    const xPct = (event.clientX - bounds.left) / bounds.width - 0.5
    const yPct = (event.clientY - bounds.top) / bounds.height - 0.5

    rotateX.set(yPct * -5)
    rotateY.set(xPct * 5)
  }

  function handleMouseLeave() {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <div style={{ position: 'relative', marginTop: '56px', perspective: '1200px' }}>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '10%',
          right: '-10%',
          width: '480px',
          height: '480px',
          background: `radial-gradient(circle, ${project.themeColor}40 0%, rgba(0,0,0,0) 70%)`,
          zIndex: 0,
          pointerEvents: 'none',
          filter: 'blur(40px)',
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '380px',
          height: '380px',
          background: `radial-gradient(circle, ${project.themeDarkColor}2E 0%, rgba(0,0,0,0) 70%)`,
          zIndex: 0,
          pointerEvents: 'none',
          filter: 'blur(50px)',
        }}
      />

      <motion.article
        className="project-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 38, scale: 0.985 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: easeOut }}
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: 'preserve-3d',
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 290px), 1fr))',
          gap: 'clamp(28px, 5vw, 64px)',
          alignItems: 'center',
          overflow: 'hidden',
          padding: 'clamp(24px, 5vw, 56px)',
          borderRadius: '32px',
          background:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.25) 100%)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          borderTop: '1px solid rgba(255, 255, 255, 0.88)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.7)',
          boxShadow:
            '0 30px 60px rgba(23, 23, 25, 0.06), inset 0 0 20px rgba(255, 255, 255, 0.3)',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '22px',
            }}
          >
            <span
              style={{
                padding: '7px 11px',
                border: `1px solid ${project.themeColor}4D`,
                borderRadius: '99px',
                color: project.themeColor,
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                background: `${project.themeColor}14`,
              }}
            >
              {project.category}
            </span>
            <span
              style={{
                color: '#52525b',
                fontSize: '10px',
                letterSpacing: '1.2px',
                fontWeight: 600,
              }}
            >
              {project.type}
            </span>
            {project.badge && (
              <span
                style={{
                  padding: '4px 9px',
                  borderRadius: '6px',
                  background: 'rgba(23, 23, 25, 0.07)',
                  color: '#27272a',
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                }}
              >
                {project.badge}
              </span>
            )}
          </div>

          <p
            style={{
              margin: '0 0 6px',
              color: project.themeColor,
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '2.6px',
            }}
          >
            {project.tagline}
          </p>
          <h3
            style={{
              margin: '0',
              color: '#111827',
              fontFamily: 'var(--heading-font)',
              fontSize: 'clamp(42px, 6.2vw, 74px)',
              fontWeight: 600,
              letterSpacing: '-3.5px',
              lineHeight: 1.02,
            }}
          >
            {project.title}
            <span style={{ color: project.themeColor }}>{project.accent}</span>
          </h3>
          <p
            style={{
              maxWidth: '430px',
              margin: '20px 0',
              color: '#4b5563',
              fontSize: '15px',
              lineHeight: 1.85,
            }}
          >
            {project.description}
          </p>

          {project.techStack?.length > 0 && (
            <div
              aria-label="Technologies used"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                margin: '0 0 22px',
              }}
            >
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  style={{
                    padding: '5px 11px',
                    borderRadius: '99px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#1f2937',
                    background: 'rgba(255, 255, 255, 0.65)',
                    border: '1px solid rgba(23, 23, 25, 0.1)',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(118px, 1fr))',
              gap: '10px',
              margin: '24px 0',
            }}
          >
            {project.features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.5,
                  delay: shouldReduceMotion ? 0 : index * 0.1,
                  ease: easeOut,
                }}
                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                style={{
                  padding: '15px 12px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.65)',
                  background:
                    'linear-gradient(135deg, rgba(255, 255, 255, 0.78) 0%, rgba(255, 255, 255, 0.35) 100%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.03)',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    marginBottom: '12px',
                    color: project.themeColor,
                    fontSize: '19px',
                  }}
                >
                  {feature.icon}
                </span>
                <p
                  style={{
                    margin: '0 0 4px',
                    color: '#111827',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  {feature.name}
                </p>
                <p
                  style={{
                    margin: 0,
                    color: '#4b5563',
                    fontSize: '11px',
                    lineHeight: 1.55,
                  }}
                >
                  {feature.detail}
                </p>
              </motion.div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              marginTop: '26px',
            }}
          >
            {onOpenDetails && (
              <motion.button
                type="button"
                onClick={() => onOpenDetails(project)}
                whileHover={linkHover}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  minHeight: '44px',
                  padding: '0 18px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: `1px solid ${project.themeColor}`,
                  background: project.themeColor,
                  color: '#ffffff',
                  boxShadow: `0 8px 22px ${project.themeColor}38`,
                }}
              >
                Project Overview <span aria-hidden="true">→</span>
              </motion.button>
            )}

            {project.links.map((link) =>
              link.href ? (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={linkHover}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    minHeight: '44px',
                    padding: '0 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    border: '1px solid rgba(23, 23, 25, 0.14)',
                    background: 'rgba(255, 255, 255, 0.68)',
                    backdropFilter: 'blur(8px)',
                    color: '#111827',
                  }}
                >
                  {link.label} <span aria-hidden="true">{link.symbol}</span>
                </motion.a>
              ) : (
                <span
                  key={link.label}
                  aria-disabled="true"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    minHeight: '44px',
                    padding: '0 15px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    border: '1px dashed rgba(23, 23, 25, 0.2)',
                    background: 'rgba(255, 255, 255, 0.4)',
                    color: '#6b7280',
                  }}
                >
                  {link.label}
                </span>
              ),
            )}
          </div>

          <p
            style={{
              marginTop: '16px',
              color: '#6b7280',
              fontSize: '11px',
              lineHeight: 1.65,
            }}
          >
            {project.repoNote}
          </p>
        </div>
        {children}
      </motion.article>
    </div>
  )
}
