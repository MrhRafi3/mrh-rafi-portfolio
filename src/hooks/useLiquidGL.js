import { useEffect, useRef } from 'react'
import liquidGL from 'liquid-gl'

/**
 * Initializes authentic WebGPU/WebGL optical liquid-glass refraction on selected
 * Layer A surfaces using the official `liquid-gl` library, with automatic fallback
 * to CSS `backdrop-filter` when WebGPU/WebGL is unavailable or reduced motion is active.
 *
 * Updates the lens tint smoothly after theme transitions finish rather than
 * tearing down and re-snapshotting the entire DOM during a View Transition.
 *
 * @param {Object} params - Hook configuration parameters.
 * @param {boolean} params.enabled - Whether the page is ready for snapshot capture.
 * @param {boolean} params.reducedMotion - Whether reduced motion is preferred.
 * @param {'light' | 'dark'} [params.theme='light'] - Active portfolio theme.
 * @param {string} [params.target='.liquid-gl-target'] - CSS selector for Layer A glass lenses.
 */
export default function useLiquidGL({
  enabled = true,
  reducedMotion = false,
  theme = 'light',
  target = '.liquid-gl-target',
} = {}) {
  const instancesRef = useRef(null)
  const initialThemeRef = useRef(theme)

  // Initialize liquidGL once when enabled, avoiding expensive re-snapshots on theme toggle
  useEffect(() => {
    if (!enabled || reducedMotion || typeof window === 'undefined') {
      return undefined
    }

    const isDesktopViewport =
      window.matchMedia?.('(min-width: 768px)').matches ?? true
    if (!isDesktopViewport) {
      return undefined
    }

    let initTimer = null
    const startTheme = initialThemeRef.current
    const tintColor =
      startTheme === 'light'
        ? 'rgba(255, 250, 234, 0.52)'
        : 'rgba(48, 36, 27, 0.58)'

    initTimer = window.setTimeout(() => {
      const matchingNodes = document.querySelectorAll(target)
      if (!matchingNodes || matchingNodes.length === 0) return

      try {
        instancesRef.current = liquidGL({
          target,
          snapshot: '.portfolio',
          engine: 'auto',
          resolution: 1.0,
          refraction: 0.012,
          aberration: 0.0015,
          bevelDepth: 0.045,
          bevelWidth: 0.13,
          frost: 2,
          shadow: false,
          specular: true,
          reveal: 'fade',
          tilt: false,
          draggable: false,
          interaction: 'fluid',
          interactionStrength: 0.2,
          interactionRadius: 0.3,
          interactionViscosity: 0.72,
          magnify: 1,
          tint: tintColor,
        })
      } catch (error) {
        console.warn('liquidGL fallback to CSS glass:', error)
      }
    }, 320)

    return () => {
      if (initTimer) {
        window.clearTimeout(initTimer)
      }
      const current = instancesRef.current
      instancesRef.current = null
      if (!current) return
      const lensList = Array.isArray(current) ? current : [current]
      lensList.forEach((lens) => {
        try {
          lens?.destroy?.()
        } catch {
          // Ignore cleanup errors
        }
      })
    }
  }, [enabled, reducedMotion, target])

  // Update lens tint after the circular theme reveal finishes so zero main-thread work happens mid-transition
  useEffect(() => {
    initialThemeRef.current = theme
    if (!instancesRef.current || typeof window === 'undefined') return undefined

    const tintColor =
      theme === 'light'
        ? 'rgba(255, 250, 234, 0.52)'
        : 'rgba(48, 36, 27, 0.58)'

    const syncTimer = window.setTimeout(() => {
      const current = instancesRef.current
      if (!current) return
      const lensList = Array.isArray(current) ? current : [current]
      lensList.forEach((lens) => {
        try {
          lens?.setTint?.(tintColor)
          lens?.renderer?.captureSnapshot?.()
        } catch {
          // Ignore tint update errors
        }
      })
    }, 740)

    return () => window.clearTimeout(syncTimer)
  }, [theme])
}
