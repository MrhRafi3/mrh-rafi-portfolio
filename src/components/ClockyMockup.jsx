import { motion } from 'motion/react'

/**
 * Renders a decorative mockup of the Clocky application with floating animations.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.shouldReduceMotion - Whether to disable animations for accessibility.
 * @returns {JSX.Element} The rendered mockup component.
 */
export default function ClockyMockup({ shouldReduceMotion }) {
  return (
    <motion.div aria-label="Decorative Clocky app concept preview" initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.65, y: 55, rotateY: 14 }} whileInView={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: shouldReduceMotion ? 0 : 1, ease: [0.22, 1, 0.36, 1] }} style={{ position: 'relative', display: 'grid', placeItems: 'center', minHeight: '360px', padding: '24px 0', perspective: '1000px' }}>
      <motion.div aria-hidden="true" animate={shouldReduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 65, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', width: 'min(76vw, 340px)', aspectRatio: '1', border: '1px solid rgba(0, 0, 0, 0.04)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', width: 'min(62vw, 270px)', aspectRatio: '1', border: '1px dashed rgba(0, 0, 0, 0.08)', borderRadius: '50%' }} />

      <motion.div animate={shouldReduceMotion ? undefined : { y: [0, -9, 0], rotate: [-2, -1, -2] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'relative', zIndex: 1, width: 'min(64%, 225px)', minWidth: '190px', padding: '9px', borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.5)', background: '#080907', boxShadow: '0 35px 90px rgba(0,0,0,0.12), 0 0 45px rgba(214,96,58,0.15)' }}>
        <div style={{ overflow: 'hidden', minHeight: '340px', padding: '18px 13px 16px', borderRadius: '24px', background: 'linear-gradient(160deg, #20251a 0%, #12140f 50%, #1b1e16 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#d9dccf', fontSize: '8px' }}><span>9:41</span><span>● ▰</span></div>
          <div style={{ marginTop: '31px', color: '#a8ad9b', fontSize: '8px', letterSpacing: '2px' }}>YOUR TIME, YOUR WAY</div>
          <div style={{ marginTop: '12px', color: '#f4f5ec', fontFamily: 'var(--heading-font)', fontSize: 'clamp(37px, 5vw, 48px)', fontWeight: 500, letterSpacing: '-2px', lineHeight: 1 }}>09<span style={{ color: '#d6603a' }}>:</span>41</div>
          <div style={{ marginTop: '9px', color: '#969a8b', fontSize: '7px', letterSpacing: '1.5px' }}>YOUR EVERYDAY CLOCK</div>
          <div style={{ height: '1px', margin: '22px 0 14px', background: 'rgba(255,255,255,0.12)' }} />
          {[
            { icon: '◷', title: 'Alarm', caption: 'Wake up on time' },
            { icon: '◎', title: 'Stopwatch', caption: 'Track every second' },
          ].map((item) => (
            <div key={item.title} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', padding: '12px 9px', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', background: 'rgba(255,255,255,0.035)' }}>
              <span style={{ display: 'grid', placeItems: 'center', width: '30px', height: '30px', borderRadius: '9px', background: 'rgba(214,96,58,0.15)', color: '#d6603a', fontSize: '16px' }}>{item.icon}</span>
              <span>
                <span style={{ display: 'block', color: '#f0f1e7', fontSize: '9px', fontWeight: 600 }}>{item.title}</span>
                <span style={{ display: 'block', marginTop: '4px', color: '#8f9385', fontSize: '7px' }}>{item.caption}</span>
              </span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '18px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.08)', color: '#d6603a', fontSize: '14px' }}>
            <span>◷</span><span style={{ color: '#777c6e' }}>◉</span><span style={{ color: '#777c6e' }}>⚙</span>
          </div>
        </div>
      </motion.div>

      <motion.div animate={shouldReduceMotion ? undefined : { y: [0, -5, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', top: '15%', right: '0', zIndex: 2, padding: '12px 14px', borderRadius: '10px', fontSize: '10px', fontWeight: 600, border: '1px solid rgba(255, 255, 255, 0.7)', background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', color: '#111827', boxShadow: '0 14px 35px rgba(0,0,0,0.06)' }}>
        <span style={{ color: '#d6603a' }}>✳</span> Made for everyday
      </motion.div>

      <motion.div animate={shouldReduceMotion ? undefined : { y: [0, 5, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', bottom: '13%', left: '0', zIndex: 2, padding: '12px 14px', borderRadius: '10px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', border: '1px solid rgba(214, 96, 58, 0.4)', background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', color: '#c24119', boxShadow: '0 14px 35px rgba(0,0,0,0.06)' }}>
        CLOCK · ALARM · TIMER
      </motion.div>
    </motion.div>
  )
}
