import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls, SoftShadows } from '@react-three/drei'
import { Suspense, useEffect } from 'react'
import { useGame } from './store/useGame'
import { Board3D } from './components/Board3D'
import { ActivePiece3D } from './components/ActivePiece3D'
import { HUD } from './components/HUD'

export default function App() {
  const init = useGame(s => s.init)
  useEffect(() => { init() }, [init])

  return (
    <>
      <Canvas shadows camera={{ position: [10, 14, 16], fov: 40 }}>
        <color attach="background" args={["#0b0f1a"]} />
        <SoftShadows size={40} samples={8} focus={0.8} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={1.0} castShadow />
        <Suspense>
          <Environment preset="city" />
        </Suspense>
        <Board3D />
        <ActivePiece3D />
        <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI/4} maxPolarAngle={Math.PI/3} />
      </Canvas>
      <HUD />
    </>
  )
}