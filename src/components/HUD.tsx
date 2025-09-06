import { useGame } from '../store/useGame'

export function HUD() {
  const { score, level, lines, gameOver, reset } = useGame()
  return (
    <div className="hud">
      <div className="panel">
        <div className="row" style={{ justifyContent: 'space-between', minWidth: 220 }}>
          <div>
            <div>Score <span className="badge">{score}</span></div>
            <div>Level <span className="badge">{level}</span></div>
            <div>Lines <span className="badge">{lines}</span></div>
          </div>
          <div>
            <button className="btn" onClick={reset}>Restart (R)</button>
          </div>
        </div>
        <div style={{ marginTop: 8, fontSize: 12, opacity: .8 }}>
          ←/→/↓: Move　↑: Rotate　Space: HardDrop　C: Hold　R: Restart
        </div>
      </div>
      {gameOver && (
        <div className="center">
          <div className="panel" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Game Over</div>
            <button className="btn" onClick={reset}>Restart</button>
          </div>
        </div>
      )}
    </div>
  )
}