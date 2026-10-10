import { Component, lazy, Suspense, useCallback, useState } from 'react'
import PhoneFallback from './PhoneFallback'

// The 3D scene (three.js + the 24 MB model) loads in its own chunk,
// so it never blocks the first paint of the page.
const IPhone3D = lazy(() => import('../IPhone3D'))

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl')),
    )
  } catch {
    return false
  }
}

// If anything inside the 3D scene throws (model missing, shader error...),
// we drop back to the static phone instead of leaving the hero blank.
class SceneBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.error('[HeroPhone] 3D scene failed, using static phone:', error)
    this.props.onError?.()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

export default function HeroPhone({ reducedMotion, scrollProgress }) {
  const [webglOk, setWebglOk] = useState(() => supportsWebGL())
  const [sceneReady, setSceneReady] = useState(false)

  const handleReady = useCallback(() => setSceneReady(true), [])
  const handleFail = useCallback(() => setWebglOk(false), [])

  if (!webglOk) {
    return (
      <div className="hero-phone">
        <PhoneFallback />
      </div>
    )
  }

  // The static phone sits underneath and fades out once the 3D model is ready.
  return (
    <div className={`hero-phone${sceneReady ? ' is-ready' : ''}`}>
      <PhoneFallback />

      <SceneBoundary onError={handleFail}>
        <Suspense fallback={null}>
          <IPhone3D
            reducedMotion={reducedMotion}
            scrollProgress={scrollProgress}
            onReady={handleReady}
            onFail={handleFail}
          />
        </Suspense>
      </SceneBoundary>
    </div>
  )
}
