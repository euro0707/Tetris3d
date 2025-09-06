import { useMemo } from 'react'
import { useGame3DShallow } from '../store/useGame3D'
import { WIDTH, HEIGHT, DEPTH, type Cell } from '../systems/logic3d'

const COLORS: Record<Cell, string> = {
  0: '#000000', 1: '#00ffff', 2: '#ffff00', 3: '#ff00ff', 4: '#00ff00', 5: '#ff0000', 6: '#0000ff', 7: '#ff8000'
}

export function ActivePiece3D() {
  const piece = useGame3DShallow(s => s.piece)
  
  const nodes = useMemo(() => {
    if (!piece) return null
    
    const list: JSX.Element[] = []
    const tile = 0.9
    const sy = piece.shape.length
    const sz = piece.shape[0].length
    const sx = piece.shape[0][0].length
    
    for (let y=0; y<sy; y++) {
      for (let z=0; z<sz; z++) {
        for (let x=0; x<sx; x++) {
          const v = piece.shape[y][z][x]
          if (!v) continue
          
          const gx = piece.x + x
          const gy = piece.y + y
          const gz = piece.z + z
          
          // 3D座標変換
          const posX = gx - WIDTH/2 + 0.5
          const posY = HEIGHT/2 - gy - 0.5
          const posZ = gz - DEPTH/2 + 0.5
          
          list.push(
            <mesh 
              key={`p-${gx}-${gy}-${gz}`} 
              position={[posX, posY, posZ]} 
              castShadow 
              receiveShadow
            >
              <boxGeometry args={[tile, tile, tile]} />
              <meshStandardMaterial 
                metalness={0.25} 
                roughness={0.3} 
                color={COLORS[piece.kind]} 
              />
            </mesh>
          )
        }
      }
    }
    return list
  }, [piece])

  return <group>{nodes}</group>
}