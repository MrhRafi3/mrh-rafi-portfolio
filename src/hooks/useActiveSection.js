import { useEffect, useState } from 'react'

// Tells us which section is crossing the middle of the screen.
// `ids` must be a stable array (define it outside the component).
export default function useActiveSection(ids) {
  const [active, setActive] = useState(null)

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    if (elements.length === 0) return undefined

    // A thin band in the middle of the viewport decides the active section.
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
