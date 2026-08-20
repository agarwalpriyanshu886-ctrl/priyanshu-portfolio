import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text, Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function CreativeParticles() {
  const pointsRef = useRef<THREE.Points>(null)
  const count = 500
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 18
    positions[i * 3 + 1] = (Math.random() - 0.5) * 18
    positions[i * 3 + 2] = (Math.random() - 0.5) * 18
  }

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y -= delta * 0.06
      pointsRef.current.rotation.z += delta * 0.03
    }
  })

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ec4899"
        size={0.08}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  )
}

function Floating3DTypography() {
  return (
    <group position={[0, 0, -2]}>
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
        <Text
          position={[-3.5, 2.5, -2]}
          fontSize={0.8}
          color="#a855f7"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZJhiI2B.woff2"
        >
          CREATE
        </Text>
      </Float>
      <Float speed={1.8} rotationIntensity={0.5} floatIntensity={0.7}>
        <Text
          position={[3.2, -2.2, -2]}
          fontSize={0.75}
          color="#ec4899"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZJhiI2B.woff2"
        >
          DESIGN
        </Text>
      </Float>
    </group>
  )
}

export function CreativeWorld3D() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={1.5} color="#ec4899" />
      <pointLight position={[-10, -5, -5]} intensity={1} color="#a855f7" />
      <CreativeParticles />
      <Floating3DTypography />
    </>
  )
}
