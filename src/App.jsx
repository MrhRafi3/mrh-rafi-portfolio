import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useScroll,
  useTransform,
} from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowUpRight,
  Code2,
  Cpu,
  Layers,
  Mail,
  Smartphone,
  Sparkles,
  User,
  X,
} from 'lucide-react'

function GitHubIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function LinkedInIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}
import './index.css'
import './hero-upgrade.css'
import Intro from './components/Intro'
import Navbar from './components/Navbar'
import HeroPhone from './components/HeroPhone'
import ProjectCard from './components/ProjectCard'
import ClockyMockup from './components/ClockyMockup'
import ExpifyMockup from './components/ExpifyMockup'
import MagneticButton from './components/MagneticButton'
import CustomCursor from './components/CustomCursor'

const easeOut = [0.22, 1, 0.36, 1]
const CURRENT_YEAR = 2026

/**
 * Central configuration for Mrh Rafi's personal profile and assets.
 * Update `portraitSrc`, `email`, `resumeUrl`, or project `repoUrl` here as assets become available.
 */
const PROFILE_CONFIG = {
  name: 'Mrh Rafi',
  title: 'Flutter App Developer',
  secondaryFocus: 'C++ & Data Structures and Algorithms (DSA)',
  location: 'Bangladesh',
  portraitSrc: '/images/rafi-portrait.jpg',
  email: null,
  resumeUrl: null,
  githubUrl: 'https://github.com/mrirafi',
  linkedinUrl: 'https://bd.linkedin.com/in/mrhrafi',
}

const headlineLines = [
  { text: 'I build apps', accent: false },
  { text: 'that feel', accent: false },
  { text: 'effortless.', accent: true },
]

const projectsData = [
  {
    id: 'clocky',
    themeColor: '#d6603a',
    themeDarkColor: '#c24119',
    category: 'PERSONAL PROJECT',
    type: 'FLUTTER MOBILE APP',
    tagline: 'YOUR TIME, YOUR WAY',
    title: 'Clocky',
    accent: '.',
    description:
      'Timekeeping essentials brought together in one clean mobile experience. Designed around clarity, readable typography, and smooth everyday utility.',
    techStack: ['Flutter', 'Dart', 'Custom Mobile UI'],
    role: 'Flutter App Developer — UI Design & Mobile Implementation',
    highlights: [
      'Unified clock, alarm, and stopwatch workflows inside a single cohesive dark-mode mobile interface.',
      'Focused on high-contrast typography and distraction-free controls for quick daily interactions.',
      'Structured with modular Flutter widgets for consistent spacing, smooth transitions, and maintainability.',
    ],
    features: [
      { name: 'Clock', detail: 'Time at a glance', icon: '◷' },
      { name: 'Alarm', detail: 'Start your day', icon: '◉' },
      { name: 'Stopwatch', detail: 'Every second counts', icon: '◎' },
    ],
    links: [
      { label: 'GitHub Profile', href: 'https://github.com/mrirafi', symbol: '↗' },
      { label: 'LinkedIn Profile', href: 'https://bd.linkedin.com/in/mrhrafi', symbol: '↗' },
    ],
    repoNote: 'Clocky’s dedicated public repository is not available yet.',
  },
  {
    id: 'expify-beta',
    themeColor: '#e0582b',
    themeDarkColor: '#9e3311',
    category: 'PERSONAL PROJECT',
    type: 'FLUTTER MOBILE APP',
    badge: 'BETA',
    tagline: 'SMART EXPENSE TRACKING',
    title: 'Expify',
    accent: ' Beta',
    description:
      'An expense tracker mobile application built with Flutter to help users log daily transactions, organize spending categories, and keep personal finances clear.',
    techStack: ['Flutter', 'Dart', 'Mobile UI', 'Expense Tracking'],
    role: 'Flutter App Developer — Architecture & UI Implementation',
    highlights: [
      'Designed a clean, mobile-first expense logging flow focused on speed and clarity.',
      'Structured transaction and category views in Flutter so daily spending remains easy to review.',
      'Currently in Beta and being prepared for public release on GitHub.',
    ],
    features: [
      { name: 'Expenses', detail: 'Log daily spending', icon: '◈' },
      { name: 'Categories', detail: 'Organize transactions', icon: '▤' },
      { name: 'Clarity', detail: 'Focused mobile UI', icon: '✓' },
    ],
    screenshots: [
      {
        src: '/images/expify/screen-1.png',
        label: 'Expify Beta Screen 1',
        alt: 'Expify Beta expense overview screen',
      },
      {
        src: '/images/expify/screen-2.png',
        label: 'Expify Beta Screen 2',
        alt: 'Expify Beta transaction logging screen',
      },
      {
        src: '/images/expify/screen-3.png',
        label: 'Expify Beta Screen 3',
        alt: 'Expify Beta category breakdown screen',
      },
    ],
    links: [
      { label: 'GitHub Repo · Coming Soon', href: null, symbol: '⏳' },
      { label: 'GitHub Profile', href: 'https://github.com/mrirafi', symbol: '↗' },
    ],
    repoNote:
      'Expify Beta repository is being prepared and will be linked here once pushed to GitHub.',
  },
]

const aboutPillars = [
  {
    number: '01',
    title: 'Flutter-First Mobile Craft',
    description:
      'I specialize in building cross-platform mobile applications with Flutter and Dart, translating ideas into responsive, tactile interfaces that feel natural on every screen.',
  },
  {
    number: '02',
    title: 'Clean UI & User Experience',
    description:
      'Great apps respect the user’s attention. I focus on visual hierarchy, smooth micro-interactions, and clean component structure so every screen is immediately understandable.',
  },
  {
    number: '03',
    title: 'C++ & Algorithmic Foundations',
    description:
      'Alongside mobile development, my foundation in C++ and Data Structures & Algorithms (DSA) sharpens how I break down complex logic, structure data, and solve problems.',
  },
]

const skillCategories = [
  {
    id: 'mobile',
    number: '01',
    category: 'PRIMARY FOCUS',
    title: 'Mobile App Development',
    icon: Smartphone,
    description:
      'Core technologies I use to design, build, and polish cross-platform mobile applications.',
    items: [
      {
        name: 'Flutter',
        detail: 'Cross-platform app development, custom widgets, and responsive mobile UI',
      },
      {
        name: 'Dart',
        detail: 'Structured application logic, asynchronous flows, and clean object-oriented code',
      },
      {
        name: 'Mobile UI / UX',
        detail: 'Layout composition, typography, theme systems, and purposeful motion',
      },
    ],
    evidence: 'Applied in Clocky & Expify Beta',
  },
  {
    id: 'foundations',
    number: '02',
    category: 'TECHNICAL FOUNDATIONS',
    title: 'Programming & Problem Solving',
    icon: Cpu,
    description:
      'Foundational computer science and algorithmic thinking that support reliable engineering.',
    items: [
      {
        name: 'C++',
        detail: 'Core programming fundamentals, structured syntax, and performance awareness',
      },
      {
        name: 'Data Structures & Algorithms (DSA)',
        detail: 'Problem decomposition, data organization, and step-by-step algorithmic logic',
      },
      {
        name: 'Analytical Debugging',
        detail: 'Tracing edge cases and writing predictable, maintainable solutions',
      },
    ],
    evidence: 'Core engineering foundation',
  },
  {
    id: 'workflow',
    number: '03',
    category: 'DEVELOPMENT WORKFLOW',
    title: 'Tools & Engineering Practice',
    icon: Code2,
    description:
      'Everyday tools and habits for keeping projects organized, readable, and ready to scale.',
    items: [
      {
        name: 'Git & GitHub',
        detail: 'Source control, repository management, and iterative development',
      },
      {
        name: 'Modular Architecture',
        detail: 'Reusable UI components and clear separation of presentation and logic',
      },
      {
        name: 'VS Code & Flutter DevTools',
        detail: 'Widget inspection, layout debugging, and iterative refinement',
      },
    ],
    evidence: 'Used across all projects',
  },
]

/**
 * Renders a section heading with staggered word reveal animations and optional accented suffix.
 */
function StaggeredHeading({ text, accentText, shouldReduceMotion }) {
  if (shouldReduceMotion) {
    return (
      <h2>
        {text} {accentText && <span>{accentText}</span>}
      </h2>
    )
  }

  const words = text.split(' ')
  return (
    <h2
      aria-label={accentText ? `${text} ${accentText}` : text}
      style={{ display: 'flex', flexWrap: 'wrap', gap: '0.24em' }}
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`} style={{ overflow: 'hidden', display: 'inline-block' }}>
          <motion.span
            initial={{ y: '100%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: index * 0.07, ease: easeOut }}
            style={{ display: 'inline-block' }}
          >
            {word}
          </motion.span>
        </span>
      ))}
      {accentText && (
        <span style={{ overflow: 'hidden', display: 'inline-block' }}>
          <motion.span
            initial={{ y: '100%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: words.length * 0.07, ease: easeOut }}
            style={{ display: 'inline-block' }}
          >
            <span>{accentText}</span>
          </motion.span>
        </span>
      )}
    </h2>
  )
}

/**
 * Renders Mrh Rafi's portrait and personal introduction card in the Hero section.
 * Automatically displays `public/images/rafi-portrait.jpg` when present, or a clean,
 * non-fabricated architectural frame until the real photograph is added.
 */
function HeroIdentityCard({ reveal }) {
  const [photoAvailable, setPhotoAvailable] = useState(true)

  return (
    <motion.div className="hero-identity-card" {...reveal(0.2, 16)}>
      <div className="hero-portrait-frame">
        {photoAvailable ? (
          <img
            src={PROFILE_CONFIG.portraitSrc}
            alt={`${PROFILE_CONFIG.name} — ${PROFILE_CONFIG.title}`}
            className="hero-portrait-img"
            onError={() => setPhotoAvailable(false)}
          />
        ) : (
          <div
            className="hero-portrait-placeholder"
            title="Add your real photo at public/images/rafi-portrait.jpg"
          >
            <User size={22} strokeWidth={1.8} />
            <span>PHOTO</span>
          </div>
        )}
        <span className="portrait-status-ring" aria-hidden="true" />
      </div>

      <div className="hero-identity-copy">
        <p className="hero-greeting">
          Hi, I&apos;m <strong>{PROFILE_CONFIG.name}</strong>
        </p>
        <p className="hero-role-line">
          <span className="role-primary">{PROFILE_CONFIG.title}</span>
          <span className="role-divider" aria-hidden="true">·</span>
          <span className="role-secondary">C++ &amp; DSA</span>
        </p>
        {!photoAvailable && (
          <p className="hero-photo-hint">
            Portrait slot ready: <code>public/images/rafi-portrait.jpg</code>
          </p>
        )}
      </div>
    </motion.div>
  )
}

/**
 * Accessible modal displaying detailed project information, architecture notes, and screenshot status.
 */
function ProjectDetailsModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="project-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="project-modal-card"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.28, ease: easeOut }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="project-modal-header">
              <div>
                <span className="project-modal-pill">{project.category}</span>
                <h3 id="modal-project-title">
                  {project.title}
                  <span style={{ color: project.themeColor }}>{project.accent}</span>
                </h3>
              </div>
              <button
                type="button"
                className="project-modal-close"
                aria-label="Close project details"
                onClick={onClose}
              >
                <X size={18} />
              </button>
            </div>

            <p className="project-modal-role">
              <strong>Role:</strong> {project.role}
            </p>
            <p className="project-modal-desc">{project.description}</p>

            <div className="project-modal-section">
              <h4>Key Implementation Highlights</h4>
              <ul>
                {project.highlights?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="project-modal-section">
              <h4>Technologies Used</h4>
              <div className="project-modal-tags">
                {project.techStack?.map((tech) => (
                  <span key={tech} className="project-modal-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {project.screenshots?.length > 0 && (
              <div className="project-modal-section">
                <h4>Application Screenshots Setup</h4>
                <p className="project-modal-note">
                  Place your real Expify Beta screenshots in{' '}
                  <code>public/images/expify/</code> (e.g.,{' '}
                  <code>screen-1.png</code>, <code>screen-2.png</code>,{' '}
                  <code>screen-3.png</code>) and they will automatically render in
                  the interactive preview frame.
                </p>
              </div>
            )}

            <div className="project-modal-footer">
              <span className="project-modal-repo-note">{project.repoNote}</span>
              <button
                type="button"
                className="button-primary"
                onClick={onClose}
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Main application component.
 * Orchestrates layout, scroll-linked animations, and 3D interactions.
 */
function App() {
  const shouldReduceMotion = useReducedMotion()
  const [ready, setReady] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  /** Mark initial intro animation as complete to mount heavy components. */
  const handleIntroDone = useCallback(() => setReady(true), [])

  const stageRef = useRef(null)
  const heroRef = useRef(null)
  const introRef = useRef(null)
  const workRef = useRef(null)
  const aboutRef = useRef(null)
  const skillsRef = useRef(null)
  const contactRef = useRef(null)

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.9])
  const heroCopyOpacity = useTransform(heroProgress, [0, 0.65], [1, 0])
  const heroCopyY = useTransform(heroProgress, [0, 1], [0, -44])
  const phoneScrollY = useTransform(heroProgress, [0, 1], [0, 56])

  const phoneRotateXValue = useMotionValue(0)
  const phoneRotateYValue = useMotionValue(0)
  const phoneRotateX = useSpring(phoneRotateXValue, { stiffness: 180, damping: 22 })
  const phoneRotateY = useSpring(phoneRotateYValue, { stiffness: 180, damping: 22 })

  /** Rotates the 3D phone model based on mouse position within the hero container. */
  const handlePhoneMouseMove = (event) => {
    if (shouldReduceMotion) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height
    phoneRotateXValue.set((0.5 - y) * 12)
    phoneRotateYValue.set((x - 0.5) * 14)
  }

  /** Resets phone rotation when mouse leaves the hero container. */
  const handlePhoneMouseLeave = () => {
    phoneRotateXValue.set(0)
    phoneRotateYValue.set(0)
  }

  /** Creates a parallax effect on the background elements based on cursor movement. */
  const handleStagePointerMove = (event) => {
    if (shouldReduceMotion || event.pointerType !== 'mouse') return
    const stage = stageRef.current
    if (!stage) return
    const bounds = stage.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    stage.style.setProperty('--mx', x.toFixed(3))
    stage.style.setProperty('--my', y.toFixed(3))
  }

  /** Clears the parallax effect values when the cursor leaves. */
  const handleStagePointerLeave = () => {
    const stage = stageRef.current
    if (!stage) return
    stage.style.setProperty('--mx', '0')
    stage.style.setProperty('--my', '0')
  }

  /** Generates animation variants for elements that fade and slide up on initial load. */
  const reveal = (delay = 0, distance = 24) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: distance },
    animate: ready || shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: distance },
    transition: {
      duration: shouldReduceMotion ? 0 : 0.8,
      delay: shouldReduceMotion ? 0 : delay,
      ease: easeOut,
    },
  })

  /** Generates animation variants for elements that reveal as they scroll into view. */
  const scrollReveal = (distance = 28) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: distance },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: shouldReduceMotion ? 0 : 0.72, ease: easeOut },
  })

  const linkHover = shouldReduceMotion ? undefined : { y: -3, transition: { duration: 0.2 } }

  const { scrollYProgress: pageScroll } = useScroll()
  const blob1Y = useTransform(pageScroll, [0, 1], ['0%', '35%'])
  const blob2Y = useTransform(pageScroll, [0, 1], ['0%', '-35%'])

  return (
    <main className="portfolio">
      <CustomCursor shouldReduceMotion={shouldReduceMotion} />

      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '-12%',
          left: '-10%',
          width: '46vw',
          height: '46vw',
          background:
            'radial-gradient(circle, rgba(241, 100, 54, 0.045) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          zIndex: 0,
          pointerEvents: 'none',
          y: blob1Y,
        }}
      />
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: '-12%',
          right: '-10%',
          width: '52vw',
          height: '52vw',
          background:
            'radial-gradient(circle, rgba(194, 65, 25, 0.035) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          zIndex: 0,
          pointerEvents: 'none',
          y: blob2Y,
        }}
      />

      <Intro reducedMotion={shouldReduceMotion} onDone={handleIntroDone} />
      <Navbar reveal={reveal} linkHover={linkHover} reducedMotion={shouldReduceMotion} />

      <motion.section
        className="hero-section"
        id="home"
        ref={heroRef}
        style={{
          scale: shouldReduceMotion ? 1 : heroScale,
          transformOrigin: 'center top',
        }}
      >
        <motion.div
          className="hero-copy"
          style={{
            opacity: shouldReduceMotion ? 1 : heroCopyOpacity,
            y: shouldReduceMotion ? 0 : heroCopyY,
          }}
        >
          <motion.div className="availability" {...reveal(0.12)}>
            <span className="status-dot" /> FLUTTER APP DEVELOPER
          </motion.div>

          <HeroIdentityCard reveal={reveal} />

          <motion.p className="eyebrow" {...reveal(0.26)}>
            INDEPENDENT MOBILE DEVELOPER · BANGLADESH
          </motion.p>

          <h1 aria-label="I build apps that feel effortless.">
            {headlineLines.map((line, index) => (
              <span className="line-mask" key={line.text} aria-hidden="true">
                <motion.span
                  className={`line-inner${line.accent ? ' accent-text' : ''}`}
                  initial={shouldReduceMotion ? false : { y: '112%' }}
                  animate={{ y: ready || shouldReduceMotion ? '0%' : '112%' }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.95,
                    delay: shouldReduceMotion ? 0 : 0.3 + index * 0.12,
                    ease: easeOut,
                  }}
                >
                  {line.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p className="hero-description" {...reveal(0.55)}>
            I build thoughtful, user-focused mobile experiences with{' '}
            <strong>Flutter</strong>—combining clean UI craftsmanship with
            strong problem-solving foundations in <strong>C++</strong> and{' '}
            <strong>Data Structures &amp; Algorithms</strong>.
          </motion.p>

          <motion.div className="hero-actions" {...reveal(0.68)}>
            <MagneticButton shouldReduceMotion={shouldReduceMotion} strength={15}>
              <motion.a
                className="button-primary"
                href="#work"
                whileHover={
                  shouldReduceMotion ? undefined : { y: -4, scale: 1.02 }
                }
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              >
                Explore My Projects <span aria-hidden="true">↗</span>
              </motion.a>
            </MagneticButton>
            <MagneticButton shouldReduceMotion={shouldReduceMotion} strength={15}>
              <motion.a
                className="button-secondary"
                href="#contact"
                whileHover={linkHover}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              >
                Get in Touch <span aria-hidden="true">→</span>
              </motion.a>
            </MagneticButton>
            {PROFILE_CONFIG.resumeUrl && (
              <MagneticButton shouldReduceMotion={shouldReduceMotion} strength={15}>
                <motion.a
                  className="button-secondary"
                  href={PROFILE_CONFIG.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={linkHover}
                >
                  Resume <span aria-hidden="true">↗</span>
                </motion.a>
              </MagneticButton>
            )}
          </motion.div>

          <motion.div className="hero-location" {...reveal(0.82, 10)}>
            <span aria-hidden="true">↳</span> Based in {PROFILE_CONFIG.location} · Open to Mobile App Opportunities
          </motion.div>
        </motion.div>

        <motion.div
          className="visual-stage"
          ref={stageRef}
          onPointerMove={handleStagePointerMove}
          onPointerLeave={handleStagePointerLeave}
          initial={
            shouldReduceMotion ? false : { opacity: 0, scale: 0.94, y: 24 }
          }
          animate={
            ready || shouldReduceMotion
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 0, scale: 0.94, y: 24 }
          }
          transition={{
            duration: shouldReduceMotion ? 0 : 1,
            delay: shouldReduceMotion ? 0 : 0.25,
            ease: easeOut,
          }}
        >
          <motion.div
            className="orbit orbit-one"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.8 }}
            animate={
              ready || shouldReduceMotion
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.8 }
            }
            transition={{ duration: 1.2, delay: 0.45, ease: easeOut }}
          />
          <motion.div
            className="orbit orbit-two"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.8 }}
            animate={
              ready || shouldReduceMotion
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.8 }
            }
            transition={{ duration: 1.2, delay: 0.6, ease: easeOut }}
          />
          <motion.div className="floating-label label-top" {...reveal(0.7, 14)}>
            <span className="label-icon">✳</span> Crafted with purpose
          </motion.div>
          <motion.div
            className="phone-tilt"
            style={{
              rotateX: phoneRotateX,
              rotateY: phoneRotateY,
              y: shouldReduceMotion ? 0 : phoneScrollY,
              transformPerspective: 1000,
            }}
            onMouseMove={handlePhoneMouseMove}
            onMouseLeave={handlePhoneMouseLeave}
          >
            <HeroPhone
              reducedMotion={shouldReduceMotion}
              scrollProgress={heroProgress}
            />
          </motion.div>
          <motion.div
            className="floating-label label-bottom"
            {...reveal(0.85, -14)}
          >
            <span className="label-dot" /> Built with Flutter
          </motion.div>
          <motion.div className="tech-label" {...reveal(0.95, 8)}>
            FLUTTER · DART · C++ · DSA
          </motion.div>
        </motion.div>

        <motion.div className="hero-index" {...reveal(1, 8)}>
          <span>01</span>
          <span className="index-line" />
          <span>SCROLL TO EXPLORE</span>
        </motion.div>
      </motion.section>

      <motion.section
        className="intro-strip"
        ref={introRef}
        aria-label="Core engineering pillars"
        {...scrollReveal(18)}
      >
        {[
          'FLUTTER APP DEVELOPMENT',
          'CLEAN MOBILE UI / UX',
          'C++ & DSA PROBLEM SOLVING',
        ].map((item, index) => (
          <span key={item} style={{ display: 'contents' }}>
            <motion.p
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.5,
                delay: shouldReduceMotion ? 0 : index * 0.12,
                ease: easeOut,
              }}
            >
              {item}
            </motion.p>
            {index < 2 && <span aria-hidden="true">✳</span>}
          </span>
        ))}
      </motion.section>

      <motion.section
        className="next-section"
        id="work"
        ref={workRef}
        {...scrollReveal(28)}
      >
        <div className="section-header-row">
          <div>
            <p className="eyebrow">01 / SELECTED PROJECTS</p>
            <StaggeredHeading
              text="Featured"
              accentText="Works."
              shouldReduceMotion={shouldReduceMotion}
            />
          </div>
          <p className="section-lead">
            Real mobile applications built with Flutter—focused on everyday
            utility, clean interfaces, and thoughtful user flows.
          </p>
        </div>

        {projectsData.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            shouldReduceMotion={shouldReduceMotion}
            linkHover={linkHover}
            onOpenDetails={setSelectedProject}
          >
            {project.id === 'clocky' ? (
              <ClockyMockup shouldReduceMotion={shouldReduceMotion} />
            ) : (
              <ExpifyMockup
                shouldReduceMotion={shouldReduceMotion}
                screenshots={project.screenshots}
                onOpenDetails={() => setSelectedProject(project)}
              />
            )}
          </ProjectCard>
        ))}
      </motion.section>

      <motion.section
        className="about-section-upgraded"
        id="about"
        ref={aboutRef}
        {...scrollReveal(28)}
      >
        <div className="section-header-row">
          <div>
            <p className="eyebrow">02 / ABOUT ME</p>
            <StaggeredHeading
              text="Curious by nature. Intentional by"
              accentText="design."
              shouldReduceMotion={shouldReduceMotion}
            />
          </div>
          <p className="section-lead">
            Flutter App Developer based in Bangladesh, dedicated to building
            mobile software that feels calm, fast, and genuinely useful.
          </p>
        </div>

        <div className="about-narrative-card">
          <div className="about-narrative-copy">
            <p>
              Hi, I&apos;m <strong>Mrh Rafi</strong>. My primary focus is
              designing and building cross-platform mobile applications with{' '}
              <strong>Flutter</strong> and <strong>Dart</strong>. I enjoy taking
              an idea from a blank canvas to a polished mobile product—paying
              close attention to layout rhythm, responsive touch interactions,
              and clean widget architecture.
            </p>
            <p>
              Alongside mobile development, I have built a strong foundation in{' '}
              <strong>C++</strong> and{' '}
              <strong>Data Structures &amp; Algorithms (DSA)</strong>. That
              background shapes how I approach engineering challenges: thinking
              clearly about state, edge cases, and code maintainability rather
              than just surface visuals.
            </p>
          </div>

          <div className="about-quick-facts">
            <div className="quick-fact-item">
              <span className="quick-fact-label">PRIMARY ROLE</span>
              <strong>Flutter App Developer</strong>
            </div>
            <div className="quick-fact-item">
              <span className="quick-fact-label">CORE STACK</span>
              <strong>Flutter &amp; Dart</strong>
            </div>
            <div className="quick-fact-item">
              <span className="quick-fact-label">FOUNDATION</span>
              <strong>C++ &amp; DSA</strong>
            </div>
            <div className="quick-fact-item">
              <span className="quick-fact-label">LOCATION</span>
              <strong>Bangladesh</strong>
            </div>
          </div>
        </div>

        <div className="about-pillars-grid">
          {aboutPillars.map((pillar, index) => (
            <motion.article
              key={pillar.number}
              className="about-pillar-card"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.55,
                delay: shouldReduceMotion ? 0 : index * 0.1,
                ease: easeOut,
              }}
              whileHover={shouldReduceMotion ? undefined : { y: -4 }}
            >
              <span className="pillar-number">{pillar.number}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="skills-section-upgraded"
        id="skills"
        ref={skillsRef}
        {...scrollReveal(28)}
      >
        <div className="section-header-row">
          <div>
            <p className="eyebrow">03 / TECHNICAL SKILLS</p>
            <StaggeredHeading
              text="Tools for thoughtful"
              accentText="products."
              shouldReduceMotion={shouldReduceMotion}
            />
          </div>
          <p className="section-lead">
            A focused, truthful technical toolkit centered on Flutter mobile
            engineering and strong algorithmic problem-solving.
          </p>
        </div>

        <div className="skills-category-grid">
          {skillCategories.map((group, index) => {
            const GroupIcon = group.icon
            return (
              <motion.article
                key={group.id}
                className="skill-category-card"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.6,
                  delay: shouldReduceMotion ? 0 : index * 0.1,
                  ease: easeOut,
                }}
              >
                <div className="skill-category-top">
                  <span className="skill-category-tag">
                    {group.number} · {group.category}
                  </span>
                  <span className="skill-category-icon">
                    <GroupIcon size={20} strokeWidth={1.7} />
                  </span>
                </div>

                <h3>{group.title}</h3>
                <p className="skill-category-desc">{group.description}</p>

                <div className="skill-items-list">
                  {group.items.map((item) => (
                    <div key={item.name} className="skill-item-row">
                      <div className="skill-item-name">
                        <Sparkles size={13} color="#f16436" />
                        <strong>{item.name}</strong>
                      </div>
                      <p>{item.detail}</p>
                    </div>
                  ))}
                </div>

                <div className="skill-category-footer">
                  <Layers size={13} />
                  <span>{group.evidence}</span>
                </div>
              </motion.article>
            )
          })}
        </div>
      </motion.section>

      <motion.footer
        className="footer"
        id="contact"
        ref={contactRef}
        {...scrollReveal(28)}
      >
        <div className="contact-showcase">
          <div className="contact-copy">
            <p className="eyebrow">04 / GET IN TOUCH</p>
            <StaggeredHeading
              text="Let's build something"
              accentText="meaningful."
              shouldReduceMotion={shouldReduceMotion}
            />
            <p className="contact-description">
              Interested in collaborating on a Flutter application, discussing a
              mobile role, or connecting over software engineering? Reach out
              through any of my verified channels below.
            </p>
          </div>

          <div className="contact-cards-grid">
            <motion.a
              className="contact-channel-card"
              href={PROFILE_CONFIG.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={linkHover}
            >
              <span className="contact-channel-icon">
                <LinkedInIcon size={20} />
              </span>
              <div>
                <span className="contact-channel-label">LINKEDIN</span>
                <strong>in/mrhrafi</strong>
                <small>Connect professionally</small>
              </div>
              <ArrowUpRight size={18} className="contact-channel-arrow" />
            </motion.a>

            <motion.a
              className="contact-channel-card"
              href={PROFILE_CONFIG.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={linkHover}
            >
              <span className="contact-channel-icon">
                <GitHubIcon size={20} />
              </span>
              <div>
                <span className="contact-channel-label">GITHUB</span>
                <strong>@mrirafi</strong>
                <small>Explore my repositories &amp; code</small>
              </div>
              <ArrowUpRight size={18} className="contact-channel-arrow" />
            </motion.a>

            {PROFILE_CONFIG.email ? (
              <motion.a
                className="contact-channel-card"
                href={`mailto:${PROFILE_CONFIG.email}`}
                whileHover={linkHover}
              >
                <span className="contact-channel-icon">
                  <Mail size={20} />
                </span>
                <div>
                  <span className="contact-channel-label">DIRECT EMAIL</span>
                  <strong>{PROFILE_CONFIG.email}</strong>
                  <small>Send me a message</small>
                </div>
                <ArrowUpRight size={18} className="contact-channel-arrow" />
              </motion.a>
            ) : (
              <div className="contact-channel-card is-placeholder">
                <span className="contact-channel-icon">
                  <Mail size={20} />
                </span>
                <div>
                  <span className="contact-channel-label">DIRECT EMAIL</span>
                  <strong>Email Slot Ready</strong>
                  <small>Set PROFILE_CONFIG.email in src/App.jsx</small>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div className="footer-brand-col">
            <a className="wordmark" href="#home">
              mrh<span>.</span>rafi
            </a>
            <p className="footer-tagline">
              Mrh Rafi · Flutter App Developer · Bangladesh
            </p>
          </div>

          <div className="footer-nav-col">
            <a href="#home">Home</a>
            <a href="#work">Projects</a>
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
          </div>

          <p className="footer-note">
            © {CURRENT_YEAR} Mrh Rafi · Crafted with Flutter spirit &amp; React Three Fiber.
          </p>
        </div>
      </motion.footer>

      <ProjectDetailsModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </main>
  )
}

export default App
