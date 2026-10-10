import { useState } from 'react'
import { motion } from 'motion/react'
import { Image as ImageIcon, Layers, Smartphone } from 'lucide-react'

/**
 * Renders the interactive device preview for Expify Beta.
 * Displays real application screenshots when placed in `public/images/expify/`,
 * and shows a truthful, clearly marked screenshot slot placeholder until supplied,
 * without fabricating unverified app screens or statistics.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.shouldReduceMotion - Whether to disable animations for accessibility.
 * @param {Array<{src: string, label: string, alt: string}>} props.screenshots - Configured screenshot paths.
 * @param {Function} props.onOpenDetails - Callback to open the project details modal.
 * @returns {JSX.Element} The rendered Expify Beta preview component.
 */
export default function ExpifyMockup({
  shouldReduceMotion,
  screenshots = [],
  onOpenDetails,
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [failedImages, setFailedImages] = useState({})

  const currentShot = screenshots[activeIndex] || screenshots[0]
  const isCurrentImageAvailable =
    currentShot && !failedImages[currentShot.src]

  const handleImageError = (src) => {
    setFailedImages((prev) => ({ ...prev, [src]: true }))
  }

  return (
    <motion.div
      aria-label="Expify Beta application preview"
      initial={
        shouldReduceMotion
          ? false
          : { opacity: 0, scale: 0.9, y: 36 }
      }
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.85,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        position: 'relative',
        display: 'grid',
        placeItems: 'center',
        minHeight: '380px',
        padding: '24px 0',
      }}
    >
      <motion.div
        aria-hidden="true"
        animate={shouldReduceMotion ? undefined : { rotate: -360 }}
        transition={{ duration: 75, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          width: 'min(76vw, 340px)',
          aspectRatio: '1',
          border: '1px solid rgba(209, 122, 66, 0.14)',
          borderRadius: '50%',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: 'min(62vw, 270px)',
          aspectRatio: '1',
          border: '1px dashed rgba(26, 26, 26, 0.1)',
          borderRadius: '50%',
        }}
      />

      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : { y: [0, -7, 0], rotate: [1.5, 0.5, 1.5] }
        }
        transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'relative',
          zIndex: 1,
          width: 'min(68%, 235px)',
          minWidth: '198px',
          padding: '9px',
          borderRadius: '32px',
          border: '1px solid rgba(255, 255, 255, 0.65)',
          background: '#111210',
          boxShadow:
            '0 35px 85px rgba(23, 23, 25, 0.16), 0 0 40px rgba(241, 100, 54, 0.12)',
        }}
      >
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            minHeight: '360px',
            borderRadius: '24px',
            background:
              'linear-gradient(165deg, #1b1917 0%, #11100f 55%, #181512 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {isCurrentImageAvailable ? (
            <img
              src={currentShot.src}
              alt={currentShot.alt}
              loading="lazy"
              onError={() => handleImageError(currentShot.src)}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          ) : (
            <div
              style={{
                padding: '18px 14px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '360px',
                color: '#f4f3ed',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: '#c9c5bc',
                  fontSize: '8px',
                }}
              >
                <span>9:41</span>
                <span>FLUTTER · BETA</span>
              </div>

              <div
                style={{
                  margin: 'auto 0',
                  padding: '18px 12px',
                  borderRadius: '16px',
                  border: '1px dashed rgba(241, 100, 54, 0.45)',
                  background: 'rgba(241, 100, 54, 0.07)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    margin: '0 auto 12px',
                    borderRadius: '11px',
                    display: 'grid',
                    placeItems: 'center',
                    background: 'rgba(241, 100, 54, 0.18)',
                    color: '#ff8a61',
                  }}
                >
                  <ImageIcon size={18} />
                </div>

                <p
                  style={{
                    margin: '0 0 4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#ffffff',
                    letterSpacing: '0.3px',
                  }}
                >
                  Expify Beta Screenshot
                </p>
                <p
                  style={{
                    margin: '0 0 10px',
                    fontSize: '9px',
                    lineHeight: 1.5,
                    color: '#b8b3aa',
                  }}
                >
                  Awaiting real app screenshot asset:
                </p>
                <code
                  style={{
                    display: 'block',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    background: 'rgba(0, 0, 0, 0.35)',
                    color: '#ffb092',
                    fontSize: '8px',
                    wordBreak: 'break-all',
                  }}
                >
                  {currentShot
                    ? `public${currentShot.src}`
                    : 'public/images/expify/screen-1.png'}
                </code>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '8px',
                  color: '#9c968d',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Smartphone size={11} color="#f16436" /> Expense Tracker
                </span>
                {onOpenDetails && (
                  <button
                    type="button"
                    onClick={onOpenDetails}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      padding: 0,
                      color: '#ff8a61',
                      fontSize: '8px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Details ↗
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {screenshots.length > 1 && (
          <div
            role="tablist"
            aria-label="Select Expify Beta screenshot"
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '10px',
              paddingBottom: '2px',
            }}
          >
            {screenshots.map((shot, idx) => {
              const active = idx === activeIndex
              return (
                <button
                  key={shot.src}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={shot.label}
                  onClick={() => setActiveIndex(idx)}
                  style={{
                    height: '6px',
                    width: active ? '20px' : '6px',
                    borderRadius: '99px',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    background: active ? '#f16436' : 'rgba(255,255,255,0.28)',
                    transition: 'all 200ms ease',
                  }}
                />
              )
            })}
          </div>
        )}
      </motion.div>

      <motion.div
        animate={shouldReduceMotion ? undefined : { y: [0, -5, 0] }}
        transition={{ duration: 3.9, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '13%',
          right: '0',
          zIndex: 2,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '11px 14px',
          borderRadius: '10px',
          fontSize: '10px',
          fontWeight: 600,
          border: '1px solid rgba(255, 255, 255, 0.75)',
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.86) 0%, rgba(255,255,255,0.5) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          color: '#111827',
          boxShadow: '0 14px 35px rgba(0,0,0,0.06)',
        }}
      >
        <Layers size={13} color="#d6603a" /> Flutter Expense Tracker
      </motion.div>

      <motion.div
        animate={shouldReduceMotion ? undefined : { y: [0, 5, 0] }}
        transition={{ duration: 4.3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: '12%',
          left: '0',
          zIndex: 2,
          padding: '11px 14px',
          borderRadius: '10px',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.5px',
          border: '1px solid rgba(214, 96, 58, 0.4)',
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.65) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          color: '#c24119',
          boxShadow: '0 14px 35px rgba(0,0,0,0.06)',
        }}
      >
        EXPIFY · BETA BUILD
      </motion.div>
    </motion.div>
  )
}

