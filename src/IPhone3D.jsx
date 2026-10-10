import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Float, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const SCREEN_MODE = 'taskflow'
const SCREEN_FLIP_X = true
const SCREEN_FLIP_Y = false
const GLASS_OPACITY = 0.12
const SCREEN_BRIGHTNESS = 1
const MAX_DPR = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches ? 1.25 : 1.5
const INTRO_SECONDS = 1.8
const SCREEN_Z_OFFSET = 0.0001
const SCREEN_W = 640
const SCREEN_H = 1388
const DESIGN_W = 300
const DESIGN_SCALE = SCREEN_W / DESIGN_W
const DESIGN_H = SCREEN_H / DESIGN_SCALE
const FONT = '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif'

/**
 * Draws a rectangle with rounded corners on a canvas context.
 * Provides broad browser compatibility without relying on ctx.roundRect.
 */
function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/**
 * Renders a test card to the canvas to help debug texture orientation and mapping.
 */
function drawTestCard(ctx, W, H) {
  ctx.fillStyle = '#1b1f1c'
  ctx.fillRect(0, 0, W, H)

  ctx.strokeStyle = 'rgba(255,255,255,0.12)'
  ctx.lineWidth = 1
  for (let x = 0; x <= W; x += 25) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, H)
    ctx.stroke()
  }
  for (let y = 0; y <= H; y += 25) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(W, y)
    ctx.stroke()
  }

  const size = 46
  ctx.fillStyle = '#ff4d4d'
  ctx.fillRect(0, 0, size, size)
  ctx.fillStyle = '#4dff88'
  ctx.fillRect(W - size, 0, size, size)
  ctx.fillStyle = '#4d9bff'
  ctx.fillRect(0, H - size, size, size)
  ctx.fillStyle = '#ffe14d'
  ctx.fillRect(W - size, H - size, size, size)

  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.font = `800 22px ${FONT}`
  ctx.fillText('TOP', W / 2, 60)
  ctx.fillText('BOTTOM', W / 2, H - 36)

  ctx.textAlign = 'left'
  ctx.fillText('L', 12, H / 2)
  ctx.textAlign = 'right'
  ctx.fillText('R', W - 12, H / 2)

  ctx.textAlign = 'center'
  ctx.font = `800 190px ${FONT}`
  ctx.fillStyle = '#b7e66c'
  ctx.fillText('F', W / 2, H / 2)

  ctx.font = `600 13px ${FONT}`
  ctx.fillStyle = '#a8afa9'
  ctx.fillText('SCREEN TEST CARD', W / 2, H / 2 + 120)
}

/**
 * Draws the Flutter developer portfolio showcase UI onto the 3D phone canvas context.
 */
function drawTaskFlow(ctx, W, H) {
  const PAD = 16

  const bg = ctx.createLinearGradient(0, 0, W * 0.4, H)
  bg.addColorStop(0, '#181513')
  bg.addColorStop(1, '#0c0a09')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'

  ctx.fillStyle = '#f6f8f5'
  ctx.font = `700 13px ${FONT}`
  ctx.fillText('9:41', 30, 25)
  ctx.textAlign = 'right'
  ctx.fillText('● ● ▰', W - 28, 25)
  ctx.textAlign = 'left'

  ctx.font = `800 24px ${FONT}`
  ctx.fillStyle = '#f6f8f5'
  ctx.fillText('mrh', PAD + 2, 84)
  const brandWidth = ctx.measureText('mrh').width
  ctx.fillStyle = '#f16436'
  ctx.fillText('.rafi', PAD + 2 + brandWidth, 84)

  ctx.font = `500 12.5px ${FONT}`
  ctx.fillStyle = '#b8b0a8'
  ctx.fillText('Flutter App Developer', PAD + 2, 122)

  ctx.font = `800 26px ${FONT}`
  ctx.fillStyle = '#f6f8f5'
  ctx.fillText('Rafi 👋', PAD + 2, 150)

  ctx.font = `400 11.5px ${FONT}`
  ctx.fillStyle = '#a89f96'
  ctx.fillText('Building thoughtful mobile apps.', PAD + 2, 176)

  roundedRect(ctx, PAD, 196, W - PAD * 2, 40, 13)
  ctx.fillStyle = '#241e1b'
  ctx.fill()
  ctx.font = `500 11.5px ${FONT}`
  ctx.fillStyle = '#b5aba2'
  ctx.fillText('⌕   Flutter · Dart · C++ · DSA', PAD + 14, 216)

  let pillX = PAD
  ;['Projects', 'Flutter', 'DSA'].forEach((label, index) => {
    const active = index === 0
    ctx.font = `${active ? 800 : 500} 10.5px ${FONT}`
    const pillWidth = ctx.measureText(label).width + 22
    roundedRect(ctx, pillX, 252, pillWidth, 26, 13)
    ctx.fillStyle = active ? '#f16436' : '#241e1b'
    ctx.fill()
    ctx.fillStyle = active ? '#ffffff' : '#cfc7be'
    ctx.textAlign = 'center'
    ctx.fillText(label, pillX + pillWidth / 2, 265.5)
    ctx.textAlign = 'left'
    pillX += pillWidth + 7
  })

  const items = [
    { icon: '◷', bg: '#38221a', fg: '#ff8a61', title: 'Clocky Mobile App', meta: 'Clock · Alarm · Stopwatch' },
    { icon: '◈', bg: '#2f2419', fg: '#f6ad55', title: 'Expify Beta', meta: 'Flutter · Expense Tracker' },
    { icon: '⌘', bg: '#1e2c36', fg: '#7dd3fc', title: 'Flutter & Dart UI', meta: 'Clean Mobile Architecture' },
    { icon: '✳\uFE0E', bg: '#2c2233', fg: '#d8b4fe', title: 'C++ & DSA Foundations', meta: 'Problem Solving & Logic' },
  ]

  items.forEach((item, index) => {
    const top = 296 + index * 68

    roundedRect(ctx, PAD, top, W - PAD * 2, 58, 14)
    ctx.fillStyle = '#1d1816'
    ctx.fill()

    roundedRect(ctx, PAD + 10, top + 12.5, 33, 33, 10)
    ctx.fillStyle = item.bg
    ctx.fill()

    ctx.font = `600 16px ${FONT}`
    ctx.fillStyle = item.fg
    ctx.textAlign = 'center'
    ctx.fillText(item.icon, PAD + 10 + 16.5, top + 29.5)

    ctx.textAlign = 'left'
    ctx.font = `650 11.5px ${FONT}`
    ctx.fillStyle = '#f6f8f5'
    ctx.fillText(item.title, PAD + 54, top + 23)

    ctx.font = `400 9.5px ${FONT}`
    ctx.fillStyle = '#a89f96'
    ctx.fillText(item.meta, PAD + 54, top + 40)
  })

  ctx.strokeStyle = '#2e2622'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD, 578)
  ctx.lineTo(W - PAD, 578)
  ctx.stroke()

  const nav = [
    { icon: '⌂', label: 'Home' },
    { icon: '▦', label: 'Apps' },
    { icon: '▥', label: 'Skills' },
    { icon: '⚙\uFE0E', label: 'Contact' },
  ]
  const slot = (W - PAD * 2) / nav.length
  ctx.textAlign = 'center'
  nav.forEach((item, index) => {
    const x = PAD + slot * (index + 0.5)
    ctx.fillStyle = index === 0 ? '#f16436' : '#8f867d'
    ctx.font = `400 20px ${FONT}`
    ctx.fillText(item.icon, x, 600)
    ctx.font = `500 9px ${FONT}`
    ctx.fillText(item.label, x, 622)
  })

  roundedRect(ctx, W / 2 - 48, 638, 96, 4, 2)
  ctx.fillStyle = 'rgba(246,248,245,0.55)'
  ctx.fill()
}

/**
 * Creates and returns an off-screen canvas element populated with the screen texture.
 */
function createScreenCanvas() {
  const canvas = document.createElement('canvas')
  canvas.width = SCREEN_W
  canvas.height = SCREEN_H
  const ctx = canvas.getContext('2d')

  ctx.scale(DESIGN_SCALE, DESIGN_SCALE)

  ctx.translate(DESIGN_W, 0)
  ctx.scale(-1, 1)

  if (SCREEN_MODE === 'taskflow') {
    drawTaskFlow(ctx, DESIGN_W, DESIGN_H)
  } else {
    drawTestCard(ctx, DESIGN_W, DESIGN_H)
  }
  return canvas
}

/**
 * Generates custom geometry for the screen overlay.
 * Uses the original OLED mesh vertices but creates new UV maps.
 */
function buildScreenGeometry(mesh) {
  const source = mesh.geometry
  const position = source.attributes.position
  const count = position.count

  const points = new Float32Array(count * 3)
  const vertex = new THREE.Vector3()
  const min = new THREE.Vector3(Infinity, Infinity, Infinity)
  const max = new THREE.Vector3(-Infinity, -Infinity, -Infinity)

  for (let i = 0; i < count; i += 1) {
    vertex.fromBufferAttribute(position, i).applyMatrix4(mesh.matrixWorld)
    points[i * 3] = vertex.x
    points[i * 3 + 1] = vertex.y
    points[i * 3 + 2] = vertex.z
    min.min(vertex)
    max.max(vertex)
  }

  const width = max.x - min.x || 1
  const height = max.y - min.y || 1
  const uvs = new Float32Array(count * 2)

  for (let i = 0; i < count; i += 1) {
    let u = (max.x - points[i * 3]) / width
    let v = (max.y - points[i * 3 + 1]) / height
    if (SCREEN_FLIP_X) u = 1 - u
    if (SCREEN_FLIP_Y) v = 1 - v
    uvs[i * 2] = u
    uvs[i * 2 + 1] = v

    points[i * 3 + 2] -= SCREEN_Z_OFFSET
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(points, 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  if (source.index) geometry.setIndex(source.index.clone())

  return geometry
}

/**
 * 3D Phone component that handles loading, positioning, and animating the iPhone model.
 * Maps the 2D canvas texture to the 3D phone screen geometry.
 */
function PhoneModel({ reducedMotion, scrollProgress, onReady }) {
  const group = useRef(null)
  const dragging = useRef(false)
  const lastX = useRef(0)
  const angle = useRef(0)
  const introStart = useRef(null)

  const gl = useThree((state) => state.gl)
  const { scene } = useGLTF('/models/iphone.glb')

  const fitted = useMemo(() => {
    const model = scene.clone(true)
    model.updateMatrixWorld(true)

    const bounds = new THREE.Box3().setFromObject(model)
    const size = bounds.getSize(new THREE.Vector3())
    const center = bounds.getCenter(new THREE.Vector3())
    const maxDimension = Math.max(size.x, size.y, size.z) || 1
    const scale = 3.3 / maxDimension

    let screenMesh = null

    model.traverse((object) => {
      if (!object.isMesh) return

      if (object.material?.name === 'OLED') {
        screenMesh = object
      }

      if (object.material?.name === 'Glass') {
        object.material = object.material.clone()
        object.material.opacity = GLASS_OPACITY
        object.material.transparent = true
        object.material.depthWrite = false
      }
    })

    let overlay = null
    if (screenMesh) {
      overlay = new THREE.Mesh(
        buildScreenGeometry(screenMesh),
        new THREE.MeshBasicMaterial({
          color: '#000000',
          side: THREE.DoubleSide,
          toneMapped: false,
          polygonOffset: true,
          polygonOffsetFactor: -4,
          polygonOffsetUnits: -4,
        }),
      )
      screenMesh.visible = false
      model.add(overlay)
    }

    return {
      model,
      scale,
      overlay,
      position: [-center.x * scale, -center.y * scale, -center.z * scale],
    }
  }, [scene])

  useEffect(() => {
    const { overlay } = fitted

    if (!overlay) {
      console.warn('[IPhone3D] No mesh with material "OLED" found.')
      return undefined
    }

    if (import.meta.env.DEV) {
      overlay.geometry.computeBoundingBox()
      console.log(
        '[IPhone3D] screen overlay bounds (model units):',
        overlay.geometry.boundingBox.min.toArray(),
        overlay.geometry.boundingBox.max.toArray(),
      )
    }

    const material = overlay.material
    const texture = new THREE.CanvasTexture(createScreenCanvas())
    texture.colorSpace = THREE.SRGBColorSpace
    texture.flipY = false
    texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
    texture.needsUpdate = true

    material.map = texture
    material.color.setScalar(SCREEN_BRIGHTNESS)
    material.needsUpdate = true

    return () => {
      material.map = null
      material.needsUpdate = true
      texture.dispose()
    }
  }, [fitted, gl])

  useEffect(() => {
    return () => {
      fitted.overlay?.geometry.dispose()
      fitted.overlay?.material.dispose()
    }
  }, [fitted])

  useEffect(() => {
    onReady?.()
  }, [onReady])

  useEffect(() => {
    const element = gl.domElement
    element.style.cursor = 'grab'

    const handleDown = (event) => {
      dragging.current = true
      lastX.current = event.clientX
      element.style.cursor = 'grabbing'
      try {
        element.setPointerCapture(event.pointerId)
      } catch {
      }
    }

    const handleMove = (event) => {
      if (!dragging.current) return
      angle.current += (event.clientX - lastX.current) * 0.01
      lastX.current = event.clientX
    }

    const handleUp = (event) => {
      dragging.current = false
      element.style.cursor = 'grab'
      try {
        element.releasePointerCapture(event.pointerId)
      } catch {
      }
    }

    element.addEventListener('pointerdown', handleDown)
    element.addEventListener('pointermove', handleMove)
    element.addEventListener('pointerup', handleUp)
    element.addEventListener('pointercancel', handleUp)

    return () => {
      element.removeEventListener('pointerdown', handleDown)
      element.removeEventListener('pointermove', handleMove)
      element.removeEventListener('pointerup', handleUp)
      element.removeEventListener('pointercancel', handleUp)
      element.style.cursor = ''
    }
  }, [gl])

  useFrame((state, delta) => {
    if (!group.current) return

    if (introStart.current === null) {
      introStart.current = state.clock.elapsedTime
    }
    const t = reducedMotion
      ? 1
      : Math.min((state.clock.elapsedTime - introStart.current) / INTRO_SECONDS, 1)
    const eased = 1 - (1 - t) ** 3

    if (!dragging.current && !reducedMotion) {
      angle.current += delta * 0.35
    }

    const scrollTurn = scrollProgress ? scrollProgress.get() * 0.9 : 0

    group.current.rotation.y =
      Math.PI + angle.current - (1 - eased) * 1.1 + scrollTurn
    group.current.rotation.x = reducedMotion
      ? 0
      : Math.sin(state.clock.elapsedTime * 0.35) * 0.025
    group.current.scale.setScalar(0.9 + 0.1 * eased)
  })

  return (
    <Float
      speed={reducedMotion ? 0 : 1.2}
      floatIntensity={reducedMotion ? 0 : 0.12}
      rotationIntensity={0}
    >
      <group ref={group}>
        <primitive
          object={fitted.model}
          scale={fitted.scale}
          position={fitted.position}
        />
      </group>
    </Float>
  )
}

/**
 * Main 3D Canvas component that sets up the WebGL environment, lighting, and renders the PhoneModel.
 * Features an intersection observer to pause rendering when out of view for performance.
 */
export default function IPhone3D({
  reducedMotion = false,
  scrollProgress,
  onReady,
  onFail,
}) {
  const wrapRef = useRef(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const element = wrapRef.current
    if (!element || !('IntersectionObserver' in window)) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '120px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="iphone-3d-wrap" ref={wrapRef}>
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        dpr={[1, MAX_DPR]}
        camera={{ position: [0, 0, 6.5], fov: 34 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace
          gl.toneMapping = THREE.ACESFilmicToneMapping

          gl.domElement.addEventListener('webglcontextlost', (event) => {
            event.preventDefault()
            onFail?.()
          })
        }}
      >
        <ambientLight intensity={1.2} />
        <hemisphereLight args={['#ffffff', '#b8b1a7', 1.5]} />
        <directionalLight position={[4, 5, 5]} intensity={2.4} color="#fff8ef" />
        <directionalLight position={[-4, 1, -3]} intensity={1.8} color="#dce5ff" />

        <Suspense fallback={null}>
          <PhoneModel
            reducedMotion={reducedMotion}
            scrollProgress={scrollProgress}
            onReady={onReady}
          />
          <ContactShadows
            position={[0, -1.95, 0]}
            opacity={0.28}
            scale={4.5}
            blur={2.8}
            far={4}
          />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>

      <div className="rotation-hint">↔ &nbsp; 360° ROTATION</div>
    </div>
  )
}

useGLTF.preload('/models/iphone.glb')
