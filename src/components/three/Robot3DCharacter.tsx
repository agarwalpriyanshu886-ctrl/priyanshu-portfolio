import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

export function CuteRobot({
  onClick,
  isHovered,
  setIsHovered,
}: {
  onClick: () => void
  isHovered: boolean
  setIsHovered: (v: boolean) => void
}) {
  const robotGroupRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Group>(null)
  const eyeLeftRef = useRef<THREE.Mesh>(null)
  const eyeRightRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    if (robotGroupRef.current) {
      robotGroupRef.current.rotation.y = Math.sin(t * 0.8) * 0.3
      robotGroupRef.current.position.y = Math.sin(t * 1.5) * 0.12
    }

    if (headRef.current) {
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, state.mouse.y * 0.3, 0.1)
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, state.mouse.x * 0.3, 0.1)
    }

    if (eyeLeftRef.current && eyeRightRef.current) {
      const scale = 1 + Math.sin(t * 4) * 0.1
      eyeLeftRef.current.scale.set(scale, scale, scale)
      eyeRightRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.6}>
      <group
        ref={robotGroupRef}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        scale={isHovered ? 1.15 : 1.0}
      >
        {/* ROBOT HEAD */}
        <group ref={headRef} position={[0, 0.55, 0]}>
          {/* Main Head Sphere */}
          <mesh>
            <sphereGeometry args={[0.55, 32, 32]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Visor Screen */}
          <mesh position={[0, 0.05, 0.38]} rotation={[0.1, 0, 0]}>
            <cylinderGeometry args={[0.38, 0.38, 0.28, 32, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
          </mesh>

          {/* Glowing Cyan Eyes */}
          <mesh ref={eyeLeftRef} position={[-0.18, 0.08, 0.52]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial color="#22d3ee" />
          </mesh>
          <mesh ref={eyeRightRef} position={[0.18, 0.08, 0.52]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial color="#22d3ee" />
          </mesh>

          {/* Cute Antenna */}
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.02, 0.03, 0.25, 16]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.78, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color={isHovered ? '#ec4899' : '#38bdf8'} />
          </mesh>
        </group>

        {/* ROBOT BODY */}
        <group position={[0, -0.3, 0]}>
          {/* Torso Sphere Standard Geometry */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.45, 32, 32]} />
            <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* Heart Core Light */}
          <mesh position={[0, 0.1, 0.4]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color={isHovered ? '#f43f5e' : '#6366f1'} />
          </mesh>

          {/* Shoulder Joints */}
          <mesh position={[-0.48, 0.15, 0]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0.48, 0.15, 0]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>

          {/* Floating Hands */}
          <mesh position={[-0.6, -0.1, 0.1]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.8} />
          </mesh>
          <mesh position={[0.6, -0.1, 0.1]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.8} />
          </mesh>

          {/* Bottom Jet Ring Glow */}
          <mesh position={[0, -0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.28, 0.04, 16, 32]} />
            <meshBasicMaterial color="#22d3ee" />
          </mesh>
        </group>
      </group>
    </Float>
  )
}
