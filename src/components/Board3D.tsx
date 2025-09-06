import React, { useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { useGameShallow } from '../store/useGame'
import { WIDTH, HEIGHT, type Cell } from '../systems/logic'

const COLORS: Record<Cell, string> = {
  0: '#000000',
  1: '#4cc9f0', // I
  2: '#f1fa8c', // O
  3: '#b388ff', // T
  4: '#80ed99', // S
  5: '#ff7b7b', // Z
  6: '#7aa2f7', // J
  7: '#f4a261', // L
}

export function Board3D() {
  const grid = useGameShallow(s => s.grid)
  const {} = useThree()

  const cells = useMemo(() => {
    const meshes: React.ReactElement[] = []
    const tile = 0.9
    for (let y=0; y<HEIGHT; y++) for (let x=0; x<WIDTH; x++) {
      const c = grid[y][x]
      if (!c) continue
      meshes.push(
        <mesh key={`g-${x}-${y}`} position={[x - WIDTH/2 + 0.5, HEIGHT/2 - y - 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[tile, tile, tile]} />
          <meshStandardMaterial metalness={0.2} roughness={0.35} color={COLORS[c]} />
        </mesh>
      )
    }
    return meshes
  }, [grid])

  return (
    <group>
      {/* 床 */}
      <mesh position={[0, -HEIGHT/2 - 1, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
        <planeGeometry args={[WIDTH+2, HEIGHT+4]} />
        <meshStandardMaterial color="#0e1424" metalness={0.1} roughness={0.9} />
      </mesh>
      {cells}
      {/* 枠線 */}
      <gridHelper args={[Math.max(WIDTH, HEIGHT), Math.max(WIDTH, HEIGHT), 'white', '#1b2640']} position={[0, 0, -0.5]} />
    </group>
  )
}