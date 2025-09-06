import React, { useMemo } from 'react'
import { useGameShallow } from '../store/useGame'
import { WIDTH, HEIGHT, type Cell } from '../systems/logic'

const COLORS: Record<Cell, string> = {
  0: '#000000', 1: '#4cc9f0', 2: '#f1fa8c', 3: '#b388ff', 4: '#80ed99', 5: '#ff7b7b', 6: '#7aa2f7', 7: '#f4a261'
}

export function ActivePiece3D() {
  const piece = useGameShallow(s => s.piece)
  const nodes = useMemo(() => {
    if (!piece) return null
    
    const list: React.ReactElement[] = []
    const tile = 0.9
    for (let y=0; y<piece.shape.length; y++) for (let x=0; x<piece.shape[0].length; x++) {
      const v = piece.shape[y][x]
      if (!v) continue
      const gx = piece.x + x
      const gy = piece.y + y
      list.push(
        <mesh key={`p-${gx}-${gy}`} position={[gx - WIDTH/2 + 0.5, HEIGHT/2 - gy - 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[tile, tile, tile]} />
          <meshStandardMaterial metalness={0.25} roughness={0.3} color={COLORS[piece.kind]} />
        </mesh>
      )
    }
    return list
  }, [piece])

  return <group>{nodes}</group>
}