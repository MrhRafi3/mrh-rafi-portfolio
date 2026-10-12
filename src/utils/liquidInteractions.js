/**
 * Lightweight, RAF-throttled DOM utilities for cursor-following liquid glass
 * specular edge reflections. Zero React state updates or layout thrashing.
 */

const pendingPointerFrames = new WeakMap()

/**
 * Updates CSS custom properties (--spot-x, --spot-y, --spot-opacity) on a card
 * or glass surface once per animation frame to create a subtle specular highlight.
 *
 * @param {React.PointerEvent<HTMLElement>} event
 * @param {boolean} [shouldReduceMotion=false]
 */
export function handleLiquidPointerMove(event, shouldReduceMotion = false) {
  if (shouldReduceMotion) return
  if (event.pointerType && event.pointerType !== 'mouse') return

  const element = event.currentTarget
  if (!element) return

  const clientX = event.clientX
  const clientY = event.clientY

  if (pendingPointerFrames.has(element)) return

  const rafId = window.requestAnimationFrame(() => {
    pendingPointerFrames.delete(element)
    const bounds = element.getBoundingClientRect()
    if (bounds.width === 0 || bounds.height === 0) return

    const x = clientX - bounds.left
    const y = clientY - bounds.top

    element.style.setProperty('--spot-x', `${x.toFixed(1)}px`)
    element.style.setProperty('--spot-y', `${y.toFixed(1)}px`)
    element.style.setProperty('--spot-opacity', '1')
  })

  pendingPointerFrames.set(element, rafId)
}

/**
 * Fades out the cursor-following specular highlight when the pointer leaves.
 *
 * @param {React.PointerEvent<HTMLElement>} event
 */
export function handleLiquidPointerLeave(event) {
  const element = event.currentTarget
  if (!element) return

  const pendingRaf = pendingPointerFrames.get(element)
  if (pendingRaf) {
    window.cancelAnimationFrame(pendingRaf)
    pendingPointerFrames.delete(element)
  }

  element.style.setProperty('--spot-opacity', '0')
}
