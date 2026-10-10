import { Component, lazy, Suspense, useCallback, useState } from 'react'
import PhoneFallback from './PhoneFallback'

const IPhone3D = lazy(() => import('../IPhone3D'))

/**
 * Utility to verify WebGL support on the client before attempting to mount the 3D canvas.
 * @returns {boolean} True if WebGL is supported.
 */
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

/**
 * Error boundary component for the 3D scene.
 * Catches WebGL or Three.js related errors to safely fallback to a 2D rendering.
 */
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

/**
 * Component that manages the hero's phone visualization.
 * Handles lazy loading of the 3D scene and graceful degradation to a 2D fallback.
 */
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
