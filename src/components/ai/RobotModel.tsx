import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { RobotState, RobotEmotion } from '../../lib/ai/aiTypes'

export function RobotModel({
  state,
  emotion,
  isHovered,
  onClick,
}: {
  state: RobotState
  emotion: RobotEmotion
  isHovered: boolean
  onClick?: () => void
}) {
  const groupRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Group>(null)
  const eyeLeftRef = useRef<THREE.Mesh>(null)
  const eyeRightRef = useRef<THREE.Mesh>(null)
  const micRef = useRef<THREE.Group>(null)

  useFrame((stateCtx) => {
    const t = stateCtx.clock.getElapsedTime()

    // 1. FSM Motion
    if (groupRef.current) {
      const speed = state === 'speaking' ? 3.0 : state === 'thinking' ? 2.2 : 1.2
      const bob = Math.sin(t * speed) * 0.12
      groupRef.current.position.y = bob

      if (state === 'speaking') {
        groupRef.current.rotation.y = Math.sin(t * 2) * 0.12
      } else if (state === 'thinking') {
        groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.18
      } else {
        groupRef.current.rotation.y = Math.sin(t * 0.8) * 0.08
      }
    }

    // 2. Head Tilt & Cursor Tracking
    if (headRef.current) {
      if (state === 'thinking' || emotion === 'thinking') {
        headRef.current.rotation.z = Math.sin(t * 2.5) * 0.08
        headRef.current.rotation.x = 0.12
      } else {
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, stateCtx.mouse.y * 0.35, 0.08)
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, stateCtx.mouse.x * 0.35, 0.08)
        headRef.current.rotation.z = 0
      }
    }

    // 3. Eye Glow & Emotion Scaling
    if (eyeLeftRef.current && eyeRightRef.current) {
      let scale = 1.0
      if (emotion === 'excited' || state === 'speaking') scale = 1.2 + Math.sin(t * 8) * 0.12
      else if (emotion === 'happy') scale = 1.1 + Math.sin(t * 4) * 0.08
      else if (state === 'listening') scale = 1.25
      else if (state === 'thinking') scale = 0.8 + Math.sin(t * 5) * 0.15

      eyeLeftRef.current.scale.set(scale, scale, scale)
      eyeRightRef.current.scale.set(scale, scale, scale)
    }

    // 4. Microphone Lifting Gesture
    if (micRef.current) {
      const targetZ = state === 'listening' || state === 'speaking' ? 0.35 : 0.15
      const targetY = state === 'listening' || state === 'speaking' ? 0.15 : -0.1
      micRef.current.position.z = THREE.MathUtils.lerp(micRef.current.position.z, targetZ, 0.1)
      micRef.current.position.y = THREE.MathUtils.lerp(micRef.current.position.y, targetY, 0.1)
    }
  })

  // Emotion Colors
  const eyeColor =
    emotion === 'excited'
      ? '#ec4899'
      : emotion === 'happy'
      ? '#10b981'
      : emotion === 'concerned'
      ? '#f43f5e'
      : state === 'listening'
      ? '#f59e0b'
      : '#22d3ee'

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
      <group ref={groupRef} onClick={onClick} scale={isHovered ? 1.12 : 1.0}>
        {/* ROBOT HEAD */}
        <group ref={headRef} position={[0, 0.6, 0]}>
          <mesh>
            <sphereGeometry args={[0.55, 32, 32]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.15} />
          </mesh>

          {/* Visor Screen */}
          <mesh position={[0, 0.05, 0.38]} rotation={[0.08, 0, 0]}>
            <cylinderGeometry args={[0.38, 0.38, 0.28, 32, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#020617" roughness={0.05} metalness={0.95} />
          </mesh>

          {/* Glowing Eyes */}
          <mesh ref={eyeLeftRef} position={[-0.18, 0.08, 0.52]}>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshBasicMaterial color={eyeColor} />
          </mesh>
          <mesh ref={eyeRightRef} position={[0.18, 0.08, 0.52]}>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshBasicMaterial color={eyeColor} />
          </mesh>

          {/* Top Antenna */}
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.02, 0.03, 0.25, 16]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.78, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color={state === 'listening' ? '#f59e0b' : '#38bdf8'} />
          </mesh>
        </group>

        {/* ROBOT BODY */}
        <group position={[0, -0.3, 0]}>
          <mesh>
            <sphereGeometry args={[0.45, 32, 32]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Torso Core Light */}
          <mesh position={[0, 0.1, 0.4]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color={state === 'listening' ? '#f59e0b' : '#6366f1'} />
          </mesh>

          {/* Shoulder Joints */}
          <mesh position={[-0.48, 0.15, 0]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshStandardMaterial color="#020617" />
          </mesh>
          <mesh position={[0.48, 0.15, 0]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshStandardMaterial color="#020617" />
          </mesh>

          {/* Hands */}
          <mesh position={[-0.6, -0.1, 0.1]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.8} />
          </mesh>

          {/* Microphone */}
          <group ref={micRef} position={[0.55, -0.1, 0.15]}>
            <mesh>
              <sphereGeometry args={[0.09, 16, 16]} />
              <meshStandardMaterial color="#38bdf8" metalness={0.8} />
            </mesh>
            <mesh position={[0.08, 0.12, 0.1]} rotation={[0.4, 0, -0.2]}>
              <cylinderGeometry args={[0.025, 0.02, 0.22, 16]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} />
            </mesh>
            <mesh position={[0.12, 0.25, 0.15]}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshBasicMaterial color={state === 'listening' ? '#f59e0b' : '#22d3ee'} />
            </mesh>
          </group>

          {/* Bottom Jet Ring Light */}
          <mesh position={[0, -0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.28, 0.04, 16, 32]} />
            <meshBasicMaterial color="#22d3ee" />
          </mesh>
        </group>
      </group>
    </Float>
  )
}
