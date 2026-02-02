# ParallaX-Vision

## 概要

ユーザーの顔の向きに合わせて画面上の要素が動く「視線連動型パララックスWebサイト」のプロトタイプです。
React, MediaPipe, Framer Motion を使用し、ブラウザのみでリアルタイムな顔追跡と視差効果を実現しています。

## 機能

- **リアルタイム顔追跡**: Webカメラ映像から顔の Yaw/Pitch を取得。
- **デバッグパネル**: 現在の検出角度を表示し、感度(Sensitivity)とゼロ点オフセット(Reset Calibration)を調整可能。
- **視差効果**: 3Dカードと背景要素が顔の動きに合わせてスムーズに移動・回転。

## 実行方法

### 1. フロントエンド起動 (開発モード)

```bash
cd frontend
npm run dev
```

ブラウザで `http://localhost:5173` を開き、カメラへのアクセスを許可してください。

### 2. バックエンド/全体ビルド (Docker)

```bash
docker build -t parallax-vision .
docker run -p 8080:8080 parallax-vision
```

`http://localhost:8080` で動作します。

## 構成

- `frontend/`: React + Vite + Tailwind CSS
- `backend/`: FastAPI (静的ファイル配信 + API)
- `Dockerfile`: マルチステージビルド対応

## デバッグのヒント

- 画面右上の "Debug Mode" チェックボックスでパネルの表示/非表示を切り替えられます。
- 初期位置がずれている場合は、デバッグパネル右上のリセットボタン(🔄)を押してキャリブレーションしてください。
