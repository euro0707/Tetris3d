import { useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGame3DShallow } from '../store/useGame3D'
import { WIDTH, HEIGHT, DEPTH, type Cell } from '../systems/logic3d'

const COLORS: Record<Cell, string> = {
  0: '#000000',
  1: '#00ffff', // I - シアン
  2: '#ffff00', // O - 黄色
  3: '#ff00ff', // T - マゼンタ
  4: '#00ff00', // S - 緑
  5: '#ff0000', // Z - 赤
  6: '#0000ff', // J - 青
  7: '#ff8000', // L - オレンジ
}

export function Board3D() {
  const grid = useGame3DShallow(s => s.grid)
  const { viewport } = useThree()

  const cells = useMemo(() => {
    const meshes: JSX.Element[] = []
    const tile = 0.9
    
    for (let y=0; y<HEIGHT; y++) {
      for (let z=0; z<DEPTH; z++) {
        for (let x=0; x<WIDTH; x++) {
          const c = grid[y][z][x]
          if (!c) continue
          
          // 3D座標変換
          const posX = x - WIDTH/2 + 0.5
          const posY = HEIGHT/2 - y - 0.5
          const posZ = z - DEPTH/2 + 0.5
          
          meshes.push(
            <mesh 
              key={`g-${x}-${y}-${z}`} 
              position={[posX, posY, posZ]} 
              castShadow 
              receiveShadow
            >
              <boxGeometry args={[tile, tile, tile]} />
              <meshStandardMaterial 
                metalness={0.2} 
                roughness={0.35} 
                color={COLORS[c]} 
              />
            </mesh>
          )
        }
      }
    }
    return meshes
  }, [grid])

  return (
    <group>
      {/* 床 */}
      <mesh position={[0, -HEIGHT/2 - 1, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
        <planeGeometry args={[WIDTH+2, DEPTH+2]} />
        <meshStandardMaterial color="#0e1424" metalness={0.1} roughness={0.9} />
      </mesh>
      
      {cells}
      
      {/* 3Dグリッドヘルパー（XZ平面） */}
      <gridHelper 
        args={[Math.max(WIDTH, DEPTH), Math.max(WIDTH, DEPTH), 'white', '#1b2640']} 
        position={[0, -HEIGHT/2 - 0.5, 0]} 
      />
      
      {/* 3D空間の枠線表示（オプション） */}
      <group>
        {/* 側面の枠線 */}
        <lineSegments>
          <edgesGeometry 
            args={[
              new THREE.BoxGeometry(WIDTH, HEIGHT, DEPTH)
            ]} 
          />
          <lineBasicMaterial color="#333" />
        </lineSegments>
      </group>
    </group>
  )
}