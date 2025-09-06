import { Canvas } from '@react-three/fiber'
import { Environment, SoftShadows } from '@react-three/drei'
import { Suspense, useEffect } from 'react'
import { useGame3D } from './store/useGame3D'
import { Board3D } from './components/Board3D_new'
import { ActivePiece3D } from './components/ActivePiece3D_new'
import { HUD3D } from './components/HUD3D'
import { CameraController } from './components/CameraController'

export default function App() {
  const init = useGame3D(s => s.init)
  useEffect(() => { init() }, [init])

  return (
    <>
      <Canvas shadows camera={{ position: [15, 18, 15], fov: 45 }}>
        <color attach="background" args={["#0b0f1a"]} />
        <SoftShadows size={40} samples={8} focus={0.8} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={1.0} castShadow />
        <Suspense>
          <Environment preset="city" />
        </Suspense>
        <Board3D />
        <ActivePiece3D />
        <CameraController />
      </Canvas>
      <HUD3D />
    </>
  )
}