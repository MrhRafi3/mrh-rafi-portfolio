import { useEffect, useState } from 'react'

/**
 * A custom hook that tracks which given section ID is currently active based on viewport intersection.
 *
 * @param {string[]} ids - An array of element IDs to track. Must be a stable array.
 * @returns {string|null} The ID of the currently active section, or null if none are active.
 */
export default function useActiveSection(ids) {
  const [active, setActive] = useState(null)

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    if (elements.length === 0) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [ids])

  return active
}
