import { Component, memo, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * 7 Destination Realms along the 3D Dimensional Conduit.
 * Defines Z-coordinates, lighting, fog, and theme-adaptive palettes.
 */
const REALM_CONFIGS = [
  {
    id: 'home',
    z: 10,
    dark: {
      bg: '#090A0D',
      fog: '#15171D',
      accent: '#FF7138',
      secondary: '#FF3548',
      ambientIntensity: 0.90,
    },
    light: {
      bg: '#F8F9FA',
      fog: '#EDF0F3',
      accent: '#FF7138',
      secondary: '#E0561F',
      ambientIntensity: 1.1,
    },
  },
  {
    id: 'clocky',
    z: -20,
    dark: {
      bg: '#040814',
      fog: '#060c1c',
      accent: '#38bdf8',
      secondary: '#0284c7',
      ambientIntensity: 0.9,
    },
    light: {
      bg: '#f0f5fc',
      fog: '#e4edf8',
      accent: '#0284c7',
      secondary: '#0369a1',
      ambientIntensity: 1.15,
    },
  },
  {
    id: 'expify',
    z: -50,
    dark: {
      bg: '#020e08',
      fog: '#04160c',
      accent: '#10b981',
      secondary: '#059669',
      ambientIntensity: 0.9,
    },
    light: {
      bg: '#f0faf4',
      fog: '#e2f4e8',
      accent: '#059669',
      secondary: '#047857',
      ambientIntensity: 1.15,
    },
  },
  {
    id: 'nomnom',
    z: -80,
    dark: {
      bg: '#140803',
      fog: '#1a0c05',
      accent: '#f97316',
      secondary: '#ea580c',
      ambientIntensity: 0.95,
    },
    light: {
      bg: '#fff5f0',
      fog: '#fee8dd',
      accent: '#ea580c',
      secondary: '#c2410c',
      ambientIntensity: 1.2,
    },
  },
  {
    id: 'about',
    z: -110,
    dark: {
      bg: '#0e0a06',
      fog: '#140e08',
      accent: '#d97706',
      secondary: '#b45309',
      ambientIntensity: 0.85,
    },
    light: {
      bg: '#faf4eb',
      fog: '#f3e9d8',
      accent: '#b45309',
      secondary: '#92400e',
      ambientIntensity: 1.1,
    },
  },
  {
    id: 'skills',
    z: -140,
    dark: {
      bg: '#080718',
      fog: '#0c0a22',
      accent: '#818cf8',
      secondary: '#6366f1',
      ambientIntensity: 0.9,
    },
    light: {
      bg: '#f3f2fc',
      fog: '#e7e5f8',
      accent: '#6366f1',
      secondary: '#4f46e5',
      ambientIntensity: 1.15,
    },
  },
  {
    id: 'contact',
    z: -170,
    dark: {
      bg: '#120f05',
      fog: '#181407',
      accent: '#eab308',
      secondary: '#ca8a04',
      ambientIntensity: 0.95,
    },
    light: {
      bg: '#faf7ec',
      fog: '#f5f0db',
      accent: '#ca8a04',
      secondary: '#a16207',
      ambientIntensity: 1.2,
    },
  },
]

/**
 * Deterministic PRNG to generate uniform particles without calling Math.random during render.
 */
function createDeterministicParticles(count) {
  const pos = new Float32Array(count * 3)
  const init = new Float32Array(count * 3)
  let seed = 1337
  const rand = () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const angle = rand() * Math.PI * 2
    const radius = 2.4 + rand() * 11.2
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    const z = 22 - rand() * 208

    pos[i3] = x
    pos[i3 + 1] = y
    pos[i3 + 2] = z

    init[i3] = x
    init[i3 + 1] = y
    init[i3 + 2] = z
  }

  return { positions: pos, initialPositions: init }
}

const DESKTOP_PARTICLES = createDeterministicParticles(680)
const MOBILE_PARTICLES = createDeterministicParticles(240)

/**
 * Calculates smoothly interpolated palette and coordinates across the 7 realms.
 */
function getRealmInterpolation(progress, theme) {
  const p = Math.max(0, Math.min(1, progress))
  const totalIntervals = REALM_CONFIGS.length - 1
  const scaled = p * totalIntervals
  const index = Math.min(Math.floor(scaled), totalIntervals - 1)
  const frac = scaled - index

  // Smooth Hermite cubic interpolation for buttery color transitions
  const smoothFrac = frac * frac * (3 - 2 * frac)

  const realmA = REALM_CONFIGS[index]
  const realmB = REALM_CONFIGS[index + 1]

  const paletteA = theme === 'light' ? realmA.light : realmA.dark
  const paletteB = theme === 'light' ? realmB.light : realmB.dark

  const targetZ = THREE.MathUtils.lerp(realmA.z, realmB.z, smoothFrac)

  return {
    realmA,
    realmB,
    paletteA,
    paletteB,
    frac: smoothFrac,
    targetZ,
  }
}

/**
 * Camera controller that translates the camera through real 3D space along the Z-axis
 * with velocity-responsive flight attitude, smooth kinetic damping, and cursor parallax.
 */
function ConduitCameraController({ scrollProgress, pointerRef }) {
  const currentZRef = useRef(10)
  const targetCamPos = useRef(new THREE.Vector3(0, 0, 10))
  const lastTargetZRef = useRef(10)
  const smoothVelocityRef = useRef(0)
  const targetFovRef = useRef(58)

  useFrame((state, delta) => {
    const p = scrollProgress ? scrollProgress.get() : 0
    const targetZ = 10 - p * 180

    const dt = Math.max(0.001, Math.min(delta, 0.05))

    // Calculate instantaneous scroll flight velocity (Z distance per second)
    const rawVel = (targetZ - lastTargetZRef.current) / dt
    lastTargetZRef.current = targetZ

    // Smooth velocity with responsive damping to filter out sudden mousewheel ticks
    smoothVelocityRef.current = THREE.MathUtils.damp(
      smoothVelocityRef.current,
      rawVel,
      7.5,
      dt
    )

    const vel = smoothVelocityRef.current
    const speed = Math.abs(vel)

    // Velocity-responsive damping on camera Z travel: responsive during flight, buttery at settle
    const zDamping = THREE.MathUtils.lerp(6.5, 7.8, Math.min(speed / 90, 1))
    currentZRef.current = THREE.MathUtils.lerp(currentZRef.current, targetZ, dt * zDamping)

    // Parallax from cursor position
    const ptr = pointerRef.current || { x: 0, y: 0 }
    targetCamPos.current.set(
      ptr.x * 0.9,
      -ptr.y * 0.6,
      currentZRef.current
    )

    state.camera.position.lerp(targetCamPos.current, dt * 5.0)

    // Velocity-responsive flight pitch: subtle forward tilt into speed, leveling out at rest
    // Forward travel (scrolling down -> Z decreases -> vel < 0): pitch down slightly into portal
    const flightPitch = THREE.MathUtils.clamp(-vel * 0.00035, -0.022, 0.022)

    // Subtle pitch and yaw combining pointer parallax and velocity flight attitude
    const targetRotY = -ptr.x * 0.05
    const targetRotX = ptr.y * 0.04 + flightPitch

    state.camera.rotation.y = THREE.MathUtils.lerp(state.camera.rotation.y, targetRotY, dt * 4.0)
    state.camera.rotation.x = THREE.MathUtils.lerp(state.camera.rotation.x, targetRotX, dt * 4.5)

    // Subtle optical warp: FOV expands slightly during fast travel (max +2.5 deg)
    const speedRatio = Math.min(speed / 110, 1)
    const nextTargetFov = 58 + speedRatio * 2.5
    targetFovRef.current = THREE.MathUtils.damp(targetFovRef.current, nextTargetFov, 6.0, dt)

    if (Math.abs(state.camera.fov - targetFovRef.current) > 0.02) {
      state.camera.fov = targetFovRef.current
      state.camera.updateProjectionMatrix()
    }
  })

  return null
}

/**
 * Dynamic volumetric fog and ambient/point lighting that morphs continuously
 * with theme and scroll progression across the 7 realms.
 */
function ConduitLightingAndAtmosphere({ scrollProgress, theme }) {
  const bgRef = useRef(null)
  const fogRef = useRef(null)
  const ambientLightRef = useRef(null)
  const headPointLightRef = useRef(null)
  const horizonLightRef = useRef(null)

  const tempColorA = useMemo(() => new THREE.Color(), [])
  const tempColorB = useMemo(() => new THREE.Color(), [])
  const targetBgColor = useMemo(() => new THREE.Color(), [])
  const targetFogColor = useMemo(() => new THREE.Color(), [])
  const targetAccentColor = useMemo(() => new THREE.Color(), [])

  useFrame((state, delta) => {
    const p = scrollProgress ? scrollProgress.get() : 0
    const { paletteA, paletteB, frac, targetZ } = getRealmInterpolation(p, theme)

    tempColorA.set(paletteA.bg)
    tempColorB.set(paletteB.bg)
    targetBgColor.copy(tempColorA).lerp(tempColorB, frac)

    tempColorA.set(paletteA.fog)
    tempColorB.set(paletteB.fog)
    targetFogColor.copy(tempColorA).lerp(tempColorB, frac)

    tempColorA.set(paletteA.accent)
    tempColorB.set(paletteB.accent)
    targetAccentColor.copy(tempColorA).lerp(tempColorB, frac)

    const dt = Math.min(delta, 0.05)

    if (bgRef.current) {
      bgRef.current.lerp(targetBgColor, dt * 5.0)
    }

    if (fogRef.current) {
      fogRef.current.color.lerp(targetFogColor, dt * 5.0)
      const restingDist = Math.abs((p * 6) - Math.round(p * 6))
      const targetDensity = theme === 'light'
        ? 0.012 + restingDist * 0.005
        : 0.014 + restingDist * 0.006
      fogRef.current.density = THREE.MathUtils.lerp(fogRef.current.density, targetDensity, dt * 4.0)
    }

    if (ambientLightRef.current) {
      const targetIntensity = THREE.MathUtils.lerp(
        paletteA.ambientIntensity,
        paletteB.ambientIntensity,
        frac
      )
      ambientLightRef.current.intensity = THREE.MathUtils.lerp(
        ambientLightRef.current.intensity,
        targetIntensity,
        dt * 4.0
      )
      ambientLightRef.current.color.lerp(targetFogColor, dt * 4.0)
    }

    if (headPointLightRef.current) {
      headPointLightRef.current.position.set(
        state.camera.position.x,
        state.camera.position.y + 1,
        state.camera.position.z - 4
      )
      headPointLightRef.current.color.lerp(targetAccentColor, dt * 6.0)
    }

    if (horizonLightRef.current) {
      horizonLightRef.current.position.set(0, 0, targetZ - 30)
      horizonLightRef.current.color.lerp(targetAccentColor, dt * 5.0)
    }
  })

  return (
    <>
      <color
        ref={bgRef}
        attach="background"
        args={[theme === 'light' ? '#faf6ef' : '#080605']}
      />
      <fogExp2
        ref={fogRef}
        attach="fog"
        args={[theme === 'light' ? '#f4ede2' : '#0a0806', 0.0125]}
      />
      <ambientLight ref={ambientLightRef} intensity={0.9} />
      <pointLight
        ref={headPointLightRef}
        intensity={theme === 'light' ? 2.4 : 3.2}
        distance={28}
        decay={2}
      />
      <pointLight
        ref={horizonLightRef}
        intensity={theme === 'light' ? 3.0 : 4.5}
        distance={60}
        decay={2}
      />
    </>
  )
}

/**
 * Procedural architectural portal gates positioned at each destination realm.
 * Features beveled octagonal rings, subtle glowing conduit rims, and wireframe depth markers.
 */
function ArchitecturalGates({ theme }) {
  const gatesGroupRef = useRef(null)

  // Memoize shared portal geometries for zero redundant GPU allocations
  const portalOuterGeometry = useMemo(() => new THREE.TorusGeometry(8.2, 0.08, 16, 8), [])
  const portalInnerGeometry = useMemo(() => new THREE.TorusGeometry(6.6, 0.04, 16, 8), [])
  const conduitRingGeometry = useMemo(() => new THREE.TorusGeometry(7.4, 0.02, 12, 32), [])

  // Create intermediate spatial conduit rings along the tunnel
  const intermediateZList = useMemo(() => {
    const list = []
    for (let z = 16; z >= -185; z -= 6.5) {
      const isNearMajor = REALM_CONFIGS.some((r) => Math.abs(r.z - z) < 2.0)
      if (!isNearMajor) {
        list.push(z)
      }
    }
    return list
  }, [])

  const gateMaterials = useMemo(() => {
    return REALM_CONFIGS.map((realm) => {
      const color = theme === 'light' ? realm.light.accent : realm.dark.accent
      return new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        wireframe: false,
        transparent: true,
        opacity: theme === 'light' ? 0.35 : 0.65,
        blending: theme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending,
      })
    })
  }, [theme])

  const intermediateMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(theme === 'light' ? '#c7d2fe' : '#334155'),
      wireframe: false,
      transparent: true,
      opacity: theme === 'light' ? 0.18 : 0.3,
    })
  }, [theme])

  useFrame(({ clock }) => {
    if (!gatesGroupRef.current) return
    const time = clock.getElapsedTime()

    // Gentle rotational breathing of the portal structures
    gatesGroupRef.current.children.forEach((child, idx) => {
      if (child.userData.isMajor) {
        child.rotation.z = time * 0.08 * (idx % 2 === 0 ? 1 : -1)
      } else {
        child.rotation.z = time * 0.02 * (idx % 2 === 0 ? 1 : -1)
      }
    })
  })

  return (
    <group ref={gatesGroupRef}>
      {/* 7 Major Destination Realm Gates */}
      {REALM_CONFIGS.map((realm, idx) => (
        <group key={realm.id} position={[0, 0, realm.z]} userData={{ isMajor: true }}>
          <mesh geometry={portalOuterGeometry} material={gateMaterials[idx]} />
          <mesh
            geometry={portalInnerGeometry}
            material={gateMaterials[idx]}
            rotation={[0, 0, Math.PI / 8]}
          />
        </group>
      ))}

      {/* Intermediate conduit rings connecting the journey */}
      {intermediateZList.map((zPos) => (
        <mesh
          key={zPos}
          position={[0, 0, zPos]}
          geometry={conduitRingGeometry}
          material={intermediateMaterial}
          userData={{ isMajor: false }}
        />
      ))}
    </group>
  )
}

/**
 * Realm 1 Landmark: Clocky Celestial Orbital Dials.
 * Concentric analog orbital rings and radial tick markers rotating in 3D.
 */
function ClockyOrbitalLandmark({ theme }) {
  const groupRef = useRef(null)
  const ring1Geo = useMemo(() => new THREE.TorusGeometry(10.5, 0.03, 12, 64), [])
  const ring2Geo = useMemo(() => new THREE.TorusGeometry(12.5, 0.02, 12, 64), [])
  const ring3Geo = useMemo(() => new THREE.TorusGeometry(14.8, 0.03, 12, 48), [])

  const tickGeo = useMemo(() => new THREE.BoxGeometry(0.08, 0.8, 0.08), [])

  const mat = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(theme === 'light' ? '#0284c7' : '#38bdf8'),
      transparent: true,
      opacity: theme === 'light' ? 0.35 : 0.6,
      blending: theme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending,
    })
  }, [theme])

  // 12 clock hour ticks
  const hourTicks = useMemo(() => {
    const ticks = []
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2
      const radius = 10.5
      ticks.push({
        position: [Math.cos(angle) * radius, Math.sin(angle) * radius, 0],
        rotation: [0, 0, angle + Math.PI / 2],
      })
    }
    return ticks
  }, [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.children[0].rotation.z = t * 0.12
    groupRef.current.children[1].rotation.z = -t * 0.07
    groupRef.current.children[2].rotation.z = t * 0.04
  })

  return (
    <group ref={groupRef} position={[0, 0, -20]}>
      {/* Outer Dial 1 with Ticks */}
      <group>
        <mesh geometry={ring1Geo} material={mat} />
        {hourTicks.map((tick, i) => (
          <mesh
            key={i}
            position={tick.position}
            rotation={tick.rotation}
            geometry={tickGeo}
            material={mat}
          />
        ))}
      </group>

      {/* Middle Dial 2 */}
      <group>
        <mesh geometry={ring2Geo} material={mat} />
      </group>

      {/* Outer Dial 3 */}
      <group>
        <mesh geometry={ring3Geo} material={mat} />
      </group>
    </group>
  )
}

/**
 * Realm 2 Landmark: Expify Beta Holographic Financial Ledger Grid.
 * Digital floor and ceiling coordinate meshes with floating glowing crystal nodes.
 */
function ExpifyLedgerLandmark({ theme }) {
  const groupRef = useRef(null)

  const gridGeo = useMemo(() => new THREE.PlaneGeometry(36, 32, 18, 16), [])
  const nodeGeo = useMemo(() => new THREE.OctahedronGeometry(0.35, 0), [])

  const gridMat = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(theme === 'light' ? '#059669' : '#10b981'),
      wireframe: true,
      transparent: true,
      opacity: theme === 'light' ? 0.16 : 0.28,
      blending: theme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending,
    })
  }, [theme])

  const nodeMat = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(theme === 'light' ? '#10b981' : '#34d399'),
      transparent: true,
      opacity: theme === 'light' ? 0.45 : 0.75,
      blending: theme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending,
    })
  }, [theme])

  const crystalPositions = useMemo(() => {
    return [
      [-7.5, 3.8, -4],
      [7.5, 3.8, -4],
      [-8.2, -3.8, 3],
      [8.2, -3.8, 3],
      [-9.0, 0.5, 0],
      [9.0, -0.5, -2],
    ]
  }, [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    const floor = groupRef.current.children[0]
    const ceiling = groupRef.current.children[1]
    if (floor) floor.position.y = -6.8 + Math.sin(t * 0.8) * 0.15
    if (ceiling) ceiling.position.y = 6.8 - Math.sin(t * 0.8) * 0.15
  })

  return (
    <group ref={groupRef} position={[0, 0, -50]}>
      {/* Floor Grid */}
      <mesh
        geometry={gridGeo}
        material={gridMat}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -6.8, 0]}
      />
      {/* Ceiling Grid */}
      <mesh
        geometry={gridGeo}
        material={gridMat}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 6.8, 0]}
      />
      {/* Floating Emerald Data Nodes */}
      {crystalPositions.map((pos, idx) => (
        <mesh
          key={idx}
          position={pos}
          geometry={nodeGeo}
          material={nodeMat}
          rotation={[idx * 0.5, idx * 0.8, 0]}
        />
      ))}
    </group>
  )
}

/**
 * Realm 3 Landmark: NomNom Warm Sunset Coral Embers & Rings.
 * Radiant warm atmospheric rings with gentle floating embers.
 */
function NomNomCulinaryLandmark({ theme }) {
  const groupRef = useRef(null)
  const ringGeo = useMemo(() => new THREE.TorusGeometry(9.2, 0.05, 12, 48), [])
  const emberGeo = useMemo(() => new THREE.DodecahedronGeometry(0.25, 0), [])

  const ringMat = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(theme === 'light' ? '#ea580c' : '#f97316'),
      transparent: true,
      opacity: theme === 'light' ? 0.35 : 0.65,
      blending: theme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending,
    })
  }, [theme])

  const emberMat = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(theme === 'light' ? '#f97316' : '#fb923c'),
      transparent: true,
      opacity: theme === 'light' ? 0.5 : 0.8,
      blending: theme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending,
    })
  }, [theme])

  const embers = useMemo(() => {
    const list = []
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2
      const r = 7.5 + (i % 3) * 1.5
      list.push({
        basePos: [Math.cos(angle) * r, Math.sin(angle) * r, (i % 5) * 2 - 4],
        phase: i * 0.7,
      })
    }
    return list
  }, [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.rotation.z = t * 0.06
  })

  return (
    <group ref={groupRef} position={[0, 0, -80]}>
      <mesh geometry={ringGeo} material={ringMat} />
      {embers.map((item, i) => (
        <mesh
          key={i}
          position={item.basePos}
          geometry={emberGeo}
          material={emberMat}
        />
      ))}
    </group>
  )
}

/**
 * Realm 4 Landmark: About Me Bronze Architectural Monoliths.
 * Symmetrical structural pillars representing solid computer science and C++/DSA foundations.
 */
function AboutFoundationsLandmark({ theme }) {
  const pillarGeo = useMemo(() => new THREE.BoxGeometry(0.8, 14, 0.8), [])
  const pillarMat = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(theme === 'light' ? '#b45309' : '#d97706'),
      wireframe: true,
      transparent: true,
      opacity: theme === 'light' ? 0.22 : 0.45,
      blending: theme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending,
    })
  }, [theme])

  return (
    <group position={[0, 0, -110]}>
      <mesh position={[-8.5, 0, 0]} geometry={pillarGeo} material={pillarMat} />
      <mesh position={[-10.5, 0, -3]} geometry={pillarGeo} material={pillarMat} />
      <mesh position={[8.5, 0, 0]} geometry={pillarGeo} material={pillarMat} />
      <mesh position={[10.5, 0, -3]} geometry={pillarGeo} material={pillarMat} />
    </group>
  )
}

/**
 * Realm 5 Landmark: Technical Skills Constellation Grid.
 * Digital constellation connecting skill coordinates in 3D space.
 */
function SkillsConstellationLandmark({ theme }) {
  const groupRef = useRef(null)
  const nodeGeo = useMemo(() => new THREE.SphereGeometry(0.24, 12, 12), [])
  const nodeMat = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(theme === 'light' ? '#6366f1' : '#818cf8'),
      transparent: true,
      opacity: theme === 'light' ? 0.5 : 0.85,
      blending: theme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending,
    })
  }, [theme])

  const nodes = useMemo(() => {
    return [
      [-7.5, 4.0, 0],
      [-5.5, 5.5, -2],
      [-8.5, 1.8, 1],
      [7.5, 4.0, 0],
      [5.5, 5.5, -2],
      [8.5, 1.8, 1],
      [-7.0, -4.0, 0],
      [7.0, -4.0, 0],
    ]
  }, [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.05
  })

  return (
    <group ref={groupRef} position={[0, 0, -140]}>
      {nodes.map((pos, idx) => (
        <mesh key={idx} position={pos} geometry={nodeGeo} material={nodeMat} />
      ))}
    </group>
  )
}

/**
 * Realm 6 Landmark: Contact Dawn Gateway.
 * Grand golden arch with converging perspective light rays.
 */
function ContactDawnLandmark({ theme }) {
  const archGeo = useMemo(() => new THREE.TorusGeometry(8.8, 0.06, 16, 32), [])
  const beamGeo = useMemo(() => new THREE.CylinderGeometry(0.04, 0.25, 28, 8), [])

  const archMat = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(theme === 'light' ? '#ca8a04' : '#eab308'),
      transparent: true,
      opacity: theme === 'light' ? 0.4 : 0.75,
      blending: theme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending,
    })
  }, [theme])

  const beamMat = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(theme === 'light' ? '#eab308' : '#fef08a'),
      transparent: true,
      opacity: theme === 'light' ? 0.18 : 0.35,
      blending: theme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending,
    })
  }, [theme])

  return (
    <group position={[0, 0, -170]}>
      <mesh geometry={archGeo} material={archMat} />
      {/* 4 Converging perspective light beams toward the horizon */}
      <mesh
        position={[-5, -4, -10]}
        rotation={[Math.PI / 4, 0, -Math.PI / 6]}
        geometry={beamGeo}
        material={beamMat}
      />
      <mesh
        position={[5, -4, -10]}
        rotation={[Math.PI / 4, 0, Math.PI / 6]}
        geometry={beamGeo}
        material={beamMat}
      />
      <mesh
        position={[-5, 4, -10]}
        rotation={[-Math.PI / 4, 0, -Math.PI / 6]}
        geometry={beamGeo}
        material={beamMat}
      />
      <mesh
        position={[5, 4, -10]}
        rotation={[-Math.PI / 4, 0, Math.PI / 6]}
        geometry={beamGeo}
        material={beamMat}
      />
    </group>
  )
}

/**
 * Adaptive Particle Slipstream along the entire 3D Dimensional Conduit.
 * Renders glowing ambient particle dust that dynamically stretches into aerodynamic
 * conduit streaks during fast camera flight, then smoothly contracts back at rest.
 */
function ParticleSlipstream({ scrollProgress, theme, isMobile }) {
  const pointsRef = useRef(null)
  const linesRef = useRef(null)
  const lastProgressRef = useRef(0)
  const velocityRef = useRef(0)
  const currentStreakZRef = useRef(0)

  const particleData = isMobile ? MOBILE_PARTICLES : DESKTOP_PARTICLES
  const particleCount = isMobile ? 240 : 680

  const pointsMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      color: new THREE.Color(theme === 'light' ? '#94a3b8' : '#e2e8f0'),
      size: theme === 'light' ? 0.18 : 0.24,
      transparent: true,
      opacity: theme === 'light' ? 0.45 : 0.75,
      blending: theme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false,
    })
  }, [theme])

  const linesMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: new THREE.Color(theme === 'light' ? '#78889b' : '#38bdf8'),
      transparent: true,
      opacity: 0,
      blending: theme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false,
    })
  }, [theme])

  const pointsGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(particleData.positions), 3))
    return geo
  }, [particleData.positions])

  const linesGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const linePositions = new Float32Array(particleCount * 6)
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const i6 = i * 6
      const x = particleData.positions[i3]
      const y = particleData.positions[i3 + 1]
      const z = particleData.positions[i3 + 2]
      linePositions[i6] = x
      linePositions[i6 + 1] = y
      linePositions[i6 + 2] = z
      linePositions[i6 + 3] = x
      linePositions[i6 + 4] = y
      linePositions[i6 + 5] = z
    }
    geo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    return geo
  }, [particleData.positions, particleCount])

  useEffect(() => {
    return () => {
      pointsGeometry.dispose()
      linesGeometry.dispose()
      pointsMaterial.dispose()
      linesMaterial.dispose()
    }
  }, [pointsGeometry, linesGeometry, pointsMaterial, linesMaterial])

  useFrame((_, delta) => {
    if (!pointsRef.current || !linesRef.current) return
    const currentProgress = scrollProgress ? scrollProgress.get() : 0
    const dt = Math.max(0.001, Math.min(delta, 0.05))

    const rawVel = (currentProgress - lastProgressRef.current) / dt
    velocityRef.current = THREE.MathUtils.damp(velocityRef.current, rawVel, 7.5, dt)
    lastProgressRef.current = currentProgress

    const vel = velocityRef.current
    const speed = Math.abs(vel)

    // Calculate dynamic streak stretch along the Z axis (backward from flight direction)
    // Forward flight (vel > 0 in progress -> camera moves -Z): particles streak behind towards +Z
    const targetStreakZ = THREE.MathUtils.clamp(vel * 3.8, -2.4, 2.4)
    currentStreakZRef.current = THREE.MathUtils.damp(currentStreakZRef.current, targetStreakZ, 8.5, dt)
    const streakZ = currentStreakZRef.current

    // Fade streaks in during movement; hide completely when resting
    const streakStrength = Math.min(speed * 2.8, 1)
    if (linesRef.current.material) {
      linesRef.current.material.opacity = THREE.MathUtils.lerp(
        0,
        theme === 'light' ? 0.38 : 0.62,
        streakStrength
      )
    }

    // Subtle particle size expansion during fast travel
    if (pointsRef.current.material) {
      const baseSize = theme === 'light' ? 0.18 : 0.24
      pointsRef.current.material.size = baseSize + THREE.MathUtils.clamp(speed * 0.08, 0, 0.10)
    }

    const posAttr = pointsRef.current.geometry.attributes.position
    const posArray = posAttr.array

    const lineAttr = linesRef.current.geometry.attributes.position
    const lineArray = lineAttr.array

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const i6 = i * 6

      // Move particle through space with camera travel
      posArray[i3 + 2] += vel * 8.0 * dt

      // Wrap around conduit boundaries
      if (posArray[i3 + 2] > 26) {
        posArray[i3 + 2] = -185
      } else if (posArray[i3 + 2] < -188) {
        posArray[i3 + 2] = 24
      }

      const px = posArray[i3]
      const py = posArray[i3 + 1]
      const pz = posArray[i3 + 2]

      // Line segment head
      lineArray[i6] = px
      lineArray[i6 + 1] = py
      lineArray[i6 + 2] = pz

      // Line segment tail (stretched along Z during flight)
      lineArray[i6 + 3] = px
      lineArray[i6 + 4] = py
      lineArray[i6 + 5] = pz + streakZ
    }

    posAttr.needsUpdate = true
    lineAttr.needsUpdate = true
  })

  return (
    <group>
      <points ref={pointsRef} geometry={pointsGeometry} material={pointsMaterial} />
      <lineSegments ref={linesRef} geometry={linesGeometry} material={linesMaterial} />
    </group>
  )
}

/**
 * Top-level WebGL 3D World Scene.
 * Integrates camera travel, lighting, architectural portals, realm landmarks,
 * and the particle slipstream.
 */
function TravelScene({ scrollProgress, theme, pointerRef, isMobile }) {
  return (
    <>
      <ConduitCameraController scrollProgress={scrollProgress} pointerRef={pointerRef} />
      <ConduitLightingAndAtmosphere scrollProgress={scrollProgress} theme={theme} />

      <ArchitecturalGates theme={theme} />

      {/* Realm-Specific 3D Landmarks */}
      <ClockyOrbitalLandmark theme={theme} />
      <ExpifyLedgerLandmark theme={theme} />
      <NomNomCulinaryLandmark theme={theme} />
      <AboutFoundationsLandmark theme={theme} />
      <SkillsConstellationLandmark theme={theme} />
      <ContactDawnLandmark theme={theme} />

      {/* Particle Slipstream */}
      <ParticleSlipstream
        scrollProgress={scrollProgress}
        theme={theme}
        isMobile={isMobile}
      />
    </>
  )
}

/**
 * Error boundary for WebGL rendering to guarantee rock-solid stability.
 */
class WebGLBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(err) {
    console.warn('[TravelWorld3D] WebGL context failed, using fallback:', err)
  }

  render() {
    return this.state.hasError ? null : this.props.children
  }
}

function checkWebGLSupport() {
  if (typeof window === 'undefined') return true
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    )
  } catch {
    return false
  }
}

/**
 * Main persistent 3D Travel World Component.
 * Mounts a full-viewport WebGL canvas fixed in the background that physically moves
 * through 3D space with scroll progression.
 */
function TravelWorld3D({ scrollProgress, theme = 'dark', reducedMotion = false }) {
  const [isSupported] = useState(checkWebGLSupport)
  const [isMobile, setIsMobile] = useState(false)
  const pointerRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth <= 768 ||
          (window.innerWidth <= 1024 && Boolean(window.matchMedia?.('(pointer: coarse)').matches))
      )
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (reducedMotion || isMobile) return undefined

    const handlePointerMove = (e) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointerRef.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [reducedMotion, isMobile])

  if (!isSupported) {
    return (
      <div
        className="travel-world-fallback-bg"
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100dvh',
          minHeight: '100vh',
          pointerEvents: 'none',
          zIndex: 0,
          background: theme === 'light'
            ? 'radial-gradient(ellipse at 50% 30%, #fef3c7 0%, #faf6ef 60%, #f4ede2 100%)'
            : 'radial-gradient(ellipse at 50% 30%, #1c1308 0%, #080605 60%, #020202 100%)',
          transition: 'background 0.8s ease',
        }}
      />
    )
  }

  if (reducedMotion) {
    return null
  }

  return (
    <div
      className="travel-world-canvas-container"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        minHeight: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      <WebGLBoundary>
        <Canvas
          camera={{ position: [0, 0, 10], fov: 58, near: 0.1, far: 240 }}
          gl={{
            antialias: !isMobile,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
          }}
          dpr={isMobile ? 1.0 : Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 1.5)}
          style={{ width: '100%', height: '100%' }}
        >
          <TravelScene
            scrollProgress={scrollProgress}
            theme={theme}
            pointerRef={pointerRef}
            isMobile={isMobile}
          />
        </Canvas>
      </WebGLBoundary>
    </div>
  )
}

export default memo(TravelWorld3D)
