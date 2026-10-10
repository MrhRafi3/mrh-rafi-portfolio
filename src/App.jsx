import { motion, useMotionValue, useReducedMotion, useSpring, useScroll, useTransform } from 'motion/react'
import { useCallback, useRef, useState } from 'react'
import './index.css'
import './hero-upgrade.css'
import Intro from './components/Intro'
import Navbar from './components/Navbar'
import HeroPhone from './components/HeroPhone'

// --- EIKHANE {} CHARA IMPORT KORA HOLO ---
import ProjectCard from './components/ProjectCard'
import ClockyMockup from './components/ClockyMockup'

const easeOut = [0.22, 1, 0.36, 1]
const headlineLines = [
  { text: 'I build apps', accent: false },
  { text: 'that feel', accent: false },
  { text: 'effortless.', accent: true },
]

const projectsData = [
  {
    id: 'clocky',
    themeColor: '#16a34a', 
    themeDarkColor: '#15803d',
    category: 'PERSONAL PROJECT',
    type: 'MOBILE APP',
    tagline: 'YOUR TIME, YOUR WAY',
    title: 'Clocky',
    accent: '.',
    description: 'Timekeeping essentials, brought together in one clean mobile experience. Designed around clarity, simplicity and everyday use.',
    features: [
      { name: 'Clock', detail: 'Time at a glance', icon: '◷' },
      { name: 'Alarm', detail: 'Start your day', icon: '◉' },
      { name: 'Stopwatch', detail: 'Every second counts', icon: '◎' },
    ],
    links: [
      { label: 'GitHub profile', href: 'https://github.com/mrirafi/mrirafi', symbol: '↗' },
      { label: 'LinkedIn profile', href: 'https://bd.linkedin.com/in/mrhrafi', symbol: '↗' },
    ],
    repoNote: 'Clocky’s dedicated public repository is not available yet.',
  },
  {
    id: 'project-two',
    themeColor: '#3b82f6', 
    themeDarkColor: '#1d4ed8',
    category: 'CLIENT PROJECT',
    type: 'FLUTTER APP',
    tagline: 'SMART TASK MANAGEMENT',
    title: 'TaskFlow',
    accent: '+',
    description: 'A powerful productivity app that helps you manage daily tasks, collaborate with teams, and track your progress effortlessly.',
    features: [
      { name: 'Tasks', detail: 'Organize work', icon: '✓' },
      { name: 'Teams', detail: 'Work together', icon: '👥' },
      { name: 'Analytics', detail: 'Track progress', icon: '📈' },
    ],
    links: [
      { label: 'View Case Study', href: '#', symbol: '↗' },
    ],
    repoNote: 'Available on App Store & Google Play.',
  }
]

function App() {
  const shouldReduceMotion = useReducedMotion()
  const [ready, setReady] = useState(false)
  const handleIntroDone = useCallback(() => setReady(true), [])
  
  const stageRef = useRef(null)
  const heroRef = useRef(null)
  const introRef = useRef(null)
  const workRef = useRef(null)
  const aboutRef = useRef(null)
  const skillsRef = useRef(null)
  const contactRef = useRef(null)

  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.86])
  const heroCopyOpacity = useTransform(heroProgress, [0, 0.6], [1, 0])
  const heroCopyY = useTransform(heroProgress, [0, 1], [0, -56])
  const phoneScrollY = useTransform(heroProgress, [0, 1], [0, 64])

  const { scrollYProgress: introProgress } = useScroll({ target: introRef, offset: ['start end', 'end start'] })
  const introScale = useTransform(introProgress, [0, 0.5, 1], [0.88, 1, 0.88])

  const { scrollYProgress: workProgress } = useScroll({ target: workRef, offset: ['start end', 'end start'] })
  const workScale = useTransform(workProgress, [0, 0.5, 1], [0.88, 1, 0.88])

  const { scrollYProgress: aboutProgress } = useScroll({ target: aboutRef, offset: ['start end', 'end start'] })
  const aboutScale = useTransform(aboutProgress, [0, 0.5, 1], [0.88, 1, 0.88])

  const { scrollYProgress: skillsProgress } = useScroll({ target: skillsRef, offset: ['start end', 'end start'] })
  const skillsScale = useTransform(skillsProgress, [0, 0.5, 1], [0.88, 1, 0.88])

  const { scrollYProgress: contactProgress } = useScroll({ target: contactRef, offset: ['start end', 'end start'] })
  const contactScale = useTransform(contactProgress, [0, 0.5, 1], [0.88, 1, 0.88])

  const phoneRotateXValue = useMotionValue(0)
  const phoneRotateYValue = useMotionValue(0)
  const phoneRotateX = useSpring(phoneRotateXValue, { stiffness: 180, damping: 22 })
  const phoneRotateY = useSpring(phoneRotateYValue, { stiffness: 180, damping: 22 })

  const handlePhoneMouseMove = (event) => {
    if (shouldReduceMotion) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height
    phoneRotateXValue.set((0.5 - y) * 12)
    phoneRotateYValue.set((x - 0.5) * 14)
  }

  const handlePhoneMouseLeave = () => {
    phoneRotateXValue.set(0)
    phoneRotateYValue.set(0)
  }

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

  const handleStagePointerLeave = () => {
    const stage = stageRef.current
    if (!stage) return
    stage.style.setProperty('--mx', '0')
    stage.style.setProperty('--my', '0')
  }

  const reveal = (delay = 0, distance = 24) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: distance },
    animate: ready || shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: distance },
    transition: { duration: shouldReduceMotion ? 0 : 0.8, delay: shouldReduceMotion ? 0 : delay, ease: easeOut },
  })

  const scrollReveal = (distance = 32) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: distance },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: shouldReduceMotion ? 0 : 0.75, ease: easeOut },
  })

  const linkHover = shouldReduceMotion ? undefined : { y: -3, transition: { duration: 0.2 } }

  return (
    <main className="portfolio">
      <Intro reducedMotion={shouldReduceMotion} onDone={handleIntroDone} />
      <Navbar reveal={reveal} linkHover={linkHover} reducedMotion={shouldReduceMotion} />

      <motion.section className="hero-section" id="home" ref={heroRef} style={{ scale: shouldReduceMotion ? 1 : heroScale, transformOrigin: 'center top' }}>
        <motion.div className="hero-copy" style={{ opacity: shouldReduceMotion ? 1 : heroCopyOpacity, y: shouldReduceMotion ? 0 : heroCopyY }}>
          <motion.div className="availability" {...reveal(0.15)}>
            <span className="status-dot" /> FLUTTER DEVELOPER
          </motion.div>
          <motion.p className="eyebrow" {...reveal(0.25)}>INDEPENDENT DEVELOPER · BANGLADESH</motion.p>
          <h1 aria-label="I build apps that feel effortless.">
            {headlineLines.map((line, index) => (
              <span className="line-mask" key={line.text} aria-hidden="true">
                <motion.span className={`line-inner${line.accent ? ' accent-text' : ''}`} initial={shouldReduceMotion ? false : { y: '112%' }} animate={{ y: ready || shouldReduceMotion ? '0%' : '112%' }} transition={{ duration: shouldReduceMotion ? 0 : 0.95, delay: shouldReduceMotion ? 0 : 0.3 + index * 0.12, ease: easeOut }}>
                  {line.text}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p className="hero-description" {...reveal(0.55)}>
            Thoughtful mobile experiences, crafted with clean code and a passion for purposeful design.
          </motion.p>
          <motion.div className="hero-actions" {...reveal(0.68)}>
            <motion.a className="button-primary magnetic-button" href="#work" whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.02 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}>
              Explore my work <span aria-hidden="true">↗</span>
            </motion.a>
            <motion.a className="button-secondary magnetic-button" href="#contact" whileHover={linkHover} whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}>
              Get in touch <span aria-hidden="true">→</span>
            </motion.a>
          </motion.div>
          <motion.div className="hero-location" {...reveal(0.82, 10)}>
            <span aria-hidden="true">↳</span> Based in Bangladesh
          </motion.div>
        </motion.div>

        <motion.div className="visual-stage" ref={stageRef} onPointerMove={handleStagePointerMove} onPointerLeave={handleStagePointerLeave} initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94, y: 24 }} animate={ready || shouldReduceMotion ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.94, y: 24 }} transition={{ duration: shouldReduceMotion ? 0 : 1, delay: shouldReduceMotion ? 0 : 0.25, ease: easeOut }}>
          <motion.div className="orbit orbit-one" initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.8 }} animate={ready || shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }} transition={{ duration: 1.2, delay: 0.45, ease: easeOut }} />
          <motion.div className="orbit orbit-two" initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.8 }} animate={ready || shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }} transition={{ duration: 1.2, delay: 0.6, ease: easeOut }} />
          <motion.div className="floating-label label-top" {...reveal(0.7, 14)}><span className="label-icon">✳</span> Crafted with purpose</motion.div>
          <motion.div className="phone-tilt" style={{ rotateX: phoneRotateX, rotateY: phoneRotateY, y: shouldReduceMotion ? 0 : phoneScrollY, transformPerspective: 1000 }} onMouseMove={handlePhoneMouseMove} onMouseLeave={handlePhoneMouseLeave}>
            <HeroPhone reducedMotion={shouldReduceMotion} scrollProgress={heroProgress} />
          </motion.div>
          <motion.div className="floating-label label-bottom" {...reveal(0.85, -14)}><span className="label-dot" /> Built with Flutter</motion.div>
          <motion.div className="tech-label" {...reveal(0.95, 8)}>DART / FLUTTER</motion.div>
        </motion.div>

        <motion.div className="hero-index" {...reveal(1, 8)}>
          <span>01</span><span className="index-line" /><span>SCROLL TO EXPLORE</span>
        </motion.div>
      </motion.section>

      <motion.section className="intro-strip" ref={introRef} style={{ scale: shouldReduceMotion ? 1 : introScale, transformOrigin: 'center center' }} {...scrollReveal(18)}>
        {['MOBILE ENGINEERING', 'THOUGHTFUL DESIGN', 'REAL-WORLD SOLUTIONS'].map((item, index) => (
          <span key={item} style={{ display: 'contents' }}>
            <motion.p initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : index * 0.12, ease: easeOut }}>{item}</motion.p>
            {index < 2 && <span aria-hidden="true">✳</span>}
          </span>
        ))}
      </motion.section>

      <motion.section className="next-section" id="work" ref={workRef} style={{ scale: shouldReduceMotion ? 1 : workScale, transformOrigin: 'center center' }} {...scrollReveal(28)}>
        <p className="eyebrow">01 / SELECTED PROJECTS</p>
        <h2>Featured <span>Works.</span></h2>
        
        {projectsData.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            shouldReduceMotion={shouldReduceMotion} 
            linkHover={linkHover}
          >
            {project.id === 'clocky' ? (
              <ClockyMockup shouldReduceMotion={shouldReduceMotion} />
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '360px', padding: '24px' }}>
                <div style={{ 
                  width: '100%', height: '300px', borderRadius: '24px', 
                  border: '1px dashed rgba(255,255,255,0.6)', 
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: project.themeDarkColor, fontWeight: 'bold'
                }}>
                  {project.title} Mockup Goes Here!
                </div>
              </div>
            )}
          </ProjectCard>
        ))}

      </motion.section>

      <motion.section className="placeholder-section" id="about" ref={aboutRef} style={{ scale: shouldReduceMotion ? 1 : aboutScale, transformOrigin: 'center center' }} {...scrollReveal(32)}>
        <p className="eyebrow">02 / ABOUT</p><h2>Built with curiosity.</h2>
      </motion.section>
      
      <motion.section className="placeholder-section" id="skills" ref={skillsRef} style={{ scale: shouldReduceMotion ? 1 : skillsScale, transformOrigin: 'center center' }} {...scrollReveal(32)}>
        <p className="eyebrow">03 / SKILLS</p><h2>Tools for thoughtful products.</h2>
      </motion.section>

      <motion.footer className="footer" id="contact" ref={contactRef} style={{ scale: shouldReduceMotion ? 1 : contactScale, transformOrigin: 'center center' }} {...scrollReveal(28)}>
        <div>
          <p className="eyebrow">HAVE AN IDEA?</p>
          <h2>Let's build something <span>meaningful.</span></h2>
        </div>
        <motion.a className="button-primary" href="https://bd.linkedin.com/in/mrhrafi" target="_blank" rel="noreferrer" whileHover={linkHover} whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}>
          Let's connect ↗
        </motion.a>
        <p className="footer-note">© {new Date().getFullYear()} Mrh Rafi · Made with intention.</p>
      </motion.footer>
    </main>
  )
}

export default App
