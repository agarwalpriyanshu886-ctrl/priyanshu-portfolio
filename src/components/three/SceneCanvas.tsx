import { useEffect, useState, ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
  } catch {
    return false
  }
}

export function SceneCanvas({ children, className = '' }: { children: ReactNode; className?: string }) {
  const [webGLSupported, setWebGLSupported] = useState(true)

  useEffect(() => {
    setWebGLSupported(isWebGLAvailable())
  }, [])

  if (!webGLSupported) {
    return (
      <div className={`pointer-events-none fixed inset-0 z-0 bg-slate-950 overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,transparent_70%)]" />
      </div>
    )
  }

  return (
    <div className={`pointer-events-none fixed inset-0 z-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: 'none' }}
      >
        {children}
      </Canvas>
    </div>
  )
}
