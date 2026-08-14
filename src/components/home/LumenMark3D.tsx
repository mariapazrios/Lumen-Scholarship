/* eslint-disable react/no-unknown-property -- React Three Fiber JSX props */

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber"
import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js"

const SCENE_BG = "#141c28"
const FILL = 0.5
const FILL_MOBILE = FILL * 1.15
const LIFT = 0.47
const FACE = "#1a4d8a"
const RIM = "#4a8fd4"
const DEPTH = 18
const DRAG = 0.008
const HOVER_S = 3.2
const GATHER_S = 1.8

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
}

/** 1 = assembled icon, 0 = scattered. One-shot: hover, then lock. */
function assembleAmount(elapsed: number) {
  if (elapsed < HOVER_S) return 0
  if (elapsed < HOVER_S + GATHER_S) return easeInOut((elapsed - HOVER_S) / GATHER_S)
  return 1
}

function extrudePetal(shape: THREE.Shape) {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: DEPTH,
    bevelEnabled: true,
    bevelSegments: 10,
    bevelSize: 1.6,
    bevelThickness: 1.6,
    curveSegments: 24,
  })
  geometry.scale(1, -1, 1)
  geometry.computeBoundingBox()
  return geometry
}

type Petal = {
  geometry: THREE.BufferGeometry
  scatter: THREE.Vector3
  seed: number
}

function Mark({ onTogether }: { onTogether?: (together: boolean) => void }) {
  const group = useRef<THREE.Group>(null)
  const meshRefs = useRef<Array<THREE.Mesh | null>>([])
  const { viewport, gl } = useThree()
  const data = useLoader(SVGLoader, "/lumen-mark.svg")
  const dragging = useRef(false)
  const gesture = useRef<"none" | "rotate" | "scroll">("none")
  const last = useRef({ x: 0, y: 0 })
  const rot = useRef({ x: 0, y: 0 })
  const reduceMotion = useRef(false)
  const lockedForGood = useRef(false)
  const announced = useRef(false)
  const onTogetherRef = useRef(onTogether)
  onTogetherRef.current = onTogether
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const sync = () => setMobile(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  const { petals, extent } = useMemo(() => {
    const shapes = data.paths.flatMap((path) => path.toShapes())
    const geos = shapes.map(extrudePetal)
    const box = new THREE.Box3()
    for (const geo of geos) {
      if (geo.boundingBox) box.union(geo.boundingBox)
    }
    const center = new THREE.Vector3()
    box.getCenter(center)
    for (const geo of geos) {
      geo.translate(-center.x, -center.y, -center.z)
      geo.computeBoundingBox()
    }
    const size = new THREE.Vector3()
    box.getSize(size)
    const throwDist = Math.max(size.x, size.y) * 0.42
    const built: Petal[] = geos.map((geometry, i) => {
      const local = new THREE.Vector3()
      geometry.boundingBox?.getCenter(local)
      const dir = local.clone()
      if (dir.lengthSq() < 1e-6) {
        const a = (i / Math.max(geos.length, 1)) * Math.PI * 2
        dir.set(Math.cos(a), Math.sin(a), 0)
      } else {
        dir.normalize()
      }
      const scatter = dir.multiplyScalar(throwDist)
      scatter.z += (i % 2 === 0 ? 1 : -1) * size.z * 0.35
      const yaw = (i / geos.length) * Math.PI * 2 * 0.35
      scatter.x += Math.cos(yaw) * throwDist * 0.15
      scatter.y += Math.sin(yaw) * throwDist * 0.15
      return { geometry, scatter, seed: i * 17.13 + 0.37 }
    })
    return { petals: built, extent: size }
  }, [data])

  useEffect(
    () => () => {
      for (const petal of petals) petal.geometry.dispose()
    },
    [petals],
  )

  const scale =
    Math.min(viewport.width / Math.max(extent.x, 0.001), viewport.height / Math.max(extent.y, 0.001)) *
    (mobile ? FILL_MOBILE : FILL)

  useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const canvas = gl.domElement
    canvas.style.cursor = "grab"

    const onDown = (event: PointerEvent) => {
      dragging.current = true
      gesture.current = event.pointerType === "mouse" ? "rotate" : "none"
      last.current = { x: event.clientX, y: event.clientY }
      if (event.pointerType === "mouse") {
        canvas.style.cursor = "grabbing"
        canvas.setPointerCapture(event.pointerId)
      }
    }

    const onMove = (event: PointerEvent) => {
      if (!dragging.current) return
      const dx = event.clientX - last.current.x
      const dy = event.clientY - last.current.y

      if (gesture.current === "none") {
        if (Math.hypot(dx, dy) < 10) return
        gesture.current = Math.abs(dx) > Math.abs(dy) * 1.15 ? "rotate" : "scroll"
        if (gesture.current === "rotate") {
          canvas.setPointerCapture(event.pointerId)
        }
      }
      if (gesture.current !== "rotate") return

      event.preventDefault()
      last.current = { x: event.clientX, y: event.clientY }
      rot.current.y += dx * DRAG
      rot.current.x += dy * DRAG
    }

    const onUp = (event: PointerEvent) => {
      dragging.current = false
      gesture.current = "none"
      canvas.style.cursor = "grab"
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId)
      }
    }

    canvas.addEventListener("pointerdown", onDown)
    canvas.addEventListener("pointermove", onMove, { passive: false })
    canvas.addEventListener("pointerup", onUp)
    canvas.addEventListener("pointercancel", onUp)
    return () => {
      canvas.removeEventListener("pointerdown", onDown)
      canvas.removeEventListener("pointermove", onMove)
      canvas.removeEventListener("pointerup", onUp)
      canvas.removeEventListener("pointercancel", onUp)
    }
  }, [gl])

  useFrame(({ clock }) => {
    if (!group.current) return
    let together = reduceMotion.current ? 1 : assembleAmount(clock.elapsedTime)
    if (together >= 1) lockedForGood.current = true
    if (lockedForGood.current) together = 1
    if (together >= 0.995 && !announced.current) {
      announced.current = true
      onTogetherRef.current?.(true)
    }
    const apart = 1 - together
    const t = clock.elapsedTime

    if (!dragging.current) {
      rot.current.x += (0 - rot.current.x) * (0.04 + together * 0.08)
      rot.current.y += (0 - rot.current.y) * (0.04 + together * 0.08)
    }
    group.current.rotation.x += (rot.current.x - group.current.rotation.x) * 0.12
    group.current.rotation.y += (rot.current.y - group.current.rotation.y) * 0.12
    group.current.rotation.z = 0
    const hold = together * together
    group.current.position.x = hold * Math.sin(t * 1.8) * 0.02
    group.current.position.y = LIFT + hold * Math.cos(t * 2.1) * 0.022

    for (let i = 0; i < petals.length; i++) {
      const mesh = meshRefs.current[i]
      if (!mesh) continue
      const { scatter, seed } = petals[i]
      const reach = scatter.length() || 1
      const hover = reach * 0.1
      const vibe = hold * reach * 0.016
      mesh.position.set(
        scatter.x * apart + Math.sin(t * 0.65 + seed) * hover * apart + Math.sin(t * 2.6 + seed) * vibe,
        scatter.y * apart + Math.cos(t * 0.52 + seed * 1.15) * hover * 0.8 * apart + Math.cos(t * 2.3 + seed) * vibe * 0.85,
        scatter.z * apart + Math.sin(t * 0.4 + seed * 0.7) * hover * 0.45 * apart,
      )
      mesh.rotation.set(
        apart * Math.sin(t * 0.45 + seed) * 0.1,
        apart * Math.cos(t * 0.38 + seed * 1.1) * 0.14,
        apart * Math.sin(t * 0.32 + seed * 0.6) * 0.07,
      )
    }
  })

  const face = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: FACE,
        metalness: 0.08,
        roughness: 0.88,
        envMapIntensity: 0,
      }),
    [],
  )
  const rim = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: RIM,
        metalness: 0.05,
        roughness: 0.82,
        envMapIntensity: 0,
      }),
    [],
  )
  const materials = useMemo(() => [face, rim], [face, rim])

  useEffect(
    () => () => {
      face.dispose()
      rim.dispose()
    },
    [face, rim],
  )

  return (
    <group ref={group} scale={scale} position={[0, LIFT, 0]}>
      {petals.map((petal, i) => (
        <mesh
          key={i}
          ref={(node) => {
            meshRefs.current[i] = node
          }}
          geometry={petal.geometry}
          material={materials}
        />
      ))}
    </group>
  )
}

function Lights() {
  return (
    <>
      <hemisphereLight args={["#c5d8ee", "#1a2430", 0.45]} />
      <spotLight
        color="#f4f7fb"
        intensity={4.2}
        position={[0, 16, 3]}
        angle={0.62}
        penumbra={0.75}
        distance={40}
      />
      <directionalLight color="#ffffff" intensity={1.7} position={[0, 14, 2]} />
      <directionalLight color="#8eb4d8" intensity={0.4} position={[-5, 3, 6]} />
    </>
  )
}

export default function LumenMark3D({
  className = "",
  onTogether,
}: {
  className?: string
  onTogether?: (together: boolean) => void
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={`h-full w-full ${className}`} style={{ background: SCENE_BG }} />
  }

  return (
    <div className={`h-full w-full ${className}`} style={{ background: SCENE_BG }}>
      <Canvas
        camera={{ fov: 32, position: [0, 0.15, 7.2] }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        style={{ background: SCENE_BG }}
      >
        <color attach="background" args={[SCENE_BG]} />
        <Lights />
        <Suspense fallback={null}>
          <Mark onTogether={onTogether} />
        </Suspense>
      </Canvas>
    </div>
  )
}
