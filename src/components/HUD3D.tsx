import { useGame3D } from '../store/useGame3D'

export function HUD3D() {
  const { score, level, lines, gameOver, reset } = useGame3D()
  return (
    <div className="hud">
      <div className="panel">
        <div className="row" style={{ justifyContent: 'space-between', minWidth: 280 }}>
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
          <strong>3D TETRIS</strong><br/>
          <strong>ピース操作:</strong> ←/→: Move X　↑/↓: Rotate/Down　Q/E: Move Z<br/>
          Z/X: Rotate XY　Space: Drop　C: Hold　R: Restart<br/>
          <strong>カメラ操作:</strong> I/K: 上下　J/L: 左右回転　U/O: ズーム　V: リセット
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