import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { useCallback, useRef, useState } from 'react'
import {
  ArrowUpRight,
  Code2,
  Cpu,
  Layers,
  Mail,
  Smartphone,
  Sparkles,
  User,
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
import NomNomMockup from './components/NomNomMockup'
import MagneticButton from './components/MagneticButton'
import CustomCursor from './components/CustomCursor'
import ProjectShowcase from './components/ProjectShowcase'
import useLiquidGL from './hooks/useLiquidGL'
import useTheme from './hooks/useTheme'
import {
  handleLiquidPointerLeave,
  handleLiquidPointerMove,
} from './utils/liquidInteractions'

const easeOut = [0.22, 1, 0.36, 1]
const CURRENT_YEAR = 2026

/**
 * Central configuration for Mrh Rafi's personal profile and Hero 3D iPhone screen.
 * - Change `heroPhoneScreenSrc` anytime to swap the default screenshot displayed on the 3D iPhone.
 * - Update `email`, `resumeUrl`, or project `links` as they become available.
 */
const PROFILE_CONFIG = {
  name: 'Mrh Rafi',
  title: 'Flutter App Developer',
  secondaryFocus: 'C++ & Data Structures and Algorithms (DSA)',
  location: 'Bangladesh',
  portraitSrc: '/images/rafi-portrait.jpg',
  heroPhoneScreenSrc: '/images/hero-1.png',
  email: 'mrhrafi99@gmail.com',
  resumeUrl: null,
  githubUrl: 'https://github.com/mrhrafi',
  linkedinUrl: 'https://bd.linkedin.com/in/mrhrafi',
}

/**
 * Presets for the Hero 3D iPhone display switcher.
 * Add or replace entries here to preview any app screenshot on the 3D iPhone.
 */
const HERO_SCREEN_OPTIONS = [
  {
    id: 'hero-poster',
    label: 'Mrh Rafi',
    src: '/images/hero-1.png',
  },
  {
    id: 'expify',
    label: 'Expify Beta',
    src: '/images/expify/screen-1.png',
  },
  {
    id: 'clocky',
    label: 'Clocky',
    src: '/images/clocky/screen-1.png',
  },
]

const headlineLines = [
  { text: 'I build apps', accent: false },
  { text: 'that feel', accent: false },
  { text: 'effortless.', accent: true },
]

const projectsData = [
  {
    id: 'clocky',
    category: 'PERSONAL PROJECT',
    type: 'FLUTTER MOBILE APP',
    tagline: 'YOUR TIME, YOUR WAY',
    subtitleNote: 'HOROLOGICAL UTILITY',
    watermark: 'CLOCKY',
    floatingBadge: '+ Made for everyday',
    title: 'Clocky',
    accent: '.',
    screenshotSrc: '/images/clocky/screen-1.png',
    description:
      'A tactile Flutter timekeeping application combining a glowing analog and digital World Clock with quick multi-city timezone selection, customizable alarms, and a precision stopwatch.',
    techStack: ['Flutter', 'Dart', 'Custom Canvas / Analog Clock UI'],
    role: 'Flutter App Developer — UI Design & Mobile Implementation',
    highlights: [
      'Designed a high-contrast World Clock home screen pairing a glowing analog dial with a live digital readout and active city indicator (Dhaka).',
      'Integrated a searchable timezone bottom sheet (Dhaka, London, New York, Dubai, Tokyo, Singapore) and smooth alarm scheduling with repeat-day toggles.',
      'Engineered a precision circular stopwatch with live lap tracking and modular Flutter widgets for responsive, distraction-free utility.',
    ],
    features: [
      { name: 'World Clock', detail: 'Analog & digital time', icon: '◷' },
      { name: 'Alarms & Zones', detail: 'Multi-city & repeat schedules', icon: '◉' },
      { name: 'Stopwatch', detail: 'Circular progress & laps', icon: '◎' },
    ],
    screenshots: [
      {
        src: '/images/clocky/screen-1.png',
        label: 'World Clock',
        alt: 'Clocky World Clock screen showing 09:30:15 PM digital readout, glowing analog clock face, Dhaka timezone pill, and bottom navigation',
      },
      {
        src: '/images/clocky/screen-2.png',
        label: 'Select Time Zone',
        alt: 'Clocky Add / Select Time Zone bottom sheet with search input and UTC offsets for Dhaka, London, New York, Dubai, Tokyo, and Singapore',
      },
      {
        src: '/images/clocky/screen-3.png',
        label: 'Alarms',
        alt: 'Clocky Alarm screen with scheduled alarms list (06:00 AM, 11:02 AM, 10:30 PM), active toggle pills, and floating add button',
      },
      {
        src: '/images/clocky/screen-4.png',
        label: 'Edit Alarm',
        alt: 'Clocky Edit Alarm modal showing 12:30 PM time picker, repeat days selector (M T W T F S S), and Save action',
      },
      {
        src: '/images/clocky/screen-5.png',
        label: 'Stopwatch',
        alt: 'Clocky Stopwatch screen showing 02:34.01 running timer inside a circular progress ring with Lap and Stop controls',
      },
    ],
    links: [
      { label: 'GitHub Repo · Coming Soon', href: null },
    ],
    repoNote: 'Clocky’s dedicated public repository is not available yet.',
  },
  {
    id: 'expify-beta',
    category: 'PERSONAL PROJECT',
    type: 'FLUTTER MOBILE APP',
    badge: 'BETA',
    tagline: 'SMART EXPENSE TRACKING',
    subtitleNote: 'PERSONAL FINANCE FLOW',
    watermark: 'EXPIFY',
    floatingBadge: '+ Track every Taka (৳)',
    title: 'Expify',
    accent: ' Beta',
    screenshotSrc: '/images/expify/screen-1.png',
    description:
      'An expense tracker mobile application built with Flutter that gives users an instant overview of their total balance in BDT (৳), income versus expenses, dedicated project budgets, and visual financial reports.',
    techStack: ['Flutter', 'Dart', 'Mobile UI', 'Expense & Budget Tracking'],
    role: 'Flutter App Developer — Architecture & UI Implementation',
    highlights: [
      'Built a clean home dashboard featuring a prominent Total Balance card (BDT ৳) with live Income and Expense summaries and recent transactions.',
      'Added dedicated Project budget tracking with spent vs. remaining progress bars and an interactive Income vs. Expense donut chart in Reports.',
      'Structured bottom navigation across Home, Projects, Reports, and Settings with category-based transaction entry and Google authentication flow.',
    ],
    features: [
      { name: 'Balance & Feed', detail: 'Live BDT (৳) cashflow', icon: '◈' },
      { name: 'Project Budgets', detail: 'Allocated spending goals', icon: '▤' },
      { name: 'Visual Reports', detail: 'Savings rate & ratio ring', icon: '✓' },
    ],
    screenshots: [
      {
        src: '/images/expify/screen-1.png',
        label: 'Home Dashboard',
        alt: 'Expify Beta home screen showing Total Balance of ৳9,450.00, Income and Expense summary cards, and Recent Transactions',
      },
      {
        src: '/images/expify/screen-2.png',
        label: 'Projects & Budgets',
        alt: 'Expify Beta Projects screen showing active projects count, total spent vs total budget, and Food project budget progress bar',
      },
      {
        src: '/images/expify/screen-3.png',
        label: 'Financial Reports',
        alt: 'Expify Beta Reports screen with Current Net Balance, 95% savings rate badge, and Income vs Expense ratio donut chart',
      },
      {
        src: '/images/expify/screen-4.png',
        label: 'Settings',
        alt: 'Expify Beta Settings screen showing user profile card, language and dark mode preferences, data management, and app version',
      },
      {
        src: '/images/expify/screen-5.png',
        label: 'Add Transaction',
        alt: 'Expify Beta Add Transaction screen with Income/Expense selector, title and amount inputs, and category icon grid',
      },
      {
        src: '/images/expify/screen-6.png',
        label: 'Project Detail',
        alt: 'Expify Beta Food project detail view showing project budget breakdown, 37% usage progress bar, and project-specific transactions',
      },
      {
        src: '/images/expify/screen-7.png',
        label: 'Edit Profile',
        alt: 'Expify Beta Edit Profile screen with circular avatar photo picker, display name field, and Save Profile action',
      },
      {
        src: '/images/expify/screen-8.png',
        label: 'Welcome & Sign In',
        alt: 'Expify Beta onboarding screen highlighting Smart Taka Dashboard, Project & Budget Tracking, and Continue with Google button',
      },
    ],
    links: [
      { label: 'GitHub Repo · Coming Soon', href: null },
    ],
    repoNote:
      'Expify Beta repository is being prepared and will be linked here once pushed to GitHub.',
  },
  {
    id: 'nomnom',
    category: 'PERSONAL PROJECT',
    type: 'FLUTTER MOBILE APP',
    badge: 'FOOD DELIVERY',
    tagline: 'CRAVINGS DELIVERED FAST',
    subtitleNote: 'FOOD ORDERING & DISCOVERY',
    watermark: 'NOMNOM',
    floatingBadge: '+ Fast Delivery Flow',
    title: 'NomNom',
    accent: '.',
    screenshotSrc: '/images/nomnom/screen-1.png',
    description:
      'A contemporary food delivery and restaurant discovery mobile application built with Flutter. Designed with appetizing visuals, real-time menu exploration, dish customization, intuitive cart checkout, and live order tracking.',
    techStack: [
      'Flutter',
      'Dart',
      'State Management',
      'Custom Mobile UI',
      'Cart & Checkout Architecture',
      'Live Order Tracking Flow',
    ],
    role: 'Flutter App Developer — Mobile UI Design & Architecture',
    highlights: [
      'Designed an engaging food discovery home feed with category pills, curated trending restaurants, and quick search filters.',
      'Built a comprehensive dish customizer sheet supporting size choices, add-ons, and real-time order subtotal calculations.',
      'Engineered an intuitive cart summary with voucher discounts and step-by-step simulated live order dispatch tracking.',
    ],
    features: [
      { name: 'Discover & Cuisines', detail: 'Curated feeds & search', icon: '♨' },
      { name: 'Dish Customizer', detail: 'Variations & live price', icon: '✦' },
      { name: 'Cart & Tracking', detail: 'Live courier progress', icon: '⚡' },
    ],
    screenshots: [
      {
        src: '/images/nomnom/screen-1.png',
        label: 'Discover & Cuisines',
        alt: 'NomNom home screen showing delivery address, popular cuisine categories (Burgers, Pizza, Asian, Desserts), search bar, and trending restaurant cards',
      },
      {
        src: '/images/nomnom/screen-2.png',
        label: 'Restaurant & Menu',
        alt: 'NomNom restaurant storefront screen showing rating, delivery fee, menu sections (Chef Specials, Combos, Beverages), and quick Add-to-Cart buttons',
      },
      {
        src: '/images/nomnom/screen-3.png',
        label: 'Dish Customizer',
        alt: 'NomNom dish customizer sheet showing Artisan Burger customization with patty choice, extra cheese, sauce options, and real-time price tally',
      },
      {
        src: '/images/nomnom/screen-4.png',
        label: 'Cart & Checkout',
        alt: 'NomNom cart and checkout screen showing selected order items, promo code input, delivery tip options, breakdown summary, and Place Order button',
      },
      {
        src: '/images/nomnom/screen-5.png',
        label: 'Live Order Tracker',
        alt: 'NomNom order tracking screen showing step-by-step progress (Order Confirmed, Preparing, On the Way), courier map view, and estimated arrival time',
      },
    ],
    links: [
      { label: 'GitHub Repo · Coming Soon', href: null },
    ],
    repoNote:
      'NomNom is in active development; repository and release builds will be available soon.',
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
        focusLabel: 'Primary Framework',
        detail: 'Cross-platform app development, custom widgets, and responsive mobile UI',
      },
      {
        name: 'Dart',
        focusLabel: 'Core Language',
        detail: 'Structured application logic, asynchronous flows, and clean object-oriented code',
      },
      {
        name: 'Mobile UI / UX',
        focusLabel: 'Interface Craft',
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
        focusLabel: 'Core Foundation',
        detail: 'Core programming fundamentals, structured syntax, and performance awareness',
      },
      {
        name: 'Data Structures & Algorithms (DSA)',
        focusLabel: 'Algorithmic Logic',
        detail: 'Problem decomposition, data organization, and step-by-step algorithmic logic',
      },
      {
        name: 'Analytical Debugging',
        focusLabel: 'Code Reliability',
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
        focusLabel: 'Source Control',
        detail: 'Source control, repository management, and iterative development',
      },
      {
        name: 'Modular Architecture',
        focusLabel: 'Widget Structure',
        detail: 'Reusable UI components and clear separation of presentation and logic',
      },
      {
        name: 'VS Code & Flutter DevTools',
        focusLabel: 'Inspection & Debug',
        detail: 'Widget inspection, layout debugging, and iterative refinement',
      },
    ],
    evidence: 'Used across all projects',
  },
]

/**
 * Renders a section heading with optional accented suffix.
 */
function StaggeredHeading({ text, accentText }) {
  return (
    <h2>
      {text} {accentText && <span>{accentText}</span>}
    </h2>
  )
}

/**
 * Renders Mrh Rafi's portrait and personal introduction card in the Hero section.
 * Automatically displays `public/images/rafi-portrait.jpg` when present, or a clean,
 * non-fabricated architectural frame until the real photograph is added.
 */
function HeroIdentityCard({ reveal, shouldReduceMotion }) {
  const [photoAvailable, setPhotoAvailable] = useState(true)

  return (
    <motion.div
      className="hero-identity-card glass-card liquid-glass-card"
      data-liquid-intensity="subtle"
      onPointerMove={(e) => handleLiquidPointerMove(e, shouldReduceMotion)}
      onPointerLeave={handleLiquidPointerLeave}
      {...reveal(0.2, 16)}
    >
      <div className="hero-portrait-frame">
        {photoAvailable ? (
          <img
            src={PROFILE_CONFIG.portraitSrc}
            alt={`${PROFILE_CONFIG.name} — ${PROFILE_CONFIG.title}`}
            className="hero-portrait-img"
            decoding="sync"
            fetchPriority="high"
            draggable={false}
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
 * Main application component.
 * Orchestrates layout, dual-theme state (Clay & Butter × Midnight Espresso),
 * scroll-linked animations, `liquid-gl` optical refraction, layered glass
 * interactions, and 3D presentation.
 */
function App() {
  const shouldReduceMotion = useReducedMotion()
  const { theme, toggleTheme } = useTheme()
  const [ready, setReady] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedScreenIndex, setSelectedScreenIndex] = useState(0)
  const [activeHeroScreen, setActiveHeroScreen] = useState(
    PROFILE_CONFIG.heroPhoneScreenSrc,
  )

  const handleOpenProjectDetails = useCallback((project, screenIdx = 0) => {
    setSelectedScreenIndex(screenIdx)
    setSelectedProject(project)
  }, [])

  /** Mark initial intro animation as complete to trigger hero entrance choreography. */
  const handleIntroDone = useCallback(() => setReady(true), [])

  // Initialize Layer A authentic liquid-gl optical lens refraction once the intro completes
  useLiquidGL({
    enabled: ready,
    reducedMotion: Boolean(shouldReduceMotion),
    theme,
    target: '.liquid-gl-target',
  })

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
  const heroCopyOpacity = useTransform(heroProgress, [0, 0.72], [1, 0])
  const heroCopyY = useTransform(heroProgress, [0, 1], [0, -36])
  const phoneScrollY = useTransform(heroProgress, [0, 1], [0, 42])

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
  const scrollReveal = (distance = 26, delay = 0) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: distance },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: {
      duration: shouldReduceMotion ? 0 : 0.72,
      delay: shouldReduceMotion ? 0 : delay,
      ease: easeOut,
    },
  })

  const linkHover = shouldReduceMotion ? undefined : { y: -3, transition: { duration: 0.2 } }

  const { scrollYProgress: pageScroll } = useScroll()
  const blob1Y = useTransform(pageScroll, [0, 1], ['0%', '30%'])
  const blob2Y = useTransform(pageScroll, [0, 1], ['0%', '-30%'])

  return (
    <main className="portfolio">
      <CustomCursor shouldReduceMotion={shouldReduceMotion} />

      <motion.div
        aria-hidden="true"
        data-liquid-ignore=""
        className="ambient-blob ambient-blob-top"
        style={{ y: blob1Y }}
      />
      <motion.div
        aria-hidden="true"
        data-liquid-ignore=""
        className="ambient-blob ambient-blob-bottom"
        style={{ y: blob2Y }}
      />

      <Intro reducedMotion={shouldReduceMotion} onDone={handleIntroDone} />
      <Navbar
        reveal={reveal}
        linkHover={linkHover}
        reducedMotion={shouldReduceMotion}
        scrollProgress={pageScroll}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <section
        className="hero-section"
        id="home"
        ref={heroRef}
      >
        <motion.div
          className="hero-copy"
          style={{
            opacity: shouldReduceMotion ? 1 : heroCopyOpacity,
            y: shouldReduceMotion ? 0 : heroCopyY,
          }}
        >
          <motion.div className="availability glass-surface" {...reveal(0.12)}>
            <span className="status-dot" /> FLUTTER APP DEVELOPER
          </motion.div>

          <HeroIdentityCard
            reveal={reveal}
            shouldReduceMotion={shouldReduceMotion}
          />

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
            <MagneticButton shouldReduceMotion={shouldReduceMotion} strength={14}>
              <motion.a
                className="button-primary glass-button liquid-btn"
                href="#work"
                whileHover={
                  shouldReduceMotion ? undefined : { y: -3, scale: 1.015 }
                }
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              >
                <span>Explore My Projects</span> <span aria-hidden="true">↗</span>
              </motion.a>
            </MagneticButton>
            <MagneticButton shouldReduceMotion={shouldReduceMotion} strength={14}>
              <motion.a
                className="button-secondary glass-button liquid-btn"
                href="#contact"
                whileHover={linkHover}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              >
                <span>Get in Touch</span> <span aria-hidden="true">→</span>
              </motion.a>
            </MagneticButton>
            {PROFILE_CONFIG.resumeUrl && (
              <MagneticButton shouldReduceMotion={shouldReduceMotion} strength={14}>
                <motion.a
                  className="button-secondary glass-button liquid-btn"
                  href={PROFILE_CONFIG.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={linkHover}
                >
                  <span>Resume</span> <span aria-hidden="true">↗</span>
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
          <motion.div
            className="phone-tilt"
            style={{
              y: shouldReduceMotion ? 0 : phoneScrollY,
            }}
          >
            <HeroPhone
              reducedMotion={shouldReduceMotion}
              scrollProgress={heroProgress}
              screenImageSrc={activeHeroScreen}
              pageReady={ready}
            />
          </motion.div>

          <motion.div
            className="floating-label label-top glass-surface"
            data-depth="20"
            {...reveal(0.75, 12)}
          >
            <span className="label-dot" /> Built with Flutter
          </motion.div>

          <motion.div
            className="hero-screen-switcher glass-surface"
            role="group"
            aria-label="Switch 3D iPhone app screen"
            {...reveal(0.9, 10)}
          >
            <span className="switcher-caption">3D DISPLAY:</span>
            {HERO_SCREEN_OPTIONS.map((option) => {
              const isActive = activeHeroScreen === option.src
              return (
                <button
                  key={option.id}
                  type="button"
                  className={`switcher-pill liquid-btn${isActive ? ' is-active' : ''}`}
                  aria-pressed={isActive}
                  onClick={() => setActiveHeroScreen(option.src)}
                >
                  <span>{option.label}</span>
                </button>
              )
            })}
          </motion.div>

          <motion.div
            className="floating-label label-bottom glass-surface"
            data-depth="24"
            {...reveal(0.88, 12)}
          >
            <span className="label-icon" aria-hidden="true">✦</span> Dart &amp; Flutter UI
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
      </section>

      <motion.section
        className="intro-strip glass-surface"
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
        className="next-section works-section"
        id="work"
        ref={workRef}
        {...scrollReveal(26)}
      >
        <div className="section-header-row">
          <p className="eyebrow">01 / SELECTED WORK</p>
        </div>

        <div className="works-heading-row">
          <h2 className="works-display-heading">
            Featured <span className="works-heading-accent">Projects.</span>
          </h2>
          <p className="works-lead-copy">
            Mobile applications built with Flutter, focusing on clean architecture,
            intuitive touch interactions, and fluid 60fps performance.
          </p>
        </div>

        <div className="projects-grid">
          {projectsData.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              shouldReduceMotion={Boolean(shouldReduceMotion)}
              linkHover={linkHover}
              onOpenDetails={() => handleOpenProjectDetails(project, 0)}
            >
              {project.id === 'clocky' && (
                <ClockyMockup
                  shouldReduceMotion={Boolean(shouldReduceMotion)}
                  screenshotSrc={project.screenshotSrc}
                  onOpenDetails={() => handleOpenProjectDetails(project, 0)}
                  floatingBadge={project.floatingBadge}
                />
              )}
              {project.id === 'expify-beta' && (
                <ExpifyMockup
                  shouldReduceMotion={Boolean(shouldReduceMotion)}
                  screenshotSrc={project.screenshotSrc}
                  onOpenDetails={() => handleOpenProjectDetails(project, 0)}
                  floatingBadge={project.floatingBadge}
                />
              )}
              {project.id === 'nomnom' && (
                <NomNomMockup
                  shouldReduceMotion={Boolean(shouldReduceMotion)}
                  screenshotSrc={project.screenshotSrc}
                  onOpenDetails={() => handleOpenProjectDetails(project, 0)}
                  floatingBadge={project.floatingBadge}
                />
              )}
            </ProjectCard>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="about-section-upgraded"
        id="about"
        ref={aboutRef}
        {...scrollReveal(26)}
      >
        <div className="section-header-row">
          <p className="eyebrow">02 / ABOUT ME</p>
        </div>

        <motion.div
          className="about-narrative-card glass-card liquid-glass-card"
          data-liquid-intensity="medium"
          onPointerMove={(e) => handleLiquidPointerMove(e, shouldReduceMotion)}
          onPointerLeave={handleLiquidPointerLeave}
          {...scrollReveal(22, 0.08)}
        >
          <div className="about-narrative-copy" style={{ position: 'relative', zIndex: 2 }}>
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

          <div className="about-quick-facts" style={{ position: 'relative', zIndex: 2 }}>
            <div className="quick-fact-item glass-panel">
              <span className="quick-fact-label">PRIMARY ROLE</span>
              <strong>Flutter App Developer</strong>
            </div>
            <div className="quick-fact-item glass-panel">
              <span className="quick-fact-label">CORE STACK</span>
              <strong>Flutter &amp; Dart</strong>
            </div>
            <div className="quick-fact-item glass-panel">
              <span className="quick-fact-label">FOUNDATION</span>
              <strong>C++ &amp; DSA</strong>
            </div>
            <div className="quick-fact-item glass-panel">
              <span className="quick-fact-label">LOCATION</span>
              <strong>Bangladesh</strong>
            </div>
          </div>
        </motion.div>

        <div className="about-pillars-grid">
          {aboutPillars.map((pillar, index) => (
            <motion.article
              key={pillar.number}
              className="about-pillar-card glass-card liquid-glass-card"
              data-liquid-intensity="subtle"
              onPointerMove={(e) => handleLiquidPointerMove(e, shouldReduceMotion)}
              onPointerLeave={handleLiquidPointerLeave}
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
              <div style={{ position: 'relative', zIndex: 2 }}>
                <span className="pillar-number">{pillar.number}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="skills-section-upgraded"
        id="skills"
        ref={skillsRef}
        {...scrollReveal(26)}
      >
        <div className="section-header-row">
          <p className="eyebrow">03 / TECHNICAL SKILLS</p>
        </div>

        <div className="skills-category-grid">
          {skillCategories.map((group, index) => {
            const GroupIcon = group.icon
            return (
              <motion.article
                key={group.id}
                className="skill-category-card glass-card liquid-glass-card"
                data-liquid-intensity="medium"
                onPointerMove={(e) => handleLiquidPointerMove(e, shouldReduceMotion)}
                onPointerLeave={handleLiquidPointerLeave}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.6,
                  delay: shouldReduceMotion ? 0 : index * 0.1,
                  ease: easeOut,
                }}
                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
              >
                <div className="skill-card-top-rim" aria-hidden="true" />

                <div className="skill-category-top" style={{ position: 'relative', zIndex: 2 }}>
                  <span className="skill-category-tag">
                    {group.number} · {group.category}
                  </span>
                  <span className="skill-category-icon">
                    <GroupIcon size={20} strokeWidth={1.7} />
                  </span>
                </div>

                <h3 style={{ position: 'relative', zIndex: 2 }}>{group.title}</h3>
                <p className="skill-category-desc" style={{ position: 'relative', zIndex: 2 }}>
                  {group.description}
                </p>

                <div className="skill-items-list">
                  {group.items.map((item) => (
                    <div key={item.name} className="skill-item-row glass-panel">
                      <div className="skill-item-header">
                        <div className="skill-item-name">
                          <Sparkles size={13} className="skill-sparkle-icon" />
                          <strong>{item.name}</strong>
                        </div>
                        {item.focusLabel && (
                          <span className="skill-focus-badge">{item.focusLabel}</span>
                        )}
                      </div>
                      <p>{item.detail}</p>
                    </div>
                  ))}
                </div>

                <div className="skill-category-footer" style={{ position: 'relative', zIndex: 2 }}>
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
        {...scrollReveal(26)}
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
              className="contact-channel-card glass-card liquid-glass-card liquid-btn"
              data-liquid-intensity="subtle"
              href={PROFILE_CONFIG.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              onPointerMove={(e) => handleLiquidPointerMove(e, shouldReduceMotion)}
              onPointerLeave={handleLiquidPointerLeave}
              whileHover={linkHover}
            >
              <span className="contact-channel-icon" style={{ position: 'relative', zIndex: 2 }}>
                <LinkedInIcon size={20} />
              </span>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <span className="contact-channel-label">LINKEDIN</span>
                <strong>in/mrhrafi</strong>
                <small>Connect professionally</small>
              </div>
              <ArrowUpRight size={18} className="contact-channel-arrow" style={{ position: 'relative', zIndex: 2 }} />
            </motion.a>

            <motion.a
              className="contact-channel-card glass-card liquid-glass-card liquid-btn"
              data-liquid-intensity="subtle"
              href={PROFILE_CONFIG.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onPointerMove={(e) => handleLiquidPointerMove(e, shouldReduceMotion)}
              onPointerLeave={handleLiquidPointerLeave}
              whileHover={linkHover}
            >
              <span className="contact-channel-icon" style={{ position: 'relative', zIndex: 2 }}>
                <GitHubIcon size={20} />
              </span>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <span className="contact-channel-label">GITHUB</span>
                <strong>@mrhrafi</strong>
                <small>Explore my repositories &amp; code</small>
              </div>
              <ArrowUpRight size={18} className="contact-channel-arrow" style={{ position: 'relative', zIndex: 2 }} />
            </motion.a>

            {PROFILE_CONFIG.email ? (
              <motion.a
                className="contact-channel-card glass-card liquid-glass-card liquid-btn"
                data-liquid-intensity="subtle"
                href={`mailto:${PROFILE_CONFIG.email}`}
                onPointerMove={(e) => handleLiquidPointerMove(e, shouldReduceMotion)}
                onPointerLeave={handleLiquidPointerLeave}
                whileHover={linkHover}
              >
                <span className="contact-channel-icon" style={{ position: 'relative', zIndex: 2 }}>
                  <Mail size={20} />
                </span>
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <span className="contact-channel-label">DIRECT EMAIL</span>
                  <strong>{PROFILE_CONFIG.email}</strong>
                  <small>You can mail me anytime</small>
                </div>
                <ArrowUpRight size={18} className="contact-channel-arrow" style={{ position: 'relative', zIndex: 2 }} />
              </motion.a>
            ) : (
              <div className="contact-channel-card glass-card liquid-glass-card is-placeholder">
                <span className="contact-channel-icon">
                  <Mail size={20} />
                </span>
                <div>
                  <span className="contact-channel-label">DIRECT EMAIL</span>
                  <strong>mrhrafi99@gmail.com</strong>
                  <small>You can mail me anytime</small>
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

      <ProjectShowcase
        key={`${selectedProject?.id ?? 'closed'}-${selectedScreenIndex}`}
        project={selectedProject}
        initialIndex={selectedScreenIndex}
        onClose={() => setSelectedProject(null)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    </main>
  )
}

export default App
