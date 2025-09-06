export const WIDTH = 10
export const HEIGHT = 20
export const DEPTH = 6

export type Cell = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
export type Grid3D = Cell[][][]  // [y][z][x]

export type Piece3D = {
  x: number
  y: number
  z: number
  shape: number[][][]  // [sy][sz][sx]
  kind: Cell
  rotX: number  // X軸回転 (0,1,2,3)
  rotY: number  // Y軸回転 (0,1,2,3)
  rotZ: number  // Z軸回転 (0,1,2,3)
}

// 3Dテトリミノ形状 [rotations][y][z][x] 
const SHAPES_3D: Record<Cell, number[][][][]> = {
  1: [ // I - 縦棒 (4x1x1)
    [
      [[1]], // y=0, z=0, x=0
      [[1]], // y=1, z=0, x=0  
      [[1]], // y=2, z=0, x=0
      [[1]]  // y=3, z=0, x=0
    ]
  ],
  2: [ // O - 小立方体 (2x2x1)
    [
      [[2,2]], // y=0, z=0, x=0,1
      [[2,2]]  // y=1, z=0, x=0,1
    ]
  ],
  3: [ // T - T字型 (2x1x3)
    [
      [[3,3,3]], // y=0, z=0, x=0,1,2
      [[0,3,0]]  // y=1, z=0, x=0,1,2
    ]
  ],
  4: [ // L - L字型 (2x1x3)
    [
      [[4,4,4]], // y=0, z=0, x=0,1,2
      [[4,0,0]]  // y=1, z=0, x=0,1,2
    ]
  ],
  5: [ // J - J字型 (2x1x3)
    [
      [[5,5,5]], // y=0, z=0, x=0,1,2
      [[0,0,5]]  // y=1, z=0, x=0,1,2
    ]
  ],
  6: [ // S - S字型 (2x1x3)
    [
      [[0,6,6]], // y=0, z=0, x=0,1,2
      [[6,6,0]]  // y=1, z=0, x=0,1,2
    ]
  ],
  7: [ // Z - Z字型 (2x1x3)
    [
      [[7,7,0]], // y=0, z=0, x=0,1,2
      [[0,7,7]]  // y=1, z=0, x=0,1,2
    ]
  ],
  0: [[[[0]]]] // dummy
}

const KINDS: Cell[] = [1,2,3,4,5,6,7]

export function createPiece3D(): Piece3D {
  const kind = KINDS[(Math.random()*KINDS.length)|0]
  console.log('Creating 3D piece, kind:', kind, 'available kinds:', KINDS)
  const shape = SHAPES_3D[kind][0]  // 基本回転状態
  const sy = shape.length
  const sz = shape[0].length
  const sx = shape[0][0].length
  
  console.log('3D piece shape dimensions:', { sx, sy, sz, kind })
  
  return { 
    x: ((WIDTH - sx)/2)|0, 
    y: 0, 
    z: ((DEPTH - sz)/2)|0,
    shape, 
    kind, 
    rotX: 0, 
    rotY: 0, 
    rotZ: 0 
  }
}

export function canMove3D(p: Piece3D, grid: Grid3D, dx: number, dy: number, dz: number): boolean {
  const sy = p.shape.length
  const sz = p.shape[0].length
  const sx = p.shape[0][0].length
  
  for (let y=0; y<sy; y++) {
    for (let z=0; z<sz; z++) {
      for (let x=0; x<sx; x++) {
        const cell = p.shape[y][z][x]
        if (!cell) continue
        
        const nx = p.x + x + dx
        const ny = p.y + y + dy
        const nz = p.z + z + dz
        
        // 境界チェック
        if (nx < 0 || nx >= WIDTH) return false
        if (ny >= HEIGHT) return false
        if (nz < 0 || nz >= DEPTH) return false
        
        // 既存ブロックとの衝突チェック
        if (ny >= 0 && grid[ny][nz][nx]) return false
      }
    }
  }
  return true
}

export function mergePiece3D(p: Piece3D, grid: Grid3D): Grid3D {
  const next = grid.map(plane => plane.map(row => row.slice()))
  const sy = p.shape.length
  const sz = p.shape[0].length
  const sx = p.shape[0][0].length
  
  for (let y=0; y<sy; y++) {
    for (let z=0; z<sz; z++) {
      for (let x=0; x<sx; x++) {
        const cell = p.shape[y][z][x]
        if (!cell) continue
        
        const gx = p.x + x
        const gy = p.y + y
        const gz = p.z + z
        
        if (gy >= 0 && gy < HEIGHT && gz >= 0 && gz < DEPTH && gx >= 0 && gx < WIDTH) {
          next[gy][gz][gx] = p.kind
        }
      }
    }
  }
  return next
}

export function clearLines3D(grid: Grid3D): { grid: Grid3D, clearedCount: number } {
  const remain: Cell[][][] = []
  let clearedCount = 0
  
  // Y軸方向にスキャンして、XZ平面が完全に埋まっているかチェック
  for (let y=0; y<HEIGHT; y++) {
    let planeFull = true
    for (let z=0; z<DEPTH && planeFull; z++) {
      for (let x=0; x<WIDTH && planeFull; x++) {
        if (grid[y][z][x] === 0) planeFull = false
      }
    }
    
    if (planeFull) {
      console.log('Clearing 3D plane at y:', y)
      clearedCount++
    } else {
      remain.push(grid[y])
    }
  }
  
  // 空いた分を上から空のプレーンで埋める
  while (remain.length < HEIGHT) {
    const emptyPlane: Cell[][] = Array.from({ length: DEPTH }, () => Array.from({ length: WIDTH }, () => 0))
    remain.unshift(emptyPlane)
  }
  
  console.log('3D Lines cleared:', clearedCount)
  return { grid: remain, clearedCount }
}

// 3軸回転機能
export function rotatePiece3D(p: Piece3D, axis: 'X'|'Y'|'Z' = 'Z'): Piece3D {
  console.log('Rotating piece around', axis, 'axis')
  
  if (axis === 'Z') {
    const rotated = rotateShapeZ(p.shape)
    return { ...p, shape: rotated, rotZ: (p.rotZ + 1) % 4 }
  } else if (axis === 'X') {
    const rotated = rotateShapeX(p.shape)
    return { ...p, shape: rotated, rotX: (p.rotX + 1) % 4 }
  } else if (axis === 'Y') {
    const rotated = rotateShapeY(p.shape)
    return { ...p, shape: rotated, rotY: (p.rotY + 1) % 4 }
  }
  return p
}

function rotateShapeZ(shape: number[][][]): number[][][] {
  const sy = shape.length
  const sz = shape[0].length
  const sx = shape[0][0].length
  
  // Z軸回転: XY平面内での90度回転
  const rotated: number[][][] = Array.from({ length: sy }, () => 
    Array.from({ length: sz }, () => 
      Array.from({ length: sx }, () => 0)
    )
  )
  
  for (let y=0; y<sy; y++) {
    for (let z=0; z<sz; z++) {
      for (let x=0; x<sx; x++) {
        // 90度回転: (x,z) -> (z, sx-1-x)
        rotated[y][x][sz-1-z] = shape[y][z][x]
      }
    }
  }
  
  return rotated
}

function rotateShapeX(shape: number[][][]): number[][][] {
  const sy = shape.length
  const sz = shape[0].length
  const sx = shape[0][0].length
  
  // X軸回転: YZ平面内での90度回転
  const rotated: number[][][] = Array.from({ length: sz }, () => 
    Array.from({ length: sy }, () => 
      Array.from({ length: sx }, () => 0)
    )
  )
  
  for (let y=0; y<sy; y++) {
    for (let z=0; z<sz; z++) {
      for (let x=0; x<sx; x++) {
        // X軸回転: (y,z) -> (z, sy-1-y)
        rotated[z][sy-1-y][x] = shape[y][z][x]
      }
    }
  }
  
  return rotated
}

function rotateShapeY(shape: number[][][]): number[][][] {
  const sy = shape.length
  const sz = shape[0].length
  const sx = shape[0][0].length
  
  // Y軸回転: XZ平面内での90度回転
  const rotated: number[][][] = Array.from({ length: sy }, () => 
    Array.from({ length: sx }, () => 
      Array.from({ length: sz }, () => 0)
    )
  )
  
  for (let y=0; y<sy; y++) {
    for (let z=0; z<sz; z++) {
      for (let x=0; x<sx; x++) {
        // Y軸回転: (x,z) -> (sz-1-z, x)
        rotated[y][x][sz-1-z] = shape[y][z][x]
      }
    }
  }
  
  return rotated
}