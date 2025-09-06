export const WIDTH = 10
export const HEIGHT = 20

export type Cell = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
export type Rot = 0 | 1 | 2 | 3

export type Piece = {
  x: number
  y: number
  shape: number[][]
  kind: Cell
  rot: Rot
}

const SHAPES: Record<Cell, number[][][]> = {
  1: [ // I
    [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    [[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
    [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],
    [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
  ],
  2: [ // O
    [[2,2],[2,2]],[[2,2],[2,2]],[[2,2],[2,2]],[[2,2],[2,2]],
  ],
  3: [ // T
    [[0,3,0],[3,3,3],[0,0,0]],
    [[0,3,0],[0,3,3],[0,3,0]],
    [[0,0,0],[3,3,3],[0,3,0]],
    [[0,3,0],[3,3,0],[0,3,0]],
  ],
  4: [ // S
    [[0,4,4],[4,4,0],[0,0,0]],
    [[0,4,0],[0,4,4],[0,0,4]],
    [[0,0,0],[0,4,4],[4,4,0]],
    [[4,0,0],[4,4,0],[0,4,0]],
  ],
  5: [ // Z
    [[5,5,0],[0,5,5],[0,0,0]],
    [[0,0,5],[0,5,5],[0,5,0]],
    [[0,0,0],[5,5,0],[0,5,5]],
    [[0,5,0],[5,5,0],[5,0,0]],
  ],
  6: [ // J
    [[6,0,0],[6,6,6],[0,0,0]],
    [[0,6,6],[0,6,0],[0,6,0]],
    [[0,0,0],[6,6,6],[0,0,6]],
    [[0,6,0],[0,6,0],[6,6,0]],
  ],
  7: [ // L
    [[0,0,7],[7,7,7],[0,0,0]],
    [[0,7,0],[0,7,0],[0,7,7]],
    [[0,0,0],[7,7,7],[7,0,0]],
    [[7,7,0],[0,7,0],[0,7,0]],
  ],
  0: [[[0]]] // dummy
}

const KINDS: Cell[] = [1,2,3,4,5,6,7]

export function createPiece(): Piece {
  const kind = KINDS[(Math.random()*KINDS.length)|0]
  const shape = SHAPES[kind][0]
  const w = shape[0].length
  return { x: ((WIDTH - w)/2)|0, y: 0, shape, kind, rot: 0 }
}

export function rotatePiece(p: Piece): Piece {
  const nextRot = ((p.rot + 1) % 4) as Rot
  const shape = SHAPES[p.kind][nextRot]
  return { ...p, shape, rot: nextRot }
}

export function canMove(p: Piece, grid: Cell[][], dx: number, dy: number): boolean {
  const h = p.shape.length
  const w = p.shape[0].length
  for (let y=0; y<h; y++) {
    for (let x=0; x<w; x++) {
      const cell = p.shape[y][x]
      if (!cell) continue
      const nx = p.x + x + dx
      const ny = p.y + y + dy
      if (ny >= HEIGHT) return false
      if (nx < 0 || nx >= WIDTH) return false
      if (ny >= 0 && grid[ny][nx]) return false
    }
  }
  return true
}

export function mergePiece(p: Piece, grid: Cell[][]) {
  const next = grid.map(r => r.slice())
  const h = p.shape.length
  const w = p.shape[0].length
  for (let y=0; y<h; y++) {
    for (let x=0; x<w; x++) {
      const cell = p.shape[y][x]
      if (!cell) continue
      const gx = p.x + x
      const gy = p.y + y
      if (gy >= 0 && gy < HEIGHT && gx >= 0 && gx < WIDTH) next[gy][gx] = p.kind
    }
  }
  return next
}

export function clearLines(grid: Cell[][]) {
  const remain: Cell[][] = []
  let clearedCount = 0
  for (let y=0; y<HEIGHT; y++) {
    if (grid[y].every(c => c !== 0)) {
      console.log('Clearing line:', y, grid[y])
      clearedCount++
    } else {
      remain.push(grid[y])
    }
  }
  console.log('Lines cleared:', clearedCount, 'Grid rows before:', grid.length, 'after:', remain.length)
  while (remain.length < HEIGHT) remain.unshift(Array.from({ length: WIDTH }, () => 0))
  return { grid: remain, clearedCount }
}