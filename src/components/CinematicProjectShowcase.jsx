import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Clock,
  Expand,
  Layers,
  Sparkles,
  Wallet,
} from 'lucide-react'
import PhoneMockup from './PhoneMockup'
import {
  handleLiquidPointerLeave,
  handleLiquidPointerMove,
} from '../utils/liquidInteractions'

const easeCinematic = [0.22, 1, 0.36, 1]

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
 * Subtle SVG geometric wireframe backdrop inspired by the reference's
 * high-contrast thin vector geometry. Adapts to the active project.
 */
function StageWireframeAccents({ projectId }) {
  if (projectId === 'clocky') {
    return (
      <svg
        className="cinematic-wireframe-svg"
        viewBox="0 0 1200 720"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="860"
          cy="350"
          r="250"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 8"
        />
        <circle
          cx="860"
          cy="350"
          r="190"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <line
          x1="860"
          y1="60"
          x2="860"
          y2="130"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="860"
          y1="570"
          x2="860"
          y2="640"
          stroke="currentColor"
          strokeWidth="1"
        />
        <polygon
          points="160,120 205,195 115,195"
          stroke="currentColor"
          strokeWidth="1"
        />
        <polygon
          points="520,560 560,625 480,625"
          stroke="currentColor"
          strokeWidth="0.9"
        />
      </svg>
    )
  }

  return (
    <svg
      className="cinematic-wireframe-svg"
      viewBox="0 0 1200 720"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="680"
        y="140"
        width="360"
        height="360"
        rx="28"
        transform="rotate(12 860 320)"
        stroke="currentColor"
        strokeWidth="0.9"
      />
      <rect
        x="715"
        y="175"
        width="290"
        height="290"
        rx="20"
        transform="rotate(-8 860 320)"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeDasharray="5 9"
      />
      <polygon
        points="170,130 220,180 170,230 120,180"
        stroke="currentColor"
        strokeWidth="1"
      />
      <polyline
        points="440,590 495,545 535,570 605,505"
        stroke="currentColor"
        strokeWidth="1.1"
      />
    </svg>
  )
}

/**
 * Reference-driven cinematic project showcase.
 * Anchors a shared reusable iPhone hardware mockup while coordinating transitions
 * across project narrative, screen assets, technology tags, architectural feature columns,
 * and an interactive "Inside the App" screen mosaic.
 *
 * @param {Object} props
 * @param {Array<Object>} props.projects - Single source of truth (`projectsData` from App.jsx).
 * @param {boolean} props.shouldReduceMotion - Whether reduced motion is active.
 * @param {Object} props.linkHover - Shared hover motion preset.
 * @param {Function} props.onOpenDetails - Callback `(project, screenIndex) => void` to open fullscreen modal.
 */
export default function CinematicProjectShowcase({
  projects = [],
  shouldReduceMotion = false,
  linkHover,
  onOpenDetails,
}) {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)
  const [screenIndices, setScreenIndices] = useState({})
  const [direction, setDirection] = useState(0)

  const totalProjects = projects.length
  const activeProject = projects[activeProjectIndex] || projects[0]
  const screenshots = activeProject?.screenshots || []
  const totalScreens = screenshots.length

  const rawScreenIndex = screenIndices[activeProject?.id] ?? 0
  const activeScreenIndex =
    totalScreens > 0
      ? ((rawScreenIndex % totalScreens) + totalScreens) % totalScreens
      : 0
  const activeScreenshot = screenshots[activeScreenIndex] || {
    src: activeProject?.screenshotSrc,
    label: activeProject?.title,
    alt: `${activeProject?.title} preview`,
  }

  const selectProject = useCallback(
    (nextIndex) => {
      if (nextIndex === activeProjectIndex) return
      if (nextIndex < 0 || nextIndex >= totalProjects) return
      setDirection(nextIndex > activeProjectIndex ? 1 : -1)
      setActiveProjectIndex(nextIndex)
    },
    [activeProjectIndex, totalProjects],
  )

  const cycleProject = useCallback(
    (step) => {
      if (totalProjects < 2) return
      const nextIndex =
        (activeProjectIndex + step + totalProjects) % totalProjects
      setDirection(step >= 0 ? 1 : -1)
      setActiveProjectIndex(nextIndex)
    },
    [activeProjectIndex, totalProjects],
  )

  const selectScreen = useCallback(
    (nextScreenIdx) => {
      if (!activeProject || totalScreens < 1) return
      const clamped =
        ((nextScreenIdx % totalScreens) + totalScreens) % totalScreens
      if (clamped === activeScreenIndex) return
      setDirection(clamped > activeScreenIndex ? 1 : -1)
      setScreenIndices((prev) => ({
        ...prev,
        [activeProject.id]: clamped,
      }))
    },
    [activeProject, activeScreenIndex, totalScreens],
  )

  const stepScreen = useCallback(
    (delta) => {
      if (!activeProject || totalScreens < 2) return
      const nextIdx =
        (activeScreenIndex + delta + totalScreens) % totalScreens
      setDirection(delta >= 0 ? 1 : -1)
      setScreenIndices((prev) => ({
        ...prev,
        [activeProject.id]: nextIdx,
      }))
    },
    [activeProject, activeScreenIndex, totalScreens],
  )

  const handleProjectTabKeyDown = (event, idx) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      selectProject((idx + 1) % totalProjects)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      selectProject((idx - 1 + totalProjects) % totalProjects)
    }
  }

  if (!activeProject) return null

  const formattedProjectNum = String(activeProjectIndex + 1).padStart(2, '0')
  const formattedTotalProjects = String(totalProjects).padStart(2, '0')
  const formattedScreenNum = String(activeScreenIndex + 1).padStart(2, '0')
  const formattedTotalScreens = String(totalScreens || 1).padStart(2, '0')

  const nextProjectIndex = (activeProjectIndex + 1) % totalProjects
  const nextProject = projects[nextProjectIndex]
  const repoLinks = Array.isArray(activeProject.links)
    ? activeProject.links
    : []

  return (
    <div
      className="cinematic-showcase-wrapper"
      data-active-project={activeProject.id}
    >
      {/* ── Top Editorial Header & Interactive Project Selector Bar ───────── */}
      <div className="cinematic-header-bar">
        <div className="cinematic-title-group">
          <div className="section-header-row">
            <p className="eyebrow">01 / SELECTED PROJECTS</p>
          </div>
          <h2 className="works-display-heading">
            Featured <span className="works-heading-accent">Works.</span>
          </h2>
        </div>

        <div className="cinematic-selector-cluster">
          <span className="cinematic-selector-caption">
            SELECT APPLICATION ({formattedProjectNum} / {formattedTotalProjects})
          </span>

          <div
            className="cinematic-project-tabs glass-surface"
            role="tablist"
            aria-label="Select featured Flutter project"
          >
            {projects.map((proj, idx) => {
              const isSelected = idx === activeProjectIndex
              const numLabel = String(idx + 1).padStart(2, '0')
              const ProjectIcon = proj.id === 'clocky' ? Clock : Wallet

              return (
                <button
                  key={proj.id}
                  type="button"
                  role="tab"
                  id={`project-tab-${proj.id}`}
                  aria-selected={isSelected}
                  aria-controls={`project-panel-${proj.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  className={`cinematic-project-tab liquid-btn${
                    isSelected ? ' is-active' : ''
                  }`}
                  onClick={() => selectProject(idx)}
                  onKeyDown={(e) => handleProjectTabKeyDown(e, idx)}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="cinematicActiveProjectPill"
                      className="cinematic-tab-active-bg"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}
                  <span className="cinematic-tab-inner">
                    <span className="cinematic-tab-num">{numLabel}</span>
                    <ProjectIcon size={14} aria-hidden="true" />
                    <span className="cinematic-tab-title">
                      {proj.title}
                      {proj.accent === ' Beta' ? ' Beta' : ''}
                    </span>
                    <span className="cinematic-tab-count">
                      {proj.screenshots?.length || 1} screens
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Main Cinematic Stage (Anchored Device + Choreographed Content) ── */}
      <div
        id={`project-panel-${activeProject.id}`}
        role="tabpanel"
        aria-labelledby={`project-tab-${activeProject.id}`}
        className="cinematic-stage-shell glass-card liquid-glass-card"
        data-liquid-intensity="medium"
        data-project={activeProject.id}
        onPointerMove={(e) => handleLiquidPointerMove(e, shouldReduceMotion)}
        onPointerLeave={handleLiquidPointerLeave}
      >
        {/* Architectural 4-column hairlines inspired by reference frames 7s & 9s */}
        <div className="cinematic-grid-lines" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>

        {/* Project-reactive ambient lighting & thin geometric SVG wireframes */}
        <div
          className="cinematic-stage-lighting"
          data-project={activeProject.id}
          aria-hidden="true"
        />
        <StageWireframeAccents projectId={activeProject.id} />

        {/* Oversized background watermark title inspired by reference frames 1s & 14s */}
        <div className="cinematic-watermark-layer" aria-hidden="true">
          <AnimatePresence mode="wait">
            <motion.span
              key={activeProject.id}
              className="cinematic-watermark-text"
              initial={
                shouldReduceMotion
                  ? false
                  : { opacity: 0, x: direction >= 0 ? 48 : -48 }
              }
              animate={{ opacity: 1, x: 0 }}
              exit={
                shouldReduceMotion
                  ? undefined
                  : { opacity: 0, x: direction >= 0 ? -48 : 48 }
              }
              transition={{
                duration: shouldReduceMotion ? 0 : 0.55,
                ease: easeCinematic,
              }}
            >
              {activeProject.watermark || activeProject.title.toUpperCase()}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Primary Two-Column Stage Layout: Narrative Left, Anchored iPhone Right */}
        <div className="cinematic-stage-main-grid">
          <div className="cinematic-narrative-col">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeProject.id}
                className="cinematic-narrative-stack"
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 22,
                        x: direction >= 0 ? -18 : 18,
                      }
                }
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={
                  shouldReduceMotion
                    ? undefined
                    : {
                        opacity: 0,
                        y: -16,
                        x: direction >= 0 ? 18 : -18,
                      }
                }
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.44,
                  ease: easeCinematic,
                }}
              >
                {/* Project Index & Category Metadata Row */}
                <div className="project-card-meta-row">
                  <span className="cinematic-index-badge">
                    {formattedProjectNum} / {formattedTotalProjects}
                  </span>
                  <span className="project-category-pill">
                    {activeProject.category}
                  </span>
                  <span className="project-type-label">
                    {activeProject.type}
                  </span>
                  {activeProject.badge && (
                    <span className="project-beta-badge">
                      <span className="project-beta-dot" aria-hidden="true" />
                      {activeProject.badge}
                    </span>
                  )}
                </div>

                {/* Reference-inspired Tagline with Inline Dash Motif */}
                <div className="cinematic-tagline-row">
                  <span className="project-tagline">
                    {activeProject.tagline}
                  </span>
                  <span className="cinematic-tagline-dash" aria-hidden="true" />
                  <span className="cinematic-tagline-sub">
                    {activeProject.subtitleNote || 'REAL FLUTTER BUILD'}
                  </span>
                </div>

                {/* Oversized Display Project Title */}
                <h3 className="project-title cinematic-project-title">
                  {activeProject.title}
                  <span className="project-title-accent">
                    {activeProject.accent}
                  </span>
                </h3>

                {/* Concise Project Description */}
                <p className="project-description cinematic-project-desc">
                  {activeProject.description}
                </p>

                {/* Developer Role Callout */}
                {activeProject.role && (
                  <p className="cinematic-role-line">
                    <span className="cinematic-role-label">ROLE</span>
                    <span>{activeProject.role}</span>
                  </p>
                )}

                {/* Technology Stack Pills */}
                {activeProject.techStack?.length > 0 && (
                  <div
                    aria-label="Technologies used"
                    className="project-tech-stack cinematic-tech-stack"
                  >
                    {activeProject.techStack.map((tech) => (
                      <span key={tech} className="project-tech-pill">
                        <Sparkles size={11} aria-hidden="true" />
                        <span>{tech}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Interactive Device Screen Controller synchronized with the anchored iPhone */}
                {totalScreens > 1 && (
                  <div
                    className="cinematic-screen-controller glass-panel"
                    aria-label={`${activeProject.title} interactive screen selector`}
                  >
                    <div className="cinematic-screen-controller-top">
                      <div className="cinematic-screen-status">
                        <span className="cinematic-screen-counter">
                          SCREEN {formattedScreenNum} / {formattedTotalScreens}
                        </span>
                        <strong className="cinematic-screen-active-name">
                          {activeScreenshot.label}
                        </strong>
                      </div>

                      <div className="cinematic-screen-step-btns">
                        <button
                          type="button"
                          className="cinematic-step-btn liquid-btn"
                          onClick={() => stepScreen(-1)}
                          aria-label={`Previous ${activeProject.title} screen`}
                        >
                          <ArrowLeft size={14} />
                        </button>
                        <button
                          type="button"
                          className="cinematic-step-btn liquid-btn"
                          onClick={() => stepScreen(1)}
                          aria-label={`Next ${activeProject.title} screen`}
                        >
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>

                    <div
                      className="cinematic-screen-pills-row"
                      role="tablist"
                      aria-label={`Choose ${activeProject.title} screen`}
                    >
                      {screenshots.map((shot, idx) => {
                        const isScreenActive = idx === activeScreenIndex
                        const shotNum = String(idx + 1).padStart(2, '0')
                        return (
                          <button
                            key={shot.src}
                            type="button"
                            role="tab"
                            aria-selected={isScreenActive}
                            className={`cinematic-screen-pill${
                              isScreenActive ? ' is-active' : ''
                            }`}
                            onClick={() => selectScreen(idx)}
                          >
                            <span className="screen-pill-num">{shotNum}</span>
                            <span className="screen-pill-label">
                              {shot.label}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Primary Overview CTA + Truthful GitHub Repository Action */}
                <div className="project-actions-row cinematic-actions-row">
                  {onOpenDetails && (
                    <motion.button
                      type="button"
                      className="liquid-btn glass-button project-overview-btn"
                      onClick={() =>
                        onOpenDetails(activeProject, activeScreenIndex)
                      }
                      whileHover={linkHover}
                      whileTap={
                        shouldReduceMotion ? undefined : { scale: 0.97 }
                      }
                    >
                      <Expand size={14} aria-hidden="true" />
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
                        whileTap={
                          shouldReduceMotion ? undefined : { scale: 0.97 }
                        }
                      >
                        <GitHubRepoIcon size={15} />
                        <span>{link.label}</span>
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </motion.a>
                    ) : (
                      <span
                        key={link.label}
                        aria-disabled="true"
                        className="project-disabled-link"
                        title={activeProject.repoNote || undefined}
                      >
                        <GitHubRepoIcon size={14} />
                        <span>{link.label}</span>
                      </span>
                    ),
                  )}
                </div>

                {activeProject.repoNote && (
                  <p className="project-repo-note">{activeProject.repoNote}</p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Visually Anchored iPhone Hardware Presentation */}
          <div className="cinematic-device-col">
            <PhoneMockup
              screenshot={activeScreenshot}
              projectId={activeProject.id}
              projectTitle={activeProject.title}
              screenIndex={activeScreenIndex}
              totalScreens={totalScreens}
              direction={direction}
              shouldReduceMotion={shouldReduceMotion}
              onOpenDetails={
                onOpenDetails
                  ? () => onOpenDetails(activeProject, activeScreenIndex)
                  : undefined
              }
              statusBadge={`${formattedScreenNum} / ${formattedTotalScreens} · ${(
                activeScreenshot.label || ''
              ).toUpperCase()}`}
              floatingBadge={
                activeProject.floatingBadge || '+ Built with Flutter'
              }
            />

            {/* Quick under-phone screen dock for tactile switching */}
            {totalScreens > 1 && (
              <div className="cinematic-device-dock">
                <button
                  type="button"
                  className="cinematic-dock-arrow liquid-btn"
                  onClick={() => stepScreen(-1)}
                  aria-label="Previous screen"
                >
                  <ArrowLeft size={14} />
                </button>

                <div
                  className="card-phone-dots-row cinematic-dots-row"
                  role="tablist"
                  aria-label={`Select ${activeProject.title} screen`}
                >
                  {screenshots.map((shot, idx) => {
                    const active = idx === activeScreenIndex
                    return (
                      <button
                        key={shot.src}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        aria-label={`Preview ${shot.label}`}
                        onClick={() => selectScreen(idx)}
                        className={`card-phone-dot${active ? ' is-active' : ''}`}
                      />
                    )
                  })}
                </div>

                <button
                  type="button"
                  className="cinematic-dock-arrow liquid-btn"
                  onClick={() => stepScreen(1)}
                  aria-label="Next screen"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Architectural Feature Pillars (Inspired by Reference Frames 7s & 9s) ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeProject.id}-pillars`}
            className="cinematic-architectural-pillars"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -12 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.42,
              ease: easeCinematic,
            }}
          >
            <div className="cinematic-subhead-bar">
              <span className="cinematic-subhead-kicker">
                ARCHITECTURE &amp; CORE CAPABILITIES
              </span>
              <span className="cinematic-subhead-line" aria-hidden="true" />
              <span className="cinematic-subhead-meta">
                {activeProject.title.toUpperCase()} SYSTEM PILLARS
              </span>
            </div>

            <div className="cinematic-pillars-grid">
              {activeProject.features?.map((feature, index) => {
                const pillarNum = String(index + 1).padStart(2, '0')
                const highlightText = activeProject.highlights?.[index] || ''
                return (
                  <div
                    key={feature.name}
                    className="cinematic-pillar-cell glass-panel"
                  >
                    <div className="cinematic-pillar-top">
                      <span className="cinematic-pillar-num">{pillarNum}</span>
                      <span className="cinematic-pillar-tag">
                        {feature.detail}
                      </span>
                    </div>
                    <h4 className="cinematic-pillar-title">{feature.name}</h4>
                    {highlightText && (
                      <p className="cinematic-pillar-desc">{highlightText}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── "INSIDE THE APP" Multi-Screen Mosaic (Inspired by Reference Frame 11s) ── */}
        {totalScreens > 1 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeProject.id}-mosaic`}
              className="cinematic-mosaic-section"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.45,
                delay: shouldReduceMotion ? 0 : 0.05,
                ease: easeCinematic,
              }}
            >
              <div className="cinematic-mosaic-header">
                <div>
                  <span className="cinematic-subhead-kicker">
                    REAL APPLICATION SCREENS · CLICK TO PREVIEW ON DEVICE
                  </span>
                  <h4 className="cinematic-mosaic-heading">
                    INSIDE{' '}
                    <span className="works-heading-accent">THE APP.</span>
                  </h4>
                </div>

                {onOpenDetails && (
                  <button
                    type="button"
                    className="cinematic-mosaic-expand-btn glass-button liquid-btn"
                    onClick={() =>
                      onOpenDetails(activeProject, activeScreenIndex)
                    }
                  >
                    <Layers size={14} aria-hidden="true" />
                    <span>Open Full Gallery ({totalScreens} Screens)</span>
                  </button>
                )}
              </div>

              <div
                className="cinematic-mosaic-strip"
                role="list"
                aria-label={`${activeProject.title} application screenshots`}
              >
                {screenshots.map((shot, idx) => {
                  const isCurrent = idx === activeScreenIndex
                  const shotNum = String(idx + 1).padStart(2, '0')
                  return (
                    <motion.button
                      key={shot.src}
                      type="button"
                      role="listitem"
                      className={`cinematic-mosaic-card glass-panel${
                        isCurrent ? ' is-active' : ''
                      }`}
                      onClick={() => selectScreen(idx)}
                      whileHover={
                        shouldReduceMotion ? undefined : { y: -4 }
                      }
                      whileTap={
                        shouldReduceMotion ? undefined : { scale: 0.98 }
                      }
                      aria-label={`Load ${shot.label} (${shotNum} of ${formattedTotalScreens}) onto the iPhone preview`}
                      aria-pressed={isCurrent}
                    >
                      <div className="cinematic-mosaic-thumb-wrap">
                        <img
                          src={shot.src}
                          alt={shot.alt}
                          loading="lazy"
                          className="cinematic-mosaic-thumb"
                          draggable={false}
                        />
                        {isCurrent && (
                          <span className="cinematic-mosaic-live-pill">
                            ACTIVE ON DEVICE
                          </span>
                        )}
                      </div>
                      <div className="cinematic-mosaic-caption">
                        <span className="cinematic-mosaic-num">{shotNum}</span>
                        <span className="cinematic-mosaic-label">
                          {shot.label}
                        </span>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── Bottom Stage Project Transition Bar (Inspired by Reference Frames 14s & 15s) ── */}
        {totalProjects > 1 && nextProject && (
          <div className="cinematic-stage-footer">
            <div className="cinematic-footer-status">
              <span className="cinematic-footer-kicker">
                ACTIVE PRESENTATION
              </span>
              <strong>
                {formattedProjectNum} · {activeProject.title}
                {activeProject.accent}
              </strong>
            </div>

            <button
              type="button"
              className="cinematic-next-project-btn glass-button liquid-btn"
              onClick={() => cycleProject(1)}
            >
              <span className="next-project-kicker">SWITCH PROJECT</span>
              <span className="next-project-name">
                {String(nextProjectIndex + 1).padStart(2, '0')} ·{' '}
                {nextProject.title}
                {nextProject.accent}
              </span>
              <ArrowRight size={15} className="btn-arrow" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

