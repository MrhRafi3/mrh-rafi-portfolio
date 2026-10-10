import { motion } from 'motion/react'

const easeOut = [0.22, 1, 0.36, 1]

export default function ProjectCard({
  project,
  shouldReduceMotion,
  linkHover,
  children,
}) {
  return (
    <div style={{ position: 'relative', marginTop: '64px' }}>
      <div style={{
        position: 'absolute', top: '10%', right: '-10%', width: '500px', height: '500px',
        background: `radial-gradient(circle, ${project.themeColor}4D 0%, rgba(0,0,0,0) 70%)`,
        zIndex: 0, pointerEvents: 'none', filter: 'blur(40px)',
      }} />
      
      <div style={{
        position: 'absolute', bottom: '-10%', left: '-5%', width: '400px', height: '400px',
        background: `radial-gradient(circle, ${project.themeDarkColor}33 0%, rgba(0,0,0,0) 70%)`,
        zIndex: 0, pointerEvents: 'none', filter: 'blur(50px)',
      }} />

      <motion.article
        className="project-card"
        onMouseMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect()
          event.currentTarget.style.setProperty('--spotlight-x', `${event.clientX - bounds.left}px`)
          event.currentTarget.style.setProperty('--spotlight-y', `${event.clientY - bounds.top}px`)
        }}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 38, scale: 0.985 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: easeOut }}
        style={{
          position: 'relative', zIndex: 1, display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 290px), 1fr))',
          gap: 'clamp(28px, 5vw, 64px)', alignItems: 'center', overflow: 'hidden',
          padding: 'clamp(24px, 5vw, 58px)', borderRadius: '32px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.1) 100%)',
          backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)',
          border: '1px solid rgba(255, 255, 255, 0.4)', borderTop: '1px solid rgba(255, 255, 255, 0.8)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.6)',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.05), inset 0 0 20px rgba(255, 255, 255, 0.2)',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
            <span style={{
              padding: '7px 11px', border: `1px solid ${project.themeColor}4D`, borderRadius: '99px',
              color: project.themeColor, fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', background: `${project.themeColor}1A`,
            }}>{project.category}</span>
            <span style={{ color: '#6b7280', fontSize: '10px', letterSpacing: '1px', fontWeight: 500 }}>{project.type}</span>
          </div>

          <p style={{ margin: '0 0 6px', color: project.themeColor, fontSize: '12px', fontWeight: 700, letterSpacing: '3px' }}>{project.tagline}</p>
          <h3 style={{ margin: '0', color: '#111827', fontFamily: 'var(--heading-font)', fontSize: 'clamp(48px, 7vw, 82px)', fontWeight: 600, letterSpacing: '-4px', lineHeight: 1 }}>
            {project.title}<span style={{ color: project.themeColor }}>{project.accent}</span>
          </h3>
          <p style={{ maxWidth: '390px', margin: '24px 0', color: '#4b5563', fontSize: '15px', lineHeight: 1.9 }}>{project.description}</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))', gap: '10px', margin: '30px 0' }}>
            {project.features.map((feature, index) => (
              <motion.div key={feature.name} initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : index * 0.1, ease: easeOut }} whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                style={{ padding: '15px 12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.5)', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.2) 100%)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.03)' }}>
                <span style={{ display: 'block', marginBottom: '15px', color: project.themeColor, fontSize: '20px' }}>{feature.icon}</span>
                <p style={{ margin: '0 0 5px', color: '#111827', fontSize: '13px', fontWeight: 700 }}>{feature.name}</p>
                <p style={{ margin: 0, color: '#4b5563', fontSize: '11px', lineHeight: 1.6 }}>{feature.detail}</p>
              </motion.div>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '28px' }}>
            {project.links.map((link) => (
              <motion.a key={link.label} href={link.href} target="_blank" rel="noreferrer" whileHover={linkHover} whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '12px', minHeight: '44px', padding: '0 16px', borderRadius: '7px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255, 255, 255, 0.6)', background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(8px)', color: '#111827' }}>
                {link.label} <span aria-hidden="true">{link.symbol}</span>
              </motion.a>
            ))}
          </div>

          <p style={{ marginTop: '18px', color: '#9ca3af', fontSize: '10px', lineHeight: 1.7 }}>{project.repoNote}</p>
        </div>
        {children}
      </motion.article>
    </div>
  )
}
