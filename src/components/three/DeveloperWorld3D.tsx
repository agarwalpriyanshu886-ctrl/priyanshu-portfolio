import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function NeuralNetworkPoints() {
  const pointsRef = useRef<THREE.Points>(null)

  // Generate 600 neural particle points
  const count = 600
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 16
    positions[i * 3 + 1] = (Math.random() - 0.5) * 16
    positions[i * 3 + 2] = (Math.random() - 0.5) * 16
  }

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.08
      pointsRef.current.rotation.x += delta * 0.04
    }
  })

  return (
    <group>
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#38bdf8"
          size={0.06}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.85}
        />
      </Points>
    </group>
  )
}

export function DeveloperWorld3D() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} color="#6366f1" />
      <pointLight position={[-10, -10, -5]} intensity={0.8} color="#22d3ee" />
      <NeuralNetworkPoints />
    </>
  )
}
