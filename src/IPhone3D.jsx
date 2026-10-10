import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Float, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

/* ------------------------------------------------------------------ */
/*  SETTINGS YOU MAY WANT TO CHANGE                                    */
/* ------------------------------------------------------------------ */

// 'test'     -> shows a colourful test card (use this first to check orientation)
// 'taskflow' -> shows the TaskFlow demo app UI
const SCREEN_MODE = 'taskflow'

// If the test card looks mirrored, flip these. (Only change if needed.)
const SCREEN_FLIP_X = true // Ager motoi true thakbe, model e kono affect porbe na
const SCREEN_FLIP_Y = false

// The GLB's front glass is a black layer with ~78% opacity, which makes any
// screen look very dark. This lowers it. 0 = fully clear, 1 = original darkness.
const GLASS_OPACITY = 0.12

// Screen brightness (1 = normal).
const SCREEN_BRIGHTNESS = 1

// Slightly lower pixel ratio on touch devices keeps phones cool and smooth.
const MAX_DPR =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(pointer: coarse)').matches
    ? 1.25
    : 1.5

// How long the phone takes to turn in and grow when it first appears.
const INTRO_SECONDS = 1.8

// How far the screen picture sits in front of the original OLED surface
// (in the GLB's own units). Tiny, only to avoid flickering overlap.
const SCREEN_Z_OFFSET = 0.0001

/* ------------------------------------------------------------------ */
/*  SCREEN TEXTURE (drawn with canvas, then used as a real GPU texture) */
/* ------------------------------------------------------------------ */

// The OLED plane in the GLB is 0.0668 x 0.1449 units -> aspect ratio 0.461.
// The canvas uses the same ratio so the picture is not stretched.
const SCREEN_W = 640
const SCREEN_H = 1388

// We design in a 300-wide "CSS-like" space and scale it up to the canvas.
const DESIGN_W = 300
const DESIGN_SCALE = SCREEN_W / DESIGN_W
const DESIGN_H = SCREEN_H / DESIGN_SCALE // about 650

const FONT = '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif'

// Rounded rectangle path (works in every browser, no ctx.roundRect needed).
function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

// Test card: asymmetric on purpose, so we can see mirroring / rotation.
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

  // Coloured corners: TL red, TR green, BL blue, BR yellow
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

  // Big "F": if it looks backwards or sideways, the texture is flipped/rotated.
  ctx.textAlign = 'center'
  ctx.font = `800 190px ${FONT}`
  ctx.fillStyle = '#b7e66c'
  ctx.fillText('F', W / 2, H / 2)

  ctx.font = `600 13px ${FONT}`
  ctx.fillStyle = '#a8afa9'
  ctx.fillText('SCREEN TEST CARD', W / 2, H / 2 + 120)
}

// The TaskFlow demo UI (this is a DEMO, not a published app).
function drawTaskFlow(ctx, W, H) {
  const PAD = 16

  const bg = ctx.createLinearGradient(0, 0, W * 0.4, H)
  bg.addColorStop(0, '#121713')
  bg.addColorStop(1, '#080a09')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'

  // Status bar: time on the left, icons on the right.
  // The middle is left empty because the Dynamic Island sits there.
  ctx.fillStyle = '#f6f8f5'
  ctx.font = `700 13px ${FONT}`
  ctx.fillText('9:41', 30, 25)
  ctx.textAlign = 'right'
  ctx.fillText('● ● ▰', W - 28, 25)
  ctx.textAlign = 'left'

  // Brand
  ctx.font = `800 26px ${FONT}`
  ctx.fillStyle = '#f6f8f5'
  ctx.fillText('Task', PAD + 2, 84)
  const taskWidth = ctx.measureText('Task').width
  ctx.fillStyle = '#b7e66c'
  ctx.fillText('Flow', PAD + 2 + taskWidth, 84)

  // Greeting
  ctx.font = `400 13px ${FONT}`
  ctx.fillStyle = '#a8afa9'
  ctx.fillText('Good morning,', PAD + 2, 122)

  ctx.font = `800 27px ${FONT}`
  ctx.fillStyle = '#f6f8f5'
  ctx.fillText('Rafi 👋', PAD + 2, 150)

  ctx.font = `400 11.5px ${FONT}`
  ctx.fillStyle = '#9ca69e'
  ctx.fillText('Let’s make today productive!', PAD + 2, 176)

  // Search field
  roundedRect(ctx, PAD, 196, W - PAD * 2, 40, 13)
  ctx.fillStyle = '#202722'
  ctx.fill()
  ctx.font = `400 12px ${FONT}`
  ctx.fillStyle = '#a7b0a7'
  ctx.fillText('⌕   Search tasks...', PAD + 14, 216)

  // Filter pills
  let pillX = PAD
  ;['All', 'Today', 'Upcoming'].forEach((label, index) => {
    const active = index === 0
    ctx.font = `${active ? 800 : 500} 10.5px ${FONT}`
    const pillWidth = ctx.measureText(label).width + 22
    roundedRect(ctx, pillX, 252, pillWidth, 26, 13)
    ctx.fillStyle = active ? '#b7e66c' : '#202622'
    ctx.fill()
    ctx.fillStyle = active ? '#10150c' : '#c2c9c2'
    ctx.textAlign = 'center'
    ctx.fillText(label, pillX + pillWidth / 2, 265.5)
    ctx.textAlign = 'left'
    pillX += pillWidth + 7
  })

  // Task cards
  const tasks = [
    { icon: '✓', bg: '#293b24', fg: '#c1f27c', title: 'Design home screen', meta: 'Design · 10:00 AM' },
    { icon: '⌘', bg: '#20363a', fg: '#80d6e8', title: 'Develop API integration', meta: 'Development · 2:00 PM' },
    { icon: '✳\uFE0E', bg: '#3b2734', fg: '#f3a7ca', title: 'Test and fix bugs', meta: 'Testing · 4:00 PM' },
    { icon: '▤', bg: '#40361f', fg: '#f3cf70', title: 'Prepare presentation', meta: 'Work · 6:00 PM' },
  ]

  tasks.forEach((task, index) => {
    const top = 296 + index * 68

    roundedRect(ctx, PAD, top, W - PAD * 2, 58, 14)
    ctx.fillStyle = '#171d19'
    ctx.fill()

    roundedRect(ctx, PAD + 10, top + 12.5, 33, 33, 10)
    ctx.fillStyle = task.bg
    ctx.fill()

    ctx.font = `600 16px ${FONT}`
    ctx.fillStyle = task.fg
    ctx.textAlign = 'center'
    ctx.fillText(task.icon, PAD + 10 + 16.5, top + 29.5)

    ctx.textAlign = 'left'
    ctx.font = `650 11.5px ${FONT}`
    ctx.fillStyle = '#f6f8f5'
    ctx.fillText(task.title, PAD + 54, top + 23)

    ctx.font = `400 9.5px ${FONT}`
    ctx.fillStyle = '#9ba59c'
    ctx.fillText(task.meta, PAD + 54, top + 40)
  })

  // Bottom navigation
  ctx.strokeStyle = '#283029'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD, 578)
  ctx.lineTo(W - PAD, 578)
  ctx.stroke()

  const nav = [
    { icon: '⌂', label: 'Home' },
    { icon: '▦', label: 'Calendar' },
    { icon: '▥', label: 'Stats' },
    { icon: '⚙\uFE0E', label: 'Settings' },
  ]
  const slot = (W - PAD * 2) / nav.length
  ctx.textAlign = 'center'
  nav.forEach((item, index) => {
    const x = PAD + slot * (index + 0.5)
    ctx.fillStyle = index === 0 ? '#b7e66c' : '#8a948b'
    ctx.font = `400 20px ${FONT}`
    ctx.fillText(item.icon, x, 600)
    ctx.font = `500 9px ${FONT}`
    ctx.fillText(item.label, x, 622)
  })

  // Home indicator
  roundedRect(ctx, W / 2 - 48, 638, 96, 4, 2)
  ctx.fillStyle = 'rgba(246,248,245,0.55)'
  ctx.fill()
}

function createScreenCanvas() {
  const canvas = document.createElement('canvas')
  canvas.width = SCREEN_W
  canvas.height = SCREEN_H
  const ctx = canvas.getContext('2d')

  ctx.scale(DESIGN_SCALE, DESIGN_SCALE)

  /* --- FIX APPLIED HERE --- */
  // 3D Geometry change na kore direct 2D canvas drawing ke horizontally mirror kora hocche
  ctx.translate(DESIGN_W, 0)
  ctx.scale(-1, 1)
  /* ------------------------ */

  if (SCREEN_MODE === 'taskflow') {
    drawTaskFlow(ctx, DESIGN_W, DESIGN_H)
  } else {
    drawTestCard(ctx, DESIGN_W, DESIGN_H)
  }
  return canvas
}

/* ------------------------------------------------------------------ */
/*  SCREEN GEOMETRY                                                    */
/* ------------------------------------------------------------------ */

// Copies the shape of the OLED mesh (rounded corners + Dynamic Island hole)
// and makes brand new UVs from the vertex positions, so we do not depend on
// the model's own UV map.
function buildScreenGeometry(mesh) {
  const source = mesh.geometry
  const position = source.attributes.position
  const count = position.count

  const points = new Float32Array(count * 3)
  const vertex = new THREE.Vector3()
  const min = new THREE.Vector3(Infinity, Infinity, Infinity)
  const max = new THREE.Vector3(-Infinity, -Infinity, -Infinity)

  for (let i = 0; i < count; i += 1) {
    // Move every vertex into the model's own space (mesh.matrixWorld).
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
    // The display faces -Z, so looking at it the model's +X is on the LEFT.
    // That is why u counts from max.x down to min.x.
    let u = (max.x - points[i * 3]) / width
    let v = (max.y - points[i * 3 + 1]) / height // v = 0 is the top of the screen
    if (SCREEN_FLIP_X) u = 1 - u
    if (SCREEN_FLIP_Y) v = 1 - v
    uvs[i * 2] = u
    uvs[i * 2 + 1] = v

    // Push the picture a tiny bit towards the viewer (-Z side).
    points[i * 3 + 2] -= SCREEN_Z_OFFSET
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(points, 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  if (source.index) geometry.setIndex(source.index.clone())

  return geometry
}

/* ------------------------------------------------------------------ */
/*  3D PHONE                                                           */
/* ------------------------------------------------------------------ */

// Facts measured from public/models/iphone.glb:
//  - size is about 0.073 x 0.150 x 0.013 (width x height x thickness)
//  - the camera bump is on +Z, the display is on -Z (so the model starts
//    facing away from us, which is why a 180deg Y rotation is needed)
//  - the display is a separate mesh with a material called "OLED"
//  - the front glass is a separate material called "Glass"
function PhoneModel({ reducedMotion, scrollProgress, onReady }) {
  const group = useRef(null)
  const dragging = useRef(false)
  const lastX = useRef(0)
  const angle = useRef(0) // rotation lives in a ref, so no React re-render per frame
  const introStart = useRef(null)

  const gl = useThree((state) => state.gl)
  const { scene } = useGLTF('/models/iphone.glb')

  // Clone the model, centre it, scale it, and build the screen overlay.
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

      // Clone only the glass material we change, so the cached GLB stays clean.
      if (object.material?.name === 'Glass') {
        object.material = object.material.clone()
        object.material.opacity = GLASS_OPACITY
        object.material.transparent = true
        object.material.depthWrite = false
      }
    })

    // Our own screen surface: same shape as the OLED mesh, our own UVs.
    let overlay = null
    if (screenMesh) {
      overlay = new THREE.Mesh(
        buildScreenGeometry(screenMesh),
        new THREE.MeshBasicMaterial({
          color: '#000000', // becomes white once the texture is ready
          side: THREE.DoubleSide,
          toneMapped: false, // keeps the app colours accurate
          polygonOffset: true,
          polygonOffsetFactor: -4,
          polygonOffsetUnits: -4,
        }),
      )
      screenMesh.visible = false // hide the original OLED so they never fight
      model.add(overlay)
    }

    return {
      model,
      scale,
      overlay,
      position: [-center.x * scale, -center.y * scale, -center.z * scale],
    }
  }, [scene])

  // Put the canvas picture onto the screen overlay.
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
    texture.flipY = false // v = 0 is the top of the screen in our UVs
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

  // Free the overlay's GPU memory when the component goes away.
  useEffect(() => {
    return () => {
      fitted.overlay?.geometry.dispose()
      fitted.overlay?.material.dispose()
    }
  }, [fitted])

  // Tell the page the 3D model is on screen, so it can fade the static phone out.
  useEffect(() => {
    onReady?.()
  }, [onReady])

  // Drag to rotate. Listeners are on the canvas itself so dragging works
  // anywhere on the phone area and also on touch screens.
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
        // Pointer capture is optional, so it is safe to ignore.
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
        // Nothing was captured, so nothing to release.
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

  // Runs every frame. It only edits refs / three.js objects, never React state.
  useFrame((state, delta) => {
    if (!group.current) return

    // Intro: the phone turns in from the side while growing to full size.
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

    // Scrolling the hero away turns the phone a little (read from a motion value).
    const scrollTurn = scrollProgress ? scrollProgress.get() * 0.9 : 0

    // Math.PI turns the display (which faces -Z in the GLB) towards the camera.
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

export default function IPhone3D({
  reducedMotion = false,
  scrollProgress,
  onReady,
  onFail,
}) {
  const wrapRef = useRef(null)
  const [inView, setInView] = useState(true)

  // Stop rendering while the phone is scrolled out of view (saves battery / GPU).
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

          // If the GPU drops the WebGL context, show the static phone instead.
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
