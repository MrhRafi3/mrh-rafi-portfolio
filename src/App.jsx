import {
  motion,
  useReducedMotion,
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
import MagneticButton from './components/MagneticButton'
import CustomCursor from './components/CustomCursor'
import ProjectShowcase, {
  NomNomScreenPreview,
} from './components/ProjectShowcase'
import TravelWorld3D from './components/TravelWorld3D'
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
    screenshotSrc: '/images/NomNom/home.png',
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
        src: '/images/NomNom/splash-interface.png',
        label: 'Splash & Brand',
        alt: 'NomNom splash branding interface featuring the bold NomNom emblem, "Crave It · Tap It · Taste It" tagline, and developer signature',
      },
      {
        src: '/images/NomNom/home.png',
        label: 'Home Feed & Deals',
        alt: 'NomNom main home feed showing delivery address in Mirpur-6, food search bar, 25% off Daily Cravings promo banner, food categories, and Best Sellers section',
      },
      {
        src: '/images/NomNom/explore-menu.png',
        label: 'Explore & Menus',
        alt: 'NomNom explore screen showing cuisine filter tabs, restaurant listings, dish cards with ratings, preparation time, and pricing',
      },
      {
        src: '/images/NomNom/food.png',
        label: 'Dish Customizer',
        alt: 'NomNom dish customizer sheet showing Fiery Crispy Chicken Royale with portion selector, custom toppings, spice level options, and Add to Cart action',
      },
      {
        src: '/images/NomNom/food-combo.png',
        label: 'Feast Box Combo',
        alt: 'NomNom feast box combo view showcasing bundled value meals, side selections, beverage flavor picker, 20% savings badge, and order summary',
      },
      {
        src: '/images/NomNom/cart.png',
        label: 'Cart & Checkout',
        alt: 'NomNom cart and checkout view with itemized order breakdown, delivery address in Mirpur-6, promo code voucher field, and Proceed to Checkout button',
      },
      {
        src: '/images/NomNom/order-tracking.png',
        label: 'Live Order Tracker',
        alt: 'NomNom live order tracking view showing estimated 18-minute arrival countdown, courier route map, multi-stage delivery timeline, and driver contact options',
      },
      {
        src: '/images/NomNom/offers.png',
        label: 'Offers & Rewards',
        alt: 'NomNom rewards and discounts screen displaying Silver Flame Member loyalty status, crown reward points, active discount vouchers, and coupon redemption cards',
      },
      {
        src: '/images/NomNom/progile-settings.png',
        label: 'Profile & Settings',
        alt: 'NomNom profile and account settings screen for Mrh Rafi showing saved delivery locations, payment methods, order history, and preferences',
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

const SCENE_TARGETS = [
  { id: 'home', percent: 0.0, label: 'Hero', num: '01' },
  { id: 'clocky', percent: 1 / 6, label: 'Clocky', num: '02' },
  { id: 'expify', percent: 2 / 6, label: 'Expify Beta', num: '03' },
  { id: 'nomnom', percent: 3 / 6, label: 'NomNom', num: '04' },
  { id: 'about', percent: 4 / 6, label: 'About', num: '05' },
  { id: 'skills', percent: 5 / 6, label: 'Skills', num: '06' },
  { id: 'contact', percent: 1.0, label: 'Contact', num: '07' },
]

/**
 * Sleek floating vertical waypoint HUD displayed on the right edge on desktop.
 * Shows progress across all 7 scenes and provides single-click smooth camera navigation.
 */
function CinematicWaypointHUD({ activeSection, onSelectScene }) {
  return (
    <nav className="cinematic-waypoint-hud" aria-label="Scene navigation waypoints">
      {SCENE_TARGETS.map((scene, idx) => {
        const isActive =
          activeSection === scene.id ||
          (scene.id === 'clocky' && activeSection === 'work')
        return (
          <button
            key={scene.id}
            type="button"
            className={`waypoint-btn${isActive ? ' is-active' : ''}`}
            onClick={() => onSelectScene(idx)}
            aria-label={`Jump to ${scene.label}`}
            aria-current={isActive ? 'step' : undefined}
          >
            <span className="waypoint-dot" />
            <span className="waypoint-tooltip">
              {scene.num} · {scene.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

/**
 * Media display component inside the Cinematic Project Chamber's phone frame.
 * Renders the real screenshot image, with automatic fallback to NomNomScreenPreview
 * for NomNom if an image is missing or fails to load.
 */
function ChamberPhoneMedia({ project, currentScreen, screenIndex }) {
  const [failedSrc, setFailedSrc] = useState(null)

  const isFailed = failedSrc === currentScreen?.src
  if (isFailed || !currentScreen?.src) {
    if (project.id === 'nomnom') {
      return <NomNomScreenPreview index={screenIndex} />
    }
    return null
  }

  return (
    <img
      key={currentScreen.src}
      src={currentScreen.src}
      alt={currentScreen.alt || `${project.title} mobile screen`}
      className="cinematic-phone-img"
      loading="lazy"
      onError={() => setFailedSrc(currentScreen.src)}
    />
  )
}

/**
 * Renders a full-screen cinematic project destination scene for the 3D scroll journey.
 * Features distinct atmospheric backdrop, verified project copy, feature chips,
 * and a prominent titanium smartphone mockup with an interactive screenshot switcher.
 */
function CinematicProjectChamber({
  project,
  sceneId,
  journeyNumber,
  chamberClass,
  scale,
  z,
  opacity,
  pointerEvents,
  isMotionDisabled,
  screenIndex,
  onSetScreenIndex,
  onOpenDetails,
  backdrop,
}) {
  const currentScreen = project.screenshots[screenIndex] || project.screenshots[0]

  return (
    <motion.section
      className={`cinematic-scene-chamber cinematic-project-scene ${chamberClass}`}
      id={sceneId}
      style={{
        scale: isMotionDisabled ? 1 : scale,
        z: isMotionDisabled ? 0 : z,
        opacity: isMotionDisabled ? 1 : opacity,
        pointerEvents: isMotionDisabled ? 'auto' : pointerEvents,
      }}
    >
      {backdrop}

      <div className="cinematic-scene-inner">
        <div className="cinematic-project-stage">
          {/* Left Column: Project Copy & Specifications */}
          <div className="cinematic-project-copy">
            <div className="project-kicker-row">
              <span className="project-kicker-badge">
                {journeyNumber} · {project.category}
              </span>
              {project.badge && (
                <span className="project-status-badge">
                  <span className="badge-dot" />
                  {project.badge}
                </span>
              )}
            </div>

            <h2 className="cinematic-project-heading">
              {project.title}
              <span className="accent-text">{project.accent}</span>
            </h2>

            <p className="cinematic-project-tagline">{project.tagline}</p>

            <p className="cinematic-project-desc">{project.description}</p>

            {/* 3 Key Feature Bullets */}
            <div className="cinematic-project-features">
              {project.features?.map((feat) => (
                <div key={feat.name} className="project-feature-chip glass-surface">
                  <span className="feature-chip-icon" aria-hidden="true">{feat.icon}</span>
                  <div className="feature-chip-text">
                    <strong>{feat.name}</strong>
                    <span>{feat.detail}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tech Stack Chips */}
            <div className="cinematic-project-tech-row">
              {project.techStack.map((tech) => (
                <span key={tech} className="tech-chip">
                  {tech}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="cinematic-project-actions">
              <button
                type="button"
                className="button-primary glass-button liquid-btn"
                onClick={() => onOpenDetails(project, screenIndex)}
              >
                <span>Explore Full Showcase</span>
                <span aria-hidden="true">↗</span>
              </button>

              {project.links?.[0]?.href ? (
                <a
                  href={project.links[0].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-secondary glass-button liquid-btn"
                >
                  <GitHubIcon size={16} />
                  <span>GitHub Repo</span>
                </a>
              ) : (
                <span className="button-secondary glass-button repo-coming-soon">
                  <GitHubIcon size={16} />
                  <span>Repo Coming Soon</span>
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Hero Smartphone Showcase */}
          <div className="cinematic-phone-showcase">
            {project.floatingBadge && (
              <div className="phone-floating-badge glass-surface">
                {project.floatingBadge}
              </div>
            )}

            <div
              className="cinematic-phone-frame iphone-hardware-frame"
              onClick={() => onOpenDetails(project, screenIndex)}
              role="button"
              tabIndex={0}
              aria-label={`Open ${project.title} full showcase`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onOpenDetails(project, screenIndex)
                }
              }}
            >
              <span className="iphone-side-btn is-action" aria-hidden="true" />
              <span className="iphone-side-btn is-vol-up" aria-hidden="true" />
              <span className="iphone-side-btn is-vol-down" aria-hidden="true" />
              <span className="iphone-side-btn is-power" aria-hidden="true" />

              <div className="iphone-inner-bezel">
                <div className="card-phone-screen-wrap">
                  <span className="iphone-dynamic-island" aria-hidden="true">
                    <span className="iphone-camera-lens" />
                  </span>

                  <ChamberPhoneMedia
                    project={project}
                    currentScreen={currentScreen}
                    screenIndex={screenIndex}
                  />

                  <div className="iphone-screen-glare" aria-hidden="true" />
                  <div className="iphone-home-indicator" aria-hidden="true" />

                  <div className="phone-click-hint" aria-hidden="true">
                    <span>Click for Details ↗</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Screenshot Switcher Bar */}
            <div className="screenshot-switcher-bar glass-surface">
              <div className="switcher-nav-controls">
                <button
                  type="button"
                  className="switcher-arrow-btn"
                  aria-label="Previous screenshot"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSetScreenIndex(
                      (screenIndex - 1 + project.screenshots.length) % project.screenshots.length
                    )
                  }}
                >
                  ‹
                </button>
                <div className="switcher-counter">
                  <strong>{String(screenIndex + 1).padStart(2, '0')}</strong>
                  <span className="divider">/</span>
                  <span>{String(project.screenshots.length).padStart(2, '0')}</span>
                  <span style={{ marginLeft: 6, fontSize: 10, color: 'var(--text-secondary)' }}>
                    · {currentScreen?.label}
                  </span>
                </div>
                <button
                  type="button"
                  className="switcher-arrow-btn"
                  aria-label="Next screenshot"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSetScreenIndex(
                      (screenIndex + 1) % project.screenshots.length
                    )
                  }}
                >
                  ›
                </button>
              </div>

              <div className="screenshot-selector-strip">
                {project.screenshots.map((screen, sIdx) => {
                  const isActive = sIdx === screenIndex
                  return (
                    <button
                      key={screen.src}
                      type="button"
                      className={`screenshot-pill-btn${isActive ? ' is-active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        onSetScreenIndex(sIdx)
                      }}
                      title={screen.label}
                      aria-pressed={isActive}
                    >
                      <span className="pill-dot" />
                      <span className="pill-text">{screen.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
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

  // Interactive screenshot state for the 3 dedicated project scenes
  const [clockyScreenIndex, setClockyScreenIndex] = useState(0)
  const [expifyScreenIndex, setExpifyScreenIndex] = useState(0)
  const [nomnomScreenIndex, setNomnomScreenIndex] = useState(0)

  const handleOpenProjectDetails = useCallback((project, screenIdx = 0) => {
    setSelectedScreenIndex(screenIdx)
    setSelectedProject(project)
  }, [])

  const handleShowcaseScreenChange = useCallback(
    (index) => {
      setSelectedScreenIndex(index)
      if (selectedProject?.id === 'clocky') {
        setClockyScreenIndex(index)
      } else if (selectedProject?.id === 'expify-beta') {
        setExpifyScreenIndex(index)
      } else if (selectedProject?.id === 'nomnom') {
        setNomnomScreenIndex(index)
      }
    },
    [selectedProject?.id],
  )

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
  const masterTrackRef = useRef(null)
  const [activeSection, setActiveSection] = useState('home')
  const currentSectionRef = useRef('home')

  const isMotionDisabled = Boolean(shouldReduceMotion)

  // ── Master Pinned 3D Camera Scroll Engine (7 Scenes across 6 intervals: 1/6 ≈ 0.1667)
  const { scrollYProgress: masterProgress } = useScroll({
    target: masterTrackRef,
    offset: ['start start', 'end end'],
  })

  // ── Environmental dynamic lighting transitions across the 7 scenes
  const ambientColor = useTransform(
    masterProgress,
    [0.0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 1.0],
    [
      'rgba(255, 113, 56, 0.28)',  // Scene 0: Radiant Orange (Hero)
      'rgba(56, 189, 248, 0.26)',  // Scene 1: Celestial Blue (Clocky)
      'rgba(16, 185, 129, 0.26)',  // Scene 2: Emerald / Mint (Expify)
      'rgba(249, 115, 22, 0.26)',  // Scene 3: Sunset Coral (NomNom)
      'rgba(57, 123, 255, 0.22)',  // Scene 4: Electric Blue (About)
      'rgba(99, 102, 241, 0.24)',  // Scene 5: Indigo (Skills)
      'rgba(255, 113, 56, 0.24)',  // Scene 6: Hot Orange (Contact)
    ],
  )
  const ambientGlowGradient = useTransform(
    ambientColor,
    (c) => `radial-gradient(circle, ${c} 0%, transparent 72%)`,
  )

  // ── 0. Hero transforms (Departure 0.00 -> 0.167)
  const heroScale = useTransform(masterProgress, [0.0, 1 / 6], [1.0, 2.2])
  const heroZ = useTransform(masterProgress, [0.0, 1 / 6], [0, 320])
  const heroOpacity = useTransform(masterProgress, [0.0, 0.11], [1.0, 0.0])
  const heroPointerEvents = useTransform(masterProgress, (v) => (v < 0.08 ? 'auto' : 'none'))
  const heroPhoneProgress = useTransform(masterProgress, [0.0, 1 / 6], [0, 1])
  const heroWatermarkZ = useTransform(masterProgress, [0.0, 1 / 6], [-90, -340])
  const heroWatermarkOpacity = useTransform(masterProgress, [0.0, 0.08], [0.75, 0.0])

  // ── 1. Clocky transforms (Arrival 0.00 -> 0.167, Departure 0.167 -> 0.333)
  const clockyScale = useTransform(masterProgress, [0.0, 1 / 6, 2 / 6], [0.35, 1.0, 2.2])
  const clockyZ = useTransform(masterProgress, [0.0, 1 / 6, 2 / 6], [-600, 0, 320])
  const clockyOpacity = useTransform(masterProgress, [0.03, 0.12, 0.21, 0.30], [0.0, 1.0, 1.0, 0.0])
  const clockyPointerEvents = useTransform(masterProgress, (v) => (v >= 0.08 && v < 0.25 ? 'auto' : 'none'))

  // ── 2. Expify Beta transforms (Arrival 0.167 -> 0.333, Departure 0.333 -> 0.500)
  const expifyScale = useTransform(masterProgress, [1 / 6, 2 / 6, 3 / 6], [0.35, 1.0, 2.2])
  const expifyZ = useTransform(masterProgress, [1 / 6, 2 / 6, 3 / 6], [-600, 0, 320])
  const expifyOpacity = useTransform(masterProgress, [0.19, 0.28, 0.38, 0.47], [0.0, 1.0, 1.0, 0.0])
  const expifyPointerEvents = useTransform(masterProgress, (v) => (v >= 0.25 && v < 0.42 ? 'auto' : 'none'))

  // ── 3. NomNom transforms (Arrival 0.333 -> 0.500, Departure 0.500 -> 0.667)
  const nomnomScale = useTransform(masterProgress, [2 / 6, 3 / 6, 4 / 6], [0.35, 1.0, 2.2])
  const nomnomZ = useTransform(masterProgress, [2 / 6, 3 / 6, 4 / 6], [-600, 0, 320])
  const nomnomOpacity = useTransform(masterProgress, [0.36, 0.45, 0.55, 0.64], [0.0, 1.0, 1.0, 0.0])
  const nomnomPointerEvents = useTransform(masterProgress, (v) => (v >= 0.42 && v < 0.58 ? 'auto' : 'none'))

  // ── 4. About transforms (Arrival 0.500 -> 0.667, Departure 0.667 -> 0.833)
  const aboutScale = useTransform(masterProgress, [3 / 6, 4 / 6, 5 / 6], [0.35, 1.0, 2.2])
  const aboutZ = useTransform(masterProgress, [3 / 6, 4 / 6, 5 / 6], [-600, 0, 320])
  const aboutOpacity = useTransform(masterProgress, [0.53, 0.62, 0.71, 0.80], [0.0, 1.0, 1.0, 0.0])
  const aboutPointerEvents = useTransform(masterProgress, (v) => (v >= 0.58 && v < 0.75 ? 'auto' : 'none'))
  const aboutHeaderOpacity = useTransform(masterProgress, [0.54, 0.64], [0.0, 1.0])
  const aboutHeaderY = useTransform(masterProgress, [0.54, 0.64], [24, 0])
  const aboutNarrativeOpacity = useTransform(masterProgress, [0.56, 0.66], [0.0, 1.0])
  const aboutNarrativeY = useTransform(masterProgress, [0.56, 0.66], [20, 0])
  const aboutPillarsOpacity = useTransform(masterProgress, [0.58, 0.68], [0.0, 1.0])
  const aboutPillarsY = useTransform(masterProgress, [0.58, 0.68], [20, 0])

  // ── 5. Skills transforms (Arrival 0.667 -> 0.833, Departure 0.833 -> 1.000)
  const skillsScale = useTransform(masterProgress, [4 / 6, 5 / 6, 1.0], [0.35, 1.0, 2.2])
  const skillsZ = useTransform(masterProgress, [4 / 6, 5 / 6, 1.0], [-600, 0, 320])
  const skillsOpacity = useTransform(masterProgress, [0.69, 0.78, 0.88, 0.97], [0.0, 1.0, 1.0, 0.0])
  const skillsPointerEvents = useTransform(masterProgress, (v) => (v >= 0.75 && v < 0.92 ? 'auto' : 'none'))
  const skillsHeaderOpacity = useTransform(masterProgress, [0.70, 0.80], [0.0, 1.0])
  const skillsHeaderY = useTransform(masterProgress, [0.70, 0.80], [24, 0])
  const skillsGridOpacity = useTransform(masterProgress, [0.72, 0.82], [0.0, 1.0])
  const skillsGridY = useTransform(masterProgress, [0.72, 0.82], [20, 0])

  // ── 6. Contact transforms (Arrival 0.833 -> 1.000, resting at 1.000)
  const contactScale = useTransform(masterProgress, [5 / 6, 1.0], [0.35, 1.0])
  const contactZ = useTransform(masterProgress, [5 / 6, 1.0], [-600, 0])
  const contactOpacity = useTransform(masterProgress, [0.86, 0.97], [0.0, 1.0])
  const contactPointerEvents = useTransform(masterProgress, (v) => (v >= 0.92 ? 'auto' : 'none'))
  const contactHeaderOpacity = useTransform(masterProgress, [0.88, 0.98], [0.0, 1.0])
  const contactHeaderY = useTransform(masterProgress, [0.88, 0.98], [24, 0])
  const contactGridOpacity = useTransform(masterProgress, [0.89, 0.99], [0.0, 1.0])
  const contactGridY = useTransform(masterProgress, [0.89, 0.99], [20, 0])

  // Synchronize active section with masterProgress (ref-guarded: 0 unnecessary re-renders)
  useEffect(() => {
    if (isMotionDisabled) return undefined
    const unsubscribe = masterProgress.on('change', (latest) => {
      let nextSection = 'home'
      if (latest < 0.0833) {
        nextSection = 'home'
      } else if (latest < 0.25) {
        nextSection = 'clocky'
      } else if (latest < 0.4167) {
        nextSection = 'expify'
      } else if (latest < 0.5833) {
        nextSection = 'nomnom'
      } else if (latest < 0.75) {
        nextSection = 'about'
      } else if (latest < 0.9167) {
        nextSection = 'skills'
      } else {
        nextSection = 'contact'
      }

      if (currentSectionRef.current !== nextSection) {
        currentSectionRef.current = nextSection
        setActiveSection(nextSection)
      }
    })
    return () => unsubscribe()
  }, [masterProgress, isMotionDisabled])

  const isSettlingRef = useRef(false)
  const lastScrollYRef = useRef(0)
  const lastScrollTimeRef = useRef(0)
  const scrollVelocityRef = useRef(0)
  const settleTimerRef = useRef(null)

  const goToSceneIndex = useCallback((sceneIndex) => {
    const track = masterTrackRef.current
    if (!track) return
    const trackBounds = track.getBoundingClientRect()
    const currentScrollY = window.scrollY
    const trackTop = trackBounds.top + currentScrollY
    const trackHeight = track.scrollHeight - window.innerHeight
    if (trackHeight <= 0) return

    const targetPct = SCENE_TARGETS[sceneIndex]?.percent ?? 0
    const targetY = trackTop + targetPct * trackHeight

    isSettlingRef.current = true
    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    })

    setTimeout(() => {
      isSettlingRef.current = false
    }, 600)
  }, [])

  const scrollToSection = useCallback(
    (sectionId) => {
      if (isMotionDisabled) {
        const el = document.getElementById(sectionId)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
        return
      }
      const indexMap = {
        home: 0,
        work: 1,
        clocky: 1,
        expify: 2,
        'expify-beta': 2,
        nomnom: 3,
        about: 4,
        skills: 5,
        contact: 6,
      }
      const idx = indexMap[sectionId] ?? 0
      goToSceneIndex(idx)
    },
    [isMotionDisabled, goToSceneIndex],
  )

  // Automatic gentle magnetic settle when user stops scrolling mid-transition
  useEffect(() => {
    if (isMotionDisabled) return undefined

    const handleUserScroll = () => {
      const now = Date.now()
      const currentY = window.scrollY
      const dt = Math.max(1, now - lastScrollTimeRef.current)
      const dy = currentY - lastScrollYRef.current

      scrollVelocityRef.current = dy / dt
      lastScrollYRef.current = currentY
      lastScrollTimeRef.current = now

      if (settleTimerRef.current) {
        clearTimeout(settleTimerRef.current)
      }

      if (isSettlingRef.current) return

      settleTimerRef.current = setTimeout(() => {
        if (selectedProject) return

        const track = masterTrackRef.current
        if (!track) return
        const trackBounds = track.getBoundingClientRect()
        const currentScrollY = window.scrollY
        const trackTop = trackBounds.top + currentScrollY
        const trackHeight = track.scrollHeight - window.innerHeight
        if (trackHeight <= 0) return

        const progress = Math.max(0, Math.min(1, (currentScrollY - trackTop) / trackHeight))
        const exactIndex = progress * 6
        const lowerIndex = Math.floor(exactIndex)
        const remainder = exactIndex - lowerIndex

        // If sitting comfortably near the resting point, no settle needed
        if (remainder < 0.05 || remainder > 0.95) return

        const velocity = scrollVelocityRef.current
        let destIndex = lowerIndex

        if (velocity > 0.15) {
          destIndex = Math.min(6, lowerIndex + 1)
        } else if (velocity < -0.15) {
          destIndex = Math.max(0, lowerIndex)
        } else {
          destIndex = remainder >= 0.5 ? Math.min(6, lowerIndex + 1) : lowerIndex
        }

        goToSceneIndex(destIndex)
      }, 160)
    }

    const cancelSettle = () => {
      isSettlingRef.current = false
    }

    window.addEventListener('scroll', handleUserScroll, { passive: true })
    window.addEventListener('wheel', cancelSettle, { passive: true })
    window.addEventListener('touchstart', cancelSettle, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleUserScroll)
      window.removeEventListener('wheel', cancelSettle)
      window.removeEventListener('touchstart', cancelSettle)
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current)
    }
  }, [isMotionDisabled, goToSceneIndex, selectedProject])

  // Keyboard presentation navigation (ArrowDown, ArrowUp, PageDown, PageUp, Space)
  useEffect(() => {
    if (isMotionDisabled) return undefined

    const handleKeyDown = (e) => {
      if (selectedProject) return
      if (['ArrowDown', 'PageDown'].includes(e.key) || (e.key === ' ' && !e.shiftKey)) {
        e.preventDefault()
        const track = masterTrackRef.current
        if (!track) return
        const trackBounds = track.getBoundingClientRect()
        const trackHeight = track.scrollHeight - window.innerHeight
        const currentScrollY = window.scrollY
        const trackTop = trackBounds.top + currentScrollY
        const progress = Math.max(0, Math.min(1, (currentScrollY - trackTop) / trackHeight))
        const currentIndex = Math.round(progress * 6)
        goToSceneIndex(Math.min(6, currentIndex + 1))
      } else if (['ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault()
        const track = masterTrackRef.current
        if (!track) return
        const trackBounds = track.getBoundingClientRect()
        const trackHeight = track.scrollHeight - window.innerHeight
        const currentScrollY = window.scrollY
        const trackTop = trackBounds.top + currentScrollY
        const progress = Math.max(0, Math.min(1, (currentScrollY - trackTop) / trackHeight))
        const currentIndex = Math.round(progress * 6)
        goToSceneIndex(Math.max(0, currentIndex - 1))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMotionDisabled, goToSceneIndex, selectedProject])

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

  return (
    <main className="portfolio">
      <CustomCursor shouldReduceMotion={shouldReduceMotion} />

      {/* 3D Dimensional Travel Conduit Canvas (Real-time WebGL spatial travel engine) */}
      <TravelWorld3D
        scrollProgress={masterProgress}
        theme={theme}
        reducedMotion={Boolean(isMotionDisabled)}
      />

      <Intro reducedMotion={shouldReduceMotion} onDone={handleIntroDone} />
      <Navbar
        reveal={reveal}
        linkHover={linkHover}
        reducedMotion={shouldReduceMotion}
        scrollProgress={pageScroll}
        theme={theme}
        onToggleTheme={toggleTheme}
        activeSection={isMotionDisabled ? undefined : activeSection}
        onNavigate={scrollToSection}
      />

      {!isMotionDisabled && (
        <CinematicWaypointHUD
          activeSection={activeSection}
          onSelectScene={goToSceneIndex}
        />
      )}

      <div className="cinematic-master-track" ref={masterTrackRef}>
        <div className="cinematic-camera-viewport">
          {/* Dynamic atmospheric environmental lighting orb transitioning across the 7 scenes */}
          <motion.div
            className="cinematic-ambient-chamber-glow"
            aria-hidden="true"
            style={{
              background: isMotionDisabled
                ? 'radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)'
                : ambientGlowGradient,
            }}
          />

          {/* ── Scene 0: Hero ── */}
          <motion.section
            className="hero-section cinematic-scene-chamber"
            id="home"
            style={{
              scale: isMotionDisabled ? 1 : heroScale,
              z: isMotionDisabled ? 0 : heroZ,
              opacity: isMotionDisabled ? 1 : heroOpacity,
              pointerEvents: isMotionDisabled ? 'auto' : heroPointerEvents,
            }}
          >
            <div className="cinematic-scene-inner hero-scene-inner">
              <div className="hero-spatial-stage">
                {/* Layer 0: Giant Layered Background Typography (Directly Behind Centered Phone) */}
                <motion.div
                  className="hero-layered-bg-text"
                  aria-hidden="true"
                  style={{
                    z: isMotionDisabled ? -90 : heroWatermarkZ,
                    opacity: isMotionDisabled ? 0.85 : heroWatermarkOpacity,
                  }}
                >
                  <span className="bg-headline-line line-flutter">FLUTTER</span>
                  <span className="bg-headline-line line-developer">DEVELOPER</span>
                </motion.div>

                {/* Layer 1: Top Header Layer (Above Centered Phone) */}
                <div className="hero-top-layer">
                  <div className="hero-top-row">
                    <motion.div className="availability glass-surface" {...reveal(0.12)}>
                      <span className="status-dot" /> FLUTTER APP DEVELOPER
                    </motion.div>

                    <HeroIdentityCard
                      reveal={reveal}
                      shouldReduceMotion={shouldReduceMotion}
                    />
                  </div>

                  {/* Premium 3D Editorial Headline */}
                  <div className="hero-editorial-headline">
                    <motion.span className="editorial-eyebrow-kicker" {...reveal(0.24)}>
                      INDEPENDENT MOBILE DEVELOPER · BANGLADESH
                    </motion.span>
                    <motion.h1 className="editorial-hero-display" {...reveal(0.38)}>
                      I CRAFT <span className="molten-text-accent">IMMERSIVE</span> EXPERIENCES<span className="accent-dot">.</span>
                    </motion.h1>
                  </div>
                </div>

                {/* Layer 2: Center Visual Stage (Foreground 3D iPhone) */}
                <div className="hero-center-visual-stage">
                  <motion.div
                    className="visual-stage"
                    ref={stageRef}
                    onPointerMove={handleStagePointerMove}
                    onPointerLeave={handleStagePointerLeave}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                    animate={ready || shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 1, delay: shouldReduceMotion ? 0 : 0.25, ease: easeOut }}
                    style={{ transformOrigin: 'center center' }}
                  >
                    <motion.div
                      className="orbit orbit-one"
                      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.8 }}
                      animate={ready || shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ duration: 1.2, delay: 0.45, ease: easeOut }}
                    />
                    <motion.div
                      className="orbit orbit-two"
                      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.8 }}
                      animate={ready || shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ duration: 1.2, delay: 0.6, ease: easeOut }}
                    />
                    <div className="phone-tilt">
                      <HeroPhone
                        reducedMotion={shouldReduceMotion}
                        scrollProgress={heroPhoneProgress}
                        screenImageSrc={activeHeroScreen}
                        pageReady={ready}
                        theme={theme}
                      />
                    </div>

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
                </div>

                {/* Layer 3: Bottom Narrative & Actions Layer */}
                <div className="hero-bottom-layer">
                  <motion.p className="hero-editorial-desc" {...reveal(0.55)}>
                    I build thoughtful, user-focused mobile applications with{' '}
                    <strong>Flutter</strong>—pairing tactile, distraction-free UI craftsmanship
                    with robust problem-solving foundations in <strong>C++</strong> and{' '}
                    <strong>Data Structures &amp; Algorithms</strong>.
                  </motion.p>

                  <motion.div className="hero-editorial-pills" {...reveal(0.65)}>
                    <span className="editorial-spec-pill">
                      <span className="editorial-spec-dot" /> Flutter &amp; Dart
                    </span>
                    <span className="editorial-spec-pill">
                      <span className="editorial-spec-dot" /> Custom Canvas UI
                    </span>
                    <span className="editorial-spec-pill">
                      <span className="editorial-spec-dot" /> C++ &amp; DSA Logic
                    </span>
                  </motion.div>

                  <motion.div className="hero-actions" {...reveal(0.75)}>
                    <MagneticButton shouldReduceMotion={shouldReduceMotion} strength={14}>
                      <motion.a
                        className="button-primary glass-button liquid-btn"
                        href="#work"
                        onClick={(e) => {
                          if (!isMotionDisabled) {
                            e.preventDefault()
                            scrollToSection('work')
                          }
                        }}
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
                        onClick={(e) => {
                          if (!isMotionDisabled) {
                            e.preventDefault()
                            scrollToSection('contact')
                          }
                        }}
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

                  <motion.div className="hero-location" {...reveal(0.85, 10)}>
                    <span aria-hidden="true">↳</span> Based in {PROFILE_CONFIG.location} · Open to Mobile Opportunities
                  </motion.div>
                </div>
              </div>

              <motion.div className="hero-index" {...reveal(1, 8)}>
                <span>01</span>
                <span className="index-line" />
                <span>SCROLL TO EXPLORE</span>
              </motion.div>
            </div>
          </motion.section>

          {/* ── Scene 1: Clocky (Dedicated Project Chamber) ── */}
          <div id="work" style={{ position: 'relative', width: 0, height: 0 }} />
          <CinematicProjectChamber
            project={projectsData[0]}
            sceneId="clocky"
            journeyNumber="02 / 07"
            chamberClass="clocky-chamber"
            scale={clockyScale}
            z={clockyZ}
            opacity={clockyOpacity}
            pointerEvents={clockyPointerEvents}
            isMotionDisabled={isMotionDisabled}
            screenIndex={clockyScreenIndex}
            onSetScreenIndex={setClockyScreenIndex}
            onOpenDetails={handleOpenProjectDetails}
            backdrop={
              <div className="clocky-orbit-backdrop" aria-hidden="true">
                <div className="clocky-orbit-ring ring-1" />
                <div className="clocky-orbit-ring ring-2" />
              </div>
            }
          />

          {/* ── Scene 2: Expify Beta (Dedicated Project Chamber) ── */}
          <div id="expify-beta" style={{ position: 'relative', width: 0, height: 0 }} />
          <CinematicProjectChamber
            project={projectsData[1]}
            sceneId="expify"
            journeyNumber="03 / 07"
            chamberClass="expify-chamber"
            scale={expifyScale}
            z={expifyZ}
            opacity={expifyOpacity}
            pointerEvents={expifyPointerEvents}
            isMotionDisabled={isMotionDisabled}
            screenIndex={expifyScreenIndex}
            onSetScreenIndex={setExpifyScreenIndex}
            onOpenDetails={handleOpenProjectDetails}
            backdrop={<div className="expify-grid-backdrop" aria-hidden="true" />}
          />

          {/* ── Scene 3: NomNom (Dedicated Project Chamber) ── */}
          <CinematicProjectChamber
            project={projectsData[2]}
            sceneId="nomnom"
            journeyNumber="04 / 07"
            chamberClass="nomnom-chamber"
            scale={nomnomScale}
            z={nomnomZ}
            opacity={nomnomOpacity}
            pointerEvents={nomnomPointerEvents}
            isMotionDisabled={isMotionDisabled}
            screenIndex={nomnomScreenIndex}
            onSetScreenIndex={setNomnomScreenIndex}
            onOpenDetails={handleOpenProjectDetails}
            backdrop={<div className="nomnom-warmth-backdrop" aria-hidden="true" />}
          />

          {/* ── Scene 4: About Me ── */}
          <motion.section
            className="about-section-upgraded cinematic-scene-chamber"
            id="about"
            style={{
              scale: isMotionDisabled ? 1 : aboutScale,
              z: isMotionDisabled ? 0 : aboutZ,
              opacity: isMotionDisabled ? 1 : aboutOpacity,
              pointerEvents: isMotionDisabled ? 'auto' : aboutPointerEvents,
            }}
            {...(isMotionDisabled ? scrollReveal(26) : {})}
          >
            <div className="cinematic-scene-inner">
              <motion.div
                className="cinematic-scene-header"
                style={{
                  opacity: isMotionDisabled ? 1 : aboutHeaderOpacity,
                  y: isMotionDisabled ? 0 : aboutHeaderY,
                }}
              >
                <p className="eyebrow">05 / ABOUT ME</p>
                <h2 className="cinematic-scene-title">
                  Engineering with <span className="accent-text">Purpose.</span>
                </h2>
                <p className="cinematic-scene-lead">
                  Bridging clean Flutter mobile design with algorithmic problem-solving foundations.
                </p>
              </motion.div>

              <motion.div
                className="about-narrative-card glass-card liquid-glass-card"
                data-liquid-intensity="medium"
                style={{
                  width: '100%',
                  opacity: isMotionDisabled ? 1 : aboutNarrativeOpacity,
                  y: isMotionDisabled ? 0 : aboutNarrativeY,
                }}
                onPointerMove={(e) => handleLiquidPointerMove(e, shouldReduceMotion)}
                onPointerLeave={handleLiquidPointerLeave}
                {...(isMotionDisabled ? scrollReveal(22, 0.08) : {})}
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

              <motion.div
                className="about-pillars-grid"
                style={{
                  width: '100%',
                  opacity: isMotionDisabled ? 1 : aboutPillarsOpacity,
                  y: isMotionDisabled ? 0 : aboutPillarsY,
                }}
              >
                {aboutPillars.map((pillar, index) => (
                  <motion.article
                    key={pillar.number}
                    className="about-pillar-card glass-card liquid-glass-card"
                    data-liquid-intensity="subtle"
                    onPointerMove={(e) => handleLiquidPointerMove(e, shouldReduceMotion)}
                    onPointerLeave={handleLiquidPointerLeave}
                    {...(isMotionDisabled
                      ? {
                          initial: shouldReduceMotion ? false : { opacity: 0, y: 20 },
                          whileInView: { opacity: 1, y: 0 },
                          viewport: { once: true, amount: 0.2 },
                          transition: {
                            duration: shouldReduceMotion ? 0 : 0.55,
                            delay: shouldReduceMotion ? 0 : index * 0.1,
                            ease: easeOut,
                          },
                        }
                      : {})}
                    whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                  >
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <span className="pillar-number">{pillar.number}</span>
                      <h3>{pillar.title}</h3>
                      <p>{pillar.description}</p>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </div>
          </motion.section>

          {/* ── Scene 5: Technical Skills ── */}
          <motion.section
            className="skills-section-upgraded cinematic-scene-chamber"
            id="skills"
            style={{
              scale: isMotionDisabled ? 1 : skillsScale,
              z: isMotionDisabled ? 0 : skillsZ,
              opacity: isMotionDisabled ? 1 : skillsOpacity,
              pointerEvents: isMotionDisabled ? 'auto' : skillsPointerEvents,
            }}
            {...(isMotionDisabled ? scrollReveal(26) : {})}
          >
            <div className="cinematic-scene-inner">
              <motion.div
                className="cinematic-scene-header"
                style={{
                  opacity: isMotionDisabled ? 1 : skillsHeaderOpacity,
                  y: isMotionDisabled ? 0 : skillsHeaderY,
                }}
              >
                <p className="eyebrow">06 / TECHNICAL SKILLS</p>
                <h2 className="cinematic-scene-title">
                  Core <span className="accent-text">Proficiencies.</span>
                </h2>
                <p className="cinematic-scene-lead">
                  Specialized capabilities across modern cross-platform development and computer science fundamentals.
                </p>
              </motion.div>

              <motion.div
                className="skills-category-grid"
                style={{
                  width: '100%',
                  opacity: isMotionDisabled ? 1 : skillsGridOpacity,
                  y: isMotionDisabled ? 0 : skillsGridY,
                }}
              >
                {skillCategories.map((group, index) => {
                  const GroupIcon = group.icon
                  return (
                    <motion.article
                      key={group.id}
                      className="skill-category-card glass-card liquid-glass-card"
                      data-liquid-intensity="medium"
                      onPointerMove={(e) => handleLiquidPointerMove(e, shouldReduceMotion)}
                      onPointerLeave={handleLiquidPointerLeave}
                      {...(isMotionDisabled
                        ? {
                            initial: shouldReduceMotion ? false : { opacity: 0, y: 24 },
                            whileInView: { opacity: 1, y: 0 },
                            viewport: { once: true, amount: 0.15 },
                            transition: {
                              duration: shouldReduceMotion ? 0 : 0.6,
                              delay: shouldReduceMotion ? 0 : index * 0.1,
                              ease: easeOut,
                            },
                          }
                        : {})}
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
              </motion.div>
            </div>
          </motion.section>

          {/* ── Scene 6: Contact & Footer ── */}
          <motion.footer
            className="footer cinematic-scene-chamber"
            id="contact"
            style={{
              scale: isMotionDisabled ? 1 : contactScale,
              z: isMotionDisabled ? 0 : contactZ,
              opacity: isMotionDisabled ? 1 : contactOpacity,
              pointerEvents: isMotionDisabled ? 'auto' : contactPointerEvents,
            }}
            {...(isMotionDisabled ? scrollReveal(26) : {})}
          >
            <div className="cinematic-scene-inner">
              <div className="contact-showcase" style={{ width: '100%' }}>
                <motion.div
                  className="contact-copy"
                  style={{
                    opacity: isMotionDisabled ? 1 : contactHeaderOpacity,
                    y: isMotionDisabled ? 0 : contactHeaderY,
                  }}
                >
                  <p className="eyebrow">07 / GET IN TOUCH</p>
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
                </motion.div>

                <motion.div
                  className="contact-cards-grid"
                  style={{
                    opacity: isMotionDisabled ? 1 : contactGridOpacity,
                    y: isMotionDisabled ? 0 : contactGridY,
                  }}
                >
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
                </motion.div>
              </div>

              <motion.div
                className="footer-bottom-bar"
                style={{
                  width: '100%',
                  marginTop: 36,
                  opacity: isMotionDisabled ? 1 : contactGridOpacity,
                  y: isMotionDisabled ? 0 : contactGridY,
                }}
              >
                <div className="footer-brand-col">
                  <a
                    className="wordmark"
                    href="#home"
                    onClick={(e) => {
                      if (!isMotionDisabled) {
                        e.preventDefault()
                        scrollToSection('home')
                      }
                    }}
                  >
                    mrh<span>.</span>rafi
                  </a>
                  <p className="footer-tagline">
                    Mrh Rafi · Flutter App Developer · Bangladesh
                  </p>
                </div>

                <div className="footer-nav-col">
                  <a
                    href="#home"
                    onClick={(e) => {
                      if (!isMotionDisabled) {
                        e.preventDefault()
                        scrollToSection('home')
                      }
                    }}
                  >
                    Home
                  </a>
                  <a
                    href="#work"
                    onClick={(e) => {
                      if (!isMotionDisabled) {
                        e.preventDefault()
                        scrollToSection('work')
                      }
                    }}
                  >
                    Projects
                  </a>
                  <a
                    href="#about"
                    onClick={(e) => {
                      if (!isMotionDisabled) {
                        e.preventDefault()
                        scrollToSection('about')
                      }
                    }}
                  >
                    About
                  </a>
                  <a
                    href="#skills"
                    onClick={(e) => {
                      if (!isMotionDisabled) {
                        e.preventDefault()
                        scrollToSection('skills')
                      }
                    }}
                  >
                    Skills
                  </a>
                </div>

                <p className="footer-note">
                  © {CURRENT_YEAR} Mrh Rafi · Crafted with Flutter spirit &amp; React Three Fiber.
                </p>
              </motion.div>
            </div>
          </motion.footer>
        </div>
      </div>

      <ProjectShowcase
        project={selectedProject}
        initialIndex={selectedScreenIndex}
        onClose={() => setSelectedProject(null)}
        theme={theme}
        onToggleTheme={toggleTheme}
        onScreenIndexChange={handleShowcaseScreenChange}
      />
    </main>
  )
}

export default App
