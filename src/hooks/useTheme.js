import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

const STORAGE_KEY = 'mrh-theme'
const TRANSITION_DURATION_MS = 680
const TRANSITION_EASING = 'cubic-bezier(0.33, 1, 0.68, 1)'

/**
 * Resolves the initial theme without causing a flash or hydration mismatch.
 * Defaults to Light Mode ('light' — Clay Brown + Soft Butter) whenever no valid
 * user preference has been saved in localStorage, regardless of OS theme.
 *
 * @returns {'light' | 'dark'}
 */
function resolveInitialTheme() {
  if (typeof window === 'undefined') return 'light'

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') {
      return saved
    }
  } catch {
    // Ignore storage read errors in restricted environments
  }

  const rootAttr = document.documentElement.getAttribute('data-theme')
  if (rootAttr === 'light' || rootAttr === 'dark') {
    return rootAttr
  }

  return 'light'
}

/**
 * Applies the selected theme to document.documentElement and updates the browser
 * theme-color meta tag so mobile status bars match the active palette.
 *
 * @param {'light' | 'dark'} nextTheme
 */
function applyThemeToDOM(nextTheme) {
  if (typeof document === 'undefined') return

  const safeTheme = nextTheme === 'dark' ? 'dark' : 'light'
  const root = document.documentElement
  root.setAttribute('data-theme', safeTheme)
  root.style.colorScheme = safeTheme

  const themeMeta =
    document.getElementById('theme-color-meta') ||
    document.querySelector('meta[name="theme-color"]')
  if (themeMeta) {
    themeMeta.setAttribute(
      'content',
      safeTheme === 'light' ? '#F7F0D8' : '#171310',
    )
  }
}

/**
 * Spawns a GPU-composited, soft-feathered liquid glass ring that glides along
 * the circular reveal edge. Animates only `transform` and `opacity` on a fixed
 * 200x200 layer to avoid layout thrashing or per-frame shadow repaints.
 *
 * @param {number} x - Origin X in viewport coordinates
 * @param {number} y - Origin Y in viewport coordinates
 * @param {number} maxRadius - Target radius covering the farthest viewport corner
 * @param {'light' | 'dark'} nextTheme - Destination theme
 * @returns {() => void} Cleanup function to remove the temporary element
 */
function spawnLiquidMembraneRing(x, y, maxRadius, nextTheme) {
  if (typeof document === 'undefined') return () => {}

  const ring = document.createElement('div')
  ring.className = 'theme-liquid-wave-ring'
  ring.setAttribute('data-target-theme', nextTheme)
  ring.setAttribute('aria-hidden', 'true')
  ring.style.left = `${x}px`
  ring.style.top = `${y}px`
  document.body.appendChild(ring)

  const targetScale = Math.max(1, (maxRadius * 2.04) / 200)
  const midScale = targetScale * 0.66

  const animation = ring.animate(
    [
      {
        transform: 'translate3d(-50%, -50%, 0) scale(0.06)',
        opacity: 0.82,
      },
      {
        transform: `translate3d(-50%, -50%, 0) scale(${midScale.toFixed(3)})`,
        opacity: 0.56,
        offset: 0.64,
      },
      {
        transform: `translate3d(-50%, -50%, 0) scale(${targetScale.toFixed(3)})`,
        opacity: 0,
      },
    ],
    {
      duration: TRANSITION_DURATION_MS,
      easing: TRANSITION_EASING,
      fill: 'forwards',
    },
  )

  let removed = false
  const cleanup = () => {
    if (removed) return
    removed = true
    try {
      animation.cancel()
    } catch {
      // Ignore animation cancel errors
    }
    ring.remove()
  }

  animation.onfinish = cleanup
  return cleanup
}

/**
 * Custom hook that manages the Clay & Butter (light, default) and Midnight Espresso (dark)
 * theme state, localStorage persistence, and a silky, GPU-composited circular liquid reveal
 * originating from the toggle button.
 */
export default function useTheme() {
  const [theme, setTheme] = useState(resolveInitialTheme)
  const isTransitioningRef = useRef(false)

  // Ensure DOM attributes stay synchronized on mount and when theme changes
  useEffect(() => {
    applyThemeToDOM(theme)
  }, [theme])

  /**
   * Switches between light and dark themes with a soft circular liquid-glass reveal
   * expanding from the exact click/activation coordinates of the toggle control.
   */
  const toggleTheme = useCallback(
    (event) => {
      if (isTransitioningRef.current) return

      const nextTheme = theme === 'dark' ? 'light' : 'dark'

      const commitTheme = () => {
        try {
          window.localStorage.setItem(STORAGE_KEY, nextTheme)
        } catch {
          // Ignore storage write errors
        }
        applyThemeToDOM(nextTheme)
        setTheme(nextTheme)
      }

      if (typeof window === 'undefined' || typeof document === 'undefined') {
        commitTheme()
        return
      }

      const prefersReducedMotion = window.matchMedia?.(
        '(prefers-reduced-motion: reduce)',
      ).matches

      if (prefersReducedMotion) {
        commitTheme()
        return
      }

      // Determine exact viewport origin from click coordinates or button center (keyboard activation)
      let originX = window.innerWidth - 48
      let originY = 44

      if (event) {
        const hasPointerCoords =
          typeof event.clientX === 'number' &&
          typeof event.clientY === 'number' &&
          (event.clientX !== 0 || event.clientY !== 0)

        if (hasPointerCoords) {
          originX = event.clientX
          originY = event.clientY
        } else if (event.currentTarget?.getBoundingClientRect) {
          const rect = event.currentTarget.getBoundingClientRect()
          originX = rect.left + rect.width / 2
          originY = rect.top + rect.height / 2
        }
      }

      // Compute radius needed to smoothly cover the farthest corner of the viewport
      const maxX = Math.max(originX, window.innerWidth - originX)
      const maxY = Math.max(originY, window.innerHeight - originY)
      const maxRadius = Math.ceil(Math.hypot(maxX, maxY)) + 12

      const root = document.documentElement
      root.style.setProperty('--theme-ripple-x', `${originX}px`)
      root.style.setProperty('--theme-ripple-y', `${originY}px`)
      root.style.setProperty('--theme-ripple-r', `${maxRadius}px`)

      // Preferred path: Browser View Transition API with composited circular clip-path reveal
      if (typeof document.startViewTransition === 'function') {
        isTransitioningRef.current = true
        root.setAttribute('data-theme-transition', 'active')

        const cleanupRing = spawnLiquidMembraneRing(
          originX,
          originY,
          maxRadius,
          nextTheme,
        )

        try {
          const transition = document.startViewTransition(() => {
            flushSync(() => {
              commitTheme()
            })
          })

          transition.ready
            .then(() => {
              document.documentElement.animate(
                {
                  clipPath: [
                    `circle(0px at ${originX}px ${originY}px)`,
                    `circle(${maxRadius}px at ${originX}px ${originY}px)`,
                  ],
                },
                {
                  duration: TRANSITION_DURATION_MS,
                  easing: TRANSITION_EASING,
                  pseudoElement: '::view-transition-new(root)',
                },
              )
            })
            .catch(() => {
              // If pseudoElement animation fails, the theme is still committed
            })

          transition.finished.finally(() => {
            root.removeAttribute('data-theme-transition')
            root.style.removeProperty('--theme-ripple-x')
            root.style.removeProperty('--theme-ripple-y')
            root.style.removeProperty('--theme-ripple-r')
            cleanupRing()
            isTransitioningRef.current = false
          })
          return
        } catch {
          root.removeAttribute('data-theme-transition')
          root.style.removeProperty('--theme-ripple-x')
          root.style.removeProperty('--theme-ripple-y')
          root.style.removeProperty('--theme-ripple-r')
          cleanupRing()
          isTransitioningRef.current = false
        }
      }

      // Fallback path for browsers without View Transition API:
      // Expand a temporary circular liquid membrane veil from the click origin
      isTransitioningRef.current = true
      const fallbackVeil = document.createElement('div')
      fallbackVeil.className = 'theme-liquid-fallback-veil'
      fallbackVeil.setAttribute('data-target-theme', nextTheme)
      fallbackVeil.setAttribute('aria-hidden', 'true')
      document.body.appendChild(fallbackVeil)

      const cleanupRing = spawnLiquidMembraneRing(
        originX,
        originY,
        maxRadius,
        nextTheme,
      )

      const veilAnim = fallbackVeil.animate(
        [
          {
            clipPath: `circle(0px at ${originX}px ${originY}px)`,
            opacity: 0.94,
          },
          {
            clipPath: `circle(${maxRadius}px at ${originX}px ${originY}px)`,
            opacity: 0.94,
            offset: 0.72,
          },
          {
            clipPath: `circle(${maxRadius}px at ${originX}px ${originY}px)`,
            opacity: 0,
          },
        ],
        {
          duration: TRANSITION_DURATION_MS,
          easing: TRANSITION_EASING,
          fill: 'forwards',
        },
      )

      const switchTimer = window.setTimeout(() => {
        commitTheme()
      }, Math.round(TRANSITION_DURATION_MS * 0.4))

      veilAnim.onfinish = () => {
        window.clearTimeout(switchTimer)
        fallbackVeil.remove()
        cleanupRing()
        root.style.removeProperty('--theme-ripple-x')
        root.style.removeProperty('--theme-ripple-y')
        root.style.removeProperty('--theme-ripple-r')
        isTransitioningRef.current = false
      }
    },
    [theme],
  )

  return {
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    toggleTheme,
  }
}
