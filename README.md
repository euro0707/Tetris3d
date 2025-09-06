# 3D Tetris

本格的な3Dテトリスゲーム。React + Three.js + TypeScriptで構築された完全な3D空間でのテトリス体験を提供します。

![3D Tetris Screenshot](https://via.placeholder.com/800x400/0b0f1a/ffffff?text=3D+Tetris+Game)

## 🎮 特徴

- **完全3Dゲームプレイ**: 10x20x6の3次元グリッドでのテトリス
- **7種類のテトリミノ**: 伝統的なテトリスピース（I, O, T, S, Z, J, L）
- **3軸回転システム**: X, Y, Z軸での自由な回転操作
- **インタラクティブカメラ**: 自由な視点移動とズーム機能
- **リアルタイム3Dレンダリング**: 影とライティングによる美しい3D描画
- **鮮やかな色彩**: 識別しやすい原色カラーパレット
- **現代的UI**: スコア、レベル、ライン数のリアルタイム表示

## 🎯 操作方法

### ピース操作
- `←/→` : X軸方向への移動
- `↑/↓` : Z軸回転 / 下方向への移動
- `Q/E` : Z軸（奥行き）方向への移動
- `Z/X` : X軸/Y軸回転
- `Space` : ハードドロップ
- `C` : ホールド機能
- `R` : ゲームリスタート

### カメラ操作
- `I/K` : カメラの上下移動
- `J/L` : カメラの左右回転
- `U/O` : ズームイン/ズームアウト
- `V` : カメラ位置リセット

## 🚀 セットアップ

### 必要な環境
- Node.js 18+
- npm または yarn

### インストール
```bash
# リポジトリをクローン
git clone https://github.com/euro0707/Tetris3d.git
cd Tetris3d

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

### ビルド
```bash
# 本番用ビルド
npm run build

# プレビュー
npm run preview
```

## 🛠️ 技術スタック

- **React 18** - UIフレームワーク
- **TypeScript** - 型安全な開発
- **Three.js** - 3Dグラフィックスライブラリ
- **@react-three/fiber** - React用Three.jsレンダラー
- **@react-three/drei** - 3Dコンポーネントユーティリティ
- **Zustand** - 状態管理
- **Vite** - 高速ビルドツール

## 📁 プロジェクト構造

```
src/
├── components/          # React コンポーネント
│   ├── Board3D_new.tsx     # 3D ゲームボード
│   ├── ActivePiece3D_new.tsx # アクティブピース
│   ├── CameraController.tsx # カメラ制御
│   └── HUD3D.tsx           # UI表示
├── systems/             # ゲームロジック
│   └── logic3d.ts          # 3D テトリス ロジック
├── store/               # 状態管理
│   └── useGame3D.ts        # ゲーム状態
└── App_3D.tsx           # メインアプリ
```

## 🎨 色設定

各テトリミノには識別しやすい原色が設定されています：

- **I ピース**: シアン (#00ffff)
- **O ピース**: 黄色 (#ffff00)  
- **T ピース**: マゼンタ (#ff00ff)
- **S ピース**: 緑 (#00ff00)
- **Z ピース**: 赤 (#ff0000)
- **J ピース**: 青 (#0000ff)
- **L ピース**: オレンジ (#ff8000)

## 🤝 貢献

プルリクエストや問題報告はいつでも歓迎します。

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🙏 謝辞

このプロジェクトは[Claude Code](https://claude.ai/code)によって生成されました。

---

*🤖 Generated with [Claude Code](https://claude.ai/code)*