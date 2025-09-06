import { create } from 'zustand'
import { createPiece, rotatePiece, canMove, mergePiece, clearLines, WIDTH, HEIGHT, type Cell, type Piece } from '../systems/logic'

type State = {
  grid: Cell[][]
  piece: Piece | null
  hold: Piece | null
  score: number
  level: number
  lines: number
  gameOver: boolean
  tickMs: number
  lastFall: number
  init: () => void
  step: (ts: number) => void
  move: (dx: number, dy: number) => void
  rotate: () => void
  hardDrop: () => void
  holdSwap: () => void
  reset: () => void
}

export const useGame = create<State>((set, get) => ({
  grid: Array.from({ length: HEIGHT }, () => Array.from({ length: WIDTH }, () => 0)),
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
    set({ grid: Array.from({ length: HEIGHT }, () => Array.from({ length: WIDTH }, () => 0)) })
    set({ piece: createPiece() })
  },
  reset: () => get().init(),
  step: (ts) => {
    const { lastFall, tickMs, piece, grid, gameOver } = get()
    if (gameOver || !piece) return
    if (ts - lastFall < tickMs) return
    // try move down
    console.log('Auto-fall attempt, current y:', piece.y)
    if (canMove(piece, grid, 0, 1)) {
      console.log('Auto-fall successful, moving to y:', piece.y + 1)
      set({ piece: { ...piece, y: piece.y + 1 }, lastFall: ts })
    } else {
      // lock piece
      const merged = mergePiece(piece, grid)
      console.log('Piece locked, checking for lines...')
      const { grid: cleared, clearedCount } = clearLines(merged)
      const linesInc = clearedCount
      const scoreInc = [0, 100, 300, 500, 800][clearedCount] || 0
      const lines = get().lines + linesInc
      const level = 1 + Math.floor(lines / 10)
      const tickMs = Math.max(120, 700 - (level - 1) * 50)
      console.log('Score update:', { clearedCount, scoreInc, newScore: get().score + scoreInc, newLines: lines })
      set({ grid: cleared, score: get().score + scoreInc, lines, level, tickMs })
      const next = createPiece()
      if (!canMove(next, cleared, 0, 0)) {
        set({ gameOver: true })
      } else {
        set({ piece: next })
      }
      set({ lastFall: ts })
    }
  },
  move: (dx, dy) => {
    const { piece, grid, gameOver } = get()
    if (!piece || gameOver) return
    console.log('Move attempt:', { dx, dy, currentPos: { x: piece.x, y: piece.y } })
    if (canMove(piece, grid, dx, dy)) {
      const newPos = { x: piece.x + dx, y: piece.y + dy }
      console.log('Move successful:', newPos)
      set({ piece: { ...piece, x: newPos.x, y: newPos.y } })
    } else {
      console.log('Move blocked!')
    }
  },
  rotate: () => {
    const { piece, grid, gameOver } = get()
    if (!piece || gameOver) return
    const rotated = rotatePiece(piece)
    if (canMove(rotated, grid, 0, 0)) set({ piece: rotated })
  },
  hardDrop: () => {
    const { piece, grid, step } = get()
    if (!piece) return
    let p = piece
    while (canMove(p, grid, 0, 1)) p = { ...p, y: p.y + 1 }
    set({ piece: p })
    step(performance.now())
  },
  holdSwap: () => {
    const { hold, piece, grid } = get()
    if (!piece) return
    const next = hold ? { ...hold, x: piece.x, y: 0 } : createPiece()
    if (canMove(next, grid, 0, 0)) set({ hold: { ...piece, x: 0, y: 0 }, piece: next })
  }
}))

// 自動ゲームループ（requestAnimationFrame）
let raf = 0
function loop(ts: number) {
  const { step } = useGame.getState()
  step(ts)
  raf = requestAnimationFrame(loop)
}
if (typeof window !== 'undefined') {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(loop)
}

// キー入力
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    const g = useGame.getState()
    if (g.gameOver && e.key === 'r') return g.reset()
    if (e.key === 'ArrowLeft' || e.key === 'a') g.move(-1, 0)
    if (e.key === 'ArrowRight' || e.key === 'd') g.move(1, 0)
    if (e.key === 'ArrowDown' || e.key === 's') g.move(0, 1)
    if (e.key === 'ArrowUp' || e.key === 'w') g.rotate()
    if (e.key === ' ') g.hardDrop()
    if (e.key.toLowerCase() === 'c') g.holdSwap()
    if (e.key.toLowerCase() === 'r') g.reset()
  })
}

export const useGameShallow = <T,>(sel: (s: State) => T) => useGame(sel)