import { create } from 'zustand'
import { 
  createPiece3D, rotatePiece3D, canMove3D, mergePiece3D, clearLines3D, 
  WIDTH, HEIGHT, DEPTH, type Piece3D, type Grid3D 
} from '../systems/logic3d'

type State3D = {
  grid: Grid3D
  piece: Piece3D | null
  hold: Piece3D | null
  score: number
  level: number
  lines: number
  gameOver: boolean
  tickMs: number
  lastFall: number
  init: () => void
  step: (ts: number) => void
  move: (dx: number, dy: number, dz: number) => void
  rotate: (axis?: 'X'|'Y'|'Z') => void
  hardDrop: () => void
  holdSwap: () => void
  reset: () => void
}

export const useGame3D = create<State3D>((set, get) => ({
  grid: Array.from({ length: HEIGHT }, () => 
    Array.from({ length: DEPTH }, () => 
      Array.from({ length: WIDTH }, () => 0)
    )
  ),
  piece: null,
  hold: null,
  score: 0,
  level: 1,
  lines: 0,
  gameOver: false,
  tickMs: 700,
  lastFall: 0,
  
  init: () => {
    set({ score: 0, level: 1, lines: 0, gameOver: false })
    set({ 
      grid: Array.from({ length: HEIGHT }, () => 
        Array.from({ length: DEPTH }, () => 
          Array.from({ length: WIDTH }, () => 0)
        )
      )
    })
    set({ piece: createPiece3D() })
  },
  
  reset: () => get().init(),
  
  step: (ts) => {
    const { lastFall, tickMs, piece, grid, gameOver } = get()
    if (gameOver || !piece) return
    if (ts - lastFall < tickMs) return
    
    // 自動下降
    console.log('3D Auto-fall attempt, current y:', piece.y)
    if (canMove3D(piece, grid, 0, 1, 0)) {
      console.log('3D Auto-fall successful, moving to y:', piece.y + 1)
      set({ piece: { ...piece, y: piece.y + 1 }, lastFall: ts })
    } else {
      // ピース固定
      const merged = mergePiece3D(piece, grid)
      console.log('3D Piece locked, checking for lines...')
      const { grid: cleared, clearedCount } = clearLines3D(merged)
      
      const linesInc = clearedCount
      const scoreInc = [0, 100, 300, 500, 800][clearedCount] || 0
      const lines = get().lines + linesInc
      const level = 1 + Math.floor(lines / 10)
      const tickMs = Math.max(120, 700 - (level - 1) * 50)
      
      console.log('3D Score update:', { clearedCount, scoreInc, newScore: get().score + scoreInc, newLines: lines })
      set({ grid: cleared, score: get().score + scoreInc, lines, level, tickMs })
      
      const next = createPiece3D()
      if (!canMove3D(next, cleared, 0, 0, 0)) {
        set({ gameOver: true })
      } else {
        set({ piece: next })
      }
      set({ lastFall: ts })
    }
  },
  
  move: (dx, dy, dz) => {
    const { piece, grid, gameOver } = get()
    if (!piece || gameOver) return
    
    console.log('3D Move attempt:', { dx, dy, dz, currentPos: { x: piece.x, y: piece.y, z: piece.z } })
    if (canMove3D(piece, grid, dx, dy, dz)) {
      const newPos = { x: piece.x + dx, y: piece.y + dy, z: piece.z + dz }
      console.log('3D Move successful:', newPos)
      set({ piece: { ...piece, x: newPos.x, y: newPos.y, z: newPos.z } })
    } else {
      console.log('3D Move blocked!')
    }
  },
  
  rotate: (axis = 'Z') => {
    const { piece, grid, gameOver } = get()
    if (!piece || gameOver) return
    
    const rotated = rotatePiece3D(piece, axis)
    if (canMove3D(rotated, grid, 0, 0, 0)) {
      set({ piece: rotated })
    }
  },
  
  hardDrop: () => {
    const { piece, grid, step } = get()
    if (!piece) return
    
    let p = piece
    while (canMove3D(p, grid, 0, 1, 0)) p = { ...p, y: p.y + 1 }
    set({ piece: p })
    step(performance.now())
  },
  
  holdSwap: () => {
    const { hold, piece, grid } = get()
    if (!piece) return
    
    const next = hold ? { ...hold, x: piece.x, y: 0, z: piece.z } : createPiece3D()
    if (canMove3D(next, grid, 0, 0, 0)) {
      set({ 
        hold: { ...piece, x: 0, y: 0, z: 0 }, 
        piece: next 
      })
    }
  }
}))

// 自動ゲームループ
let raf = 0
function loop(ts: number) {
  const { step } = useGame3D.getState()
  step(ts)
  raf = requestAnimationFrame(loop)
}

if (typeof window !== 'undefined') {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(loop)
}

// 3Dキー入力
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    const g = useGame3D.getState()
    if (g.gameOver && e.key === 'r') return g.reset()
    
    // 既存の操作
    if (e.key === 'ArrowLeft' || e.key === 'a') g.move(-1, 0, 0)   // 左
    if (e.key === 'ArrowRight' || e.key === 'd') g.move(1, 0, 0)   // 右
    if (e.key === 'ArrowDown' || e.key === 's') g.move(0, 1, 0)    // 下
    if (e.key === 'ArrowUp' || e.key === 'w') g.rotate('Z')        // Z軸回転
    
    // 新しい3D操作
    if (e.key === 'q' || e.key === 'Q') g.move(0, 0, -1)  // 奥へ
    if (e.key === 'e' || e.key === 'E') g.move(0, 0, 1)   // 手前へ
    if (e.key === 'z' || e.key === 'Z') {
      console.log('Z key pressed - X axis rotation')
      g.rotate('X')     // X軸回転
    }
    if (e.key === 'x' || e.key === 'X') {
      console.log('X key pressed - Y axis rotation')
      g.rotate('Y')     // Y軸回転
    }
    
    // その他
    if (e.key === ' ') g.hardDrop()
    if (e.key.toLowerCase() === 'c') g.holdSwap()
    if (e.key.toLowerCase() === 'r') g.reset()
  })
}

export const useGame3DShallow = <T,>(sel: (s: State3D) => T) => useGame3D(sel)