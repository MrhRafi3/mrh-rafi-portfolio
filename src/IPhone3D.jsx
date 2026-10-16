import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Default screenshot displayed on the Hero 3D iPhone screen.
 * You can change this path anytime (or pass `screenImageSrc` from `App.jsx`).
 */
export const DEFAULT_HERO_SCREEN_IMAGE = '/images/hero-1.png'

const GLASS_OPACITY = 0.08
const SCREEN_BRIGHTNESS = 1
const MAX_DPR =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(pointer: coarse)').matches
    ? 1.25
    : 1.75
const INTRO_SECONDS = 1.65
const SCREEN_Z_OFFSET = 0.00012

// Matches the exact 0.0668 x 0.1449 aspect ratio (0.461) of the GLB's OLED mesh at 1080p crispness.
const SCREEN_W = 1080
const SCREEN_H = 2342
const DESIGN_W = 300
const DESIGN_SCALE = SCREEN_W / DESIGN_W
const DESIGN_H = SCREEN_H / DESIGN_SCALE
const FONT = '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif'

// In-memory image cache so switching or mounting screenshots is instantaneous.
const imageCache = new Map()

/**
 * Loads an image from a URL and caches the decoded HTMLImageElement.
 *
 * @param {string} src - Image URL path.
 * @returns {Promise<HTMLImageElement>} Decoded image element.
 */
function loadImageCached(src) {
  if (!src) return Promise.reject(new Error('No image source provided'))
  if (imageCache.has(src)) {
    return imageCache.get(src)
  }

  const promise = new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = (err) => {
      imageCache.delete(src)
      reject(err)
    }
    img.src = src
  })

  imageCache.set(src, promise)
  return promise
}

// Preload default hero poster and both real app screenshots immediately when the module is imported.
if (typeof window !== 'undefined') {
  loadImageCached('/images/hero-1.png').catch(() => {})
  loadImageCached('/images/expify/screen-1.png').catch(() => {})
  loadImageCached('/images/clocky/screen-1.png').catch(() => {})
}

/**
 * Draws a rectangle with rounded corners on a 2D canvas context.
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
 * Draws an image onto the canvas for the 3D OLED screen.
 * - For native 19.5:9 mobile screenshots (Expify Beta, Clocky), uses standard aspect-ratio cover math.
 * - For wider 9:16 portrait posters (like `hero-1.png`), preserves the full horizontal width so side
 *   typography, floating badges, books, and signatures are never clipped, while seamlessly extending
 *   the top studio sky behind the Dynamic Island and finishing the bottom edge with a native iOS bar.
 */
function drawImageCover(ctx, img, targetW, targetH) {
  const imgW = img.naturalWidth || img.width || targetW
  const imgH = img.naturalHeight || img.height || targetH
  const imgAspect = imgW / imgH
  const screenAspect = targetW / targetH

  ctx.save()
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  if (imgAspect > screenAspect * 1.08) {
    // 9:16 poster framing (e.g., /images/hero-1.png: 941x1672 -> 1080x2342 OLED)
    const cropX = imgW * 0.0085
    const srcW = imgW - cropX * 2
    const topSkySrcH = Math.max(8, imgH * 0.024)
    const bottomEdgeSrcY = imgH * 0.992
    const bottomEdgeSrcH = Math.max(4, imgH - bottomEdgeSrcY)

    const topBandH = Math.round(targetH * 0.062)
    const bottomBandY = Math.round(targetH * 0.948)
    const bottomBandH = targetH - bottomBandY

    // 1. Extend bottom edge strip seamlessly to the bottom bezel
    ctx.drawImage(
      img,
      cropX,
      bottomEdgeSrcY,
      srcW,
      bottomEdgeSrcH,
      0,
      bottomBandY - 6,
      targetW,
      bottomBandH + 6,
    )

    // 2. Extend top studio sky seamlessly behind the status bar & Dynamic Island
    ctx.drawImage(
      img,
      cropX,
      0,
      srcW,
      topSkySrcH,
      0,
      0,
      targetW,
      topBandH + 6,
    )

    // 3. Draw main poster body edge-to-edge without clipping side text or badges
    const mainSrcY = topSkySrcH * 0.85
    const mainSrcH = bottomEdgeSrcY - mainSrcY
    ctx.drawImage(
      img,
      cropX,
      mainSrcY,
      srcW,
      mainSrcH,
      0,
      topBandH,
      targetW,
      bottomBandY - topBandH,
    )

    // 4. Native iOS status bar in the top studio sky zone flanking the Dynamic Island
    ctx.fillStyle = '#1e293b'
    ctx.font = `700 34px ${FONT}`
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'left'
    ctx.fillText('9:41', 88, 76)

    const rightBaseX = targetW - 88
    roundedRect(ctx, rightBaseX - 58, 61, 50, 28, 8)
    ctx.lineWidth = 3
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.5)'
    ctx.stroke()

    roundedRect(ctx, rightBaseX - 5, 69, 4, 12, 2)
    ctx.fillStyle = 'rgba(30, 41, 59, 0.5)'
    ctx.fill()

    roundedRect(ctx, rightBaseX - 53, 66, 40, 18, 5)
    ctx.fillStyle = '#1e293b'
    ctx.fill()

    const barHeights = [10, 15, 20, 25]
    barHeights.forEach((bh, idx) => {
      const bx = rightBaseX - 118 + idx * 11
      const by = 86 - bh
      roundedRect(ctx, bx, by, 7, bh, 2.5)
      ctx.fillStyle = '#1e293b'
      ctx.fill()
    })

    // 5. Smooth bottom vignette + iOS Home Indicator pill
    const bottomGrad = ctx.createLinearGradient(0, bottomBandY - 28, 0, targetH)
    bottomGrad.addColorStop(0, 'rgba(12, 18, 32, 0)')
    bottomGrad.addColorStop(0.55, 'rgba(12, 18, 32, 0.42)')
    bottomGrad.addColorStop(1, 'rgba(10, 15, 28, 0.78)')
    ctx.fillStyle = bottomGrad
    ctx.fillRect(0, bottomBandY - 28, targetW, targetH - (bottomBandY - 28))

    const homeW = targetW * 0.34
    const homeH = 11
    const homeX = (targetW - homeW) * 0.5
    const homeY = targetH - 36
    roundedRect(ctx, homeX, homeY, homeW, homeH, homeH * 0.5)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.68)'
    ctx.fill()
  } else {
    const scale = Math.max(targetW / imgW, targetH / imgH)
    const drawW = imgW * scale
    const drawH = imgH * scale
    const offsetX = (targetW - drawW) * 0.5
    const offsetY = (targetH - drawH) * 0.5
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH)
  }

  // Subtle Dynamic Island pill aligned with the GLB's top cutout for realism
  const islandW = targetW * 0.25
  const islandH = targetH * 0.031
  const islandX = (targetW - islandW) * 0.5
  const islandY = targetH * 0.017
  roundedRect(ctx, islandX, islandY, islandW, islandH, islandH * 0.5)
  ctx.fillStyle = '#050506'
  ctx.fill()
  ctx.restore()
}

/**
 * Fallback procedural UI drawn only if no screenshot image is available.
 */
function drawFallbackPortfolioUI(ctx, W, H) {
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
  ctx.fillStyle = '#E3C27C'
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

  const items = [
    { icon: '◷', bg: '#38221a', fg: '#ff8a61', title: 'Clocky Mobile App', meta: 'Clock · Alarm · Stopwatch' },
    { icon: '◈', bg: '#2f2419', fg: '#f6ad55', title: 'Expify Beta', meta: 'Flutter · Expense Tracker' },
    { icon: '⌘', bg: '#1e2c36', fg: '#7dd3fc', title: 'Flutter & Dart UI', meta: 'Clean Mobile Architecture' },
    { icon: '✳\uFE0E', bg: '#2c2233', fg: '#d8b4fe', title: 'C++ & DSA Foundations', meta: 'Problem Solving & Logic' },
  ]

  items.forEach((item, index) => {
    const top = 264 + index * 68

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
}

/**
 * Creates an off-screen canvas populated with either the loaded screenshot image
 * or the fallback portfolio UI.
 *
 * @param {HTMLImageElement|null} loadedImage - Optional loaded screenshot image.
 * @returns {HTMLCanvasElement} Populated canvas ready for THREE.CanvasTexture.
 */
function createScreenCanvas(loadedImage = null) {
  const canvas = document.createElement('canvas')
  canvas.width = SCREEN_W
  canvas.height = SCREEN_H
  const ctx = canvas.getContext('2d')

  if (loadedImage) {
    drawImageCover(ctx, loadedImage, SCREEN_W, SCREEN_H)
  } else {
    ctx.save()
    ctx.scale(DESIGN_SCALE, DESIGN_SCALE)
    drawFallbackPortfolioUI(ctx, DESIGN_W, DESIGN_H)
    ctx.restore()
  }

  return canvas
}

/**
 * Generates custom geometry for the screen overlay from the GLB's OLED mesh.
 * Maps model-space vertices directly to normalized (0..1) UVs so the screen
 * stays 100% locked to the phone body at every rotation angle.
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

  // When the model rotates 180deg around Y to face the camera:
  // +X in model space is the left edge of the screen (u = 0)
  // -X in model space is the right edge of the screen (u = 1)
  // +Y in model space is the top edge of the screen (v = 0 with flipY = false)
  // -Y in model space is the bottom edge of the screen (v = 1 with flipY = false)
  for (let i = 0; i < count; i += 1) {
    const u = (max.x - points[i * 3]) / width
    const v = (max.y - points[i * 3 + 1]) / height
    uvs[i * 2] = u
    uvs[i * 2 + 1] = v

    points[i * 3 + 2] -= SCREEN_Z_OFFSET
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(points, 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  if (source.index) geometry.setIndex(source.index.clone())
  geometry.computeVertexNormals()

  return geometry
}

/**
 * 3D Phone component that handles loading, positioning, and animating the iPhone model.
 * Synchronizes the screenshot texture on the OLED mesh and executes frame-rate-independent
 * damped rotations from initial load through scroll and pointer drag.
 */
function PhoneModel({
  reducedMotion,
  scrollProgress,
  screenImageSrc,
  pageReady,
  containerRef,
  onReady,
}) {
  const group = useRef(null)
  const dragging = useRef(false)
  const isPointerDown = useRef(false)
  const hasCaptured = useRef(false)
  const startX = useRef(0)
  const startY = useRef(0)
  const lastX = useRef(0)
  const lastTime = useRef(0)
  const dragVelocity = useRef(0)
  const lastInteractionTime = useRef(0)
  const targetAngle = useRef(0)
  const currentAngle = useRef(0)
  const currentScrollTurn = useRef(0)
  const hoverTiltX = useRef(0)
  const hoverTiltY = useRef(0)
  const currentHoverX = useRef(0)
  const currentHoverY = useRef(0)
  const introStart = useRef(null)
  const readySignaled = useRef(false)
  const [textureLoaded, setTextureLoaded] = useState(false)

  const gl = useThree((state) => state.gl)
  const { scene } = useGLTF('/models/iphone.glb')

  const fitted = useMemo(() => {
    const model = scene.clone(true)
    model.updateMatrixWorld(true)

    const bounds = new THREE.Box3().setFromObject(model)
    const size = bounds.getSize(new THREE.Vector3())
    const center = bounds.getCenter(new THREE.Vector3())
    const maxDimension = Math.max(size.x, size.y, size.z) || 1
    const scale = 3.35 / maxDimension

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
          color: '#ffffff',
          side: THREE.DoubleSide,
          toneMapped: false,
          polygonOffset: true,
          polygonOffsetFactor: -4,
          polygonOffsetUnits: -4,
        }),
      )
      overlay.frustumCulled = false
      screenMesh.visible = false
      model.add(overlay)
    }

    return {
      model,
      scale,
      overlay,
      position: [-center.x * scale, -center.y * scale - 0.12, -center.z * scale],
    }
  }, [scene])

  useEffect(() => {
    const { overlay } = fitted
    if (!overlay) return undefined

    let cancelled = false
    let activeTexture = null

    const applyCanvasToMaterial = (canvas) => {
      if (cancelled) return
      const nextTexture = new THREE.CanvasTexture(canvas)
      nextTexture.colorSpace = THREE.SRGBColorSpace
      nextTexture.flipY = false
      nextTexture.generateMipmaps = true
      nextTexture.minFilter = THREE.LinearMipmapLinearFilter
      nextTexture.magFilter = THREE.LinearFilter
      nextTexture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
      nextTexture.needsUpdate = true

      // Pre-upload texture to GPU immediately to avoid first-frame stutter
      gl.initTexture?.(nextTexture)

      const material = overlay.material
      const previousMap = material.map
      material.map = nextTexture
      material.color.setScalar(SCREEN_BRIGHTNESS)
      material.needsUpdate = true

      if (previousMap && previousMap !== nextTexture) {
        previousMap.dispose()
      }
      activeTexture = nextTexture
      setTextureLoaded(true)

      if (!readySignaled.current) {
        readySignaled.current = true
        onReady?.()
      }
    }

    const srcToLoad = screenImageSrc || DEFAULT_HERO_SCREEN_IMAGE
    loadImageCached(srcToLoad)
      .then((img) => {
        applyCanvasToMaterial(createScreenCanvas(img))
      })
      .catch(() => {
        applyCanvasToMaterial(createScreenCanvas(null))
      })

    return () => {
      cancelled = true
      if (activeTexture) {
        activeTexture.dispose()
      }
    }
  }, [fitted, gl, screenImageSrc, onReady])

  useEffect(() => {
    return () => {
      fitted.overlay?.geometry.dispose()
      fitted.overlay?.material.dispose()
    }
  }, [fitted])

  useEffect(() => {
    const element = containerRef?.current
    if (!element) return undefined

    const handleDown = (event) => {
      isPointerDown.current = true
      hasCaptured.current = false
      startX.current = event.clientX
      startY.current = event.clientY
      lastX.current = event.clientX
      lastTime.current = performance.now()
      dragVelocity.current = 0
      lastInteractionTime.current = performance.now()
    }

    const handleMove = (event) => {
      if (!isPointerDown.current) {
        if (!reducedMotion && event.pointerType === 'mouse') {
          const bounds = element.getBoundingClientRect()
          if (bounds.width > 0 && bounds.height > 0) {
            const nx = (event.clientX - bounds.left) / bounds.width - 0.5
            const ny = (event.clientY - bounds.top) / bounds.height - 0.5
            hoverTiltX.current = ny * 0.14
            hoverTiltY.current = nx * 0.22
          }
        }
        return
      }

      const dx = event.clientX - startX.current
      const dy = event.clientY - startY.current

      // For touch events: disambiguate vertical scroll vs horizontal rotation
      if (event.pointerType === 'touch') {
        if (!hasCaptured.current) {
          if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 7) {
            // User intends to scroll vertically; cancel our drag
            isPointerDown.current = false
            dragging.current = false
            return
          }
          if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 6) {
            // User intends to rotate horizontally; claim gesture
            hasCaptured.current = true
            dragging.current = true
            try {
              element.setPointerCapture(event.pointerId)
            } catch {}
          }
        }
      } else {
        // Mouse drag
        if (!dragging.current && (Math.abs(dx) > 2 || Math.abs(dy) > 2)) {
          dragging.current = true
          try {
            element.setPointerCapture(event.pointerId)
          } catch {}
        }
      }

      if (dragging.current) {
        if (event.cancelable) {
          event.preventDefault()
        }
        const now = performance.now()
        const dtSec = Math.max((now - lastTime.current) / 1000, 0.006)
        const stepX = event.clientX - lastX.current
        targetAngle.current += stepX * 0.009
        dragVelocity.current = (stepX * 0.009) / dtSec
        lastX.current = event.clientX
        lastTime.current = now
        lastInteractionTime.current = now
      }
    }

    const handleUp = (event) => {
      if (dragging.current) {
        try {
          element.releasePointerCapture(event.pointerId)
        } catch {}
        dragging.current = false
        // Clamp release velocity
        dragVelocity.current = Math.max(-6, Math.min(6, dragVelocity.current))
      }
      isPointerDown.current = false
      hasCaptured.current = false
      lastInteractionTime.current = performance.now()
    }

    const handleLeave = () => {
      hoverTiltX.current = 0
      hoverTiltY.current = 0
    }

    element.addEventListener('pointerdown', handleDown, { passive: true })
    window.addEventListener('pointermove', handleMove, { passive: false })
    window.addEventListener('pointerup', handleUp, { passive: true })
    window.addEventListener('pointercancel', handleUp, { passive: true })
    element.addEventListener('pointerleave', handleLeave, { passive: true })

    return () => {
      element.removeEventListener('pointerdown', handleDown)
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('pointercancel', handleUp)
      element.removeEventListener('pointerleave', handleLeave)
    }
  }, [containerRef, reducedMotion])

  useFrame((state, delta) => {
    if (!group.current || !textureLoaded) return

    // Performance culling: pause 3D math and renders when Hero is scrolled beyond view
    if (scrollProgress && scrollProgress.get() > 0.26) return

    // Clamp delta so tab switches or initial shader compiles never cause rotation jumps
    const dt = Math.min(delta, 0.05)

    // Start the entrance spin only once the page intro curtain has finished lifting
    if (introStart.current === null && pageReady) {
      introStart.current = state.clock.elapsedTime
    }

    const elapsedSinceIntro =
      introStart.current !== null
        ? state.clock.elapsedTime - introStart.current
        : 0

    const t = reducedMotion
      ? 1
      : introStart.current === null
        ? 0
        : Math.min(elapsedSinceIntro / INTRO_SECONDS, 1)

    // Smooth quartic ease-out for the entrance spin and scale reveal
    const eased = 1 - (1 - t) ** 4

    if (dragging.current) {
      currentAngle.current = THREE.MathUtils.damp(
        currentAngle.current,
        targetAngle.current,
        22,
        dt,
      )
    } else {
      if (Math.abs(dragVelocity.current) > 0.002) {
        // Smooth inertia
        targetAngle.current += dragVelocity.current * dt
        dragVelocity.current *= Math.pow(0.92, dt * 60)
      } else {
        dragVelocity.current = 0
        const timeSince = (performance.now() - lastInteractionTime.current) / 1000
        // Gently resume auto-rotation after 2.5s idle
        if (!reducedMotion && introStart.current !== null && timeSince > 2.5) {
          const ramp = Math.min((timeSince - 2.5) / 1.5, 1)
          targetAngle.current += dt * 0.28 * ramp
        }
      }

      currentAngle.current = THREE.MathUtils.damp(
        currentAngle.current,
        targetAngle.current,
        10,
        dt,
      )
    }

    const rawScrollTurn = scrollProgress ? scrollProgress.get() * 0.85 : 0
    currentScrollTurn.current = THREE.MathUtils.damp(
      currentScrollTurn.current,
      rawScrollTurn,
      8,
      dt,
    )

    currentHoverX.current = THREE.MathUtils.damp(
      currentHoverX.current,
      hoverTiltX.current,
      6,
      dt,
    )
    currentHoverY.current = THREE.MathUtils.damp(
      currentHoverY.current,
      hoverTiltY.current,
      6,
      dt,
    )

    const floatTime = state.clock.elapsedTime
    const floatY = reducedMotion ? 0 : Math.sin(floatTime * 1.15) * 0.055
    const floatPitch = reducedMotion ? 0 : Math.sin(floatTime * 0.65) * 0.022

    group.current.position.y = floatY
    group.current.rotation.y =
      Math.PI +
      currentAngle.current +
      currentHoverY.current -
      (1 - eased) * 1.15 +
      currentScrollTurn.current
    group.current.rotation.x = floatPitch + currentHoverX.current
    group.current.scale.setScalar(0.88 + 0.12 * eased)
  })

  return (
    <group ref={group}>
      <primitive
        object={fitted.model}
        scale={fitted.scale}
        position={fitted.position}
      />
    </group>
  )
}

/**
 * Main 3D Canvas component that sets up the WebGL environment, lighting, and renders the PhoneModel.
 * Features an intersection observer to pause rendering when out of view for performance.
 */
export default function IPhone3D({
  reducedMotion = false,
  scrollProgress,
  screenImageSrc = DEFAULT_HERO_SCREEN_IMAGE,
  pageReady = true,
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
      { rootMargin: '160px' },
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
        <ambientLight intensity={1.25} />
        <hemisphereLight args={['#ffffff', '#b8b1a7', 1.5]} />
        <directionalLight position={[4, 5, 5]} intensity={2.4} color="#fff8ef" />
        <directionalLight position={[-4, 1, -3]} intensity={1.8} color="#dce5ff" />

        <Suspense fallback={null}>
          <PhoneModel
            reducedMotion={reducedMotion}
            scrollProgress={scrollProgress}
            screenImageSrc={screenImageSrc}
            pageReady={pageReady}
            containerRef={wrapRef}
            onReady={onReady}
          />
          <ContactShadows
            position={[0, -2.05, 0]}
            opacity={0.34}
            scale={4.6}
            blur={2.8}
            far={4}
            frames={1}
          />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>

      <div className="rotation-hint">↔ &nbsp; DRAG TO ROTATE 360°</div>
    </div>
  )
}

useGLTF.preload('/models/iphone.glb')
