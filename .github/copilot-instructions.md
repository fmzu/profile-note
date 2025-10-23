---
applyTo: "**/*"
---

# Overview
MyProfileNote は、スマホ向け縦長カードに最大4つの「好き」カテゴリを配置し、プロフィールカードをその場で画像保存できるSPAです。やさしい文体と即時プレビューを備え、Cloudflare Workers 連携を視野に入れた拡張性の高い構成を目指します。

## Directory Structure
- `src/routes`: 4ページ構成（`index.tsx` `/`, `select.tsx` `/select`, `create.tsx` `/create`, `done.tsx` `/done`）
- `src/components`: 入力フォーム、プレビューカード、共通UI部品を配置
- `src/lib`: 状態更新ロジック、html-to-image ラッパー、Hono 用エントリ
- `src/store`: Zustand + Reducer ストア
- `src/types`: `profile.ts` などドメイン型定義
- `src/styles/app.css`: Tailwind カスタムレイヤ
- `public/`: パステルトーンの静的アセット

## Technical Features
- React 19 + TypeScript 5 + Vite 7
- @tanstack/react-router によるルーティング
- Zustand（Reducer パターン）でページ間状態を保持
- Tailwind CSS で無地パステル／角丸／余白16pxを実現
- html-to-image でプレビューを PNG ダウンロード
- 単体テスト（Reducer）とE2E（入力〜保存）を npm scripts で実行
- Cloudflare Pages + Workers（Hono）展開を見据えた構成

## Decoupled Design
- ルートはフロー制御に専念し、UI は `src/components` のプレゼンテーション層へ委譲
- 状態更新は `src/store/profile-store.ts` の Reducer 経由に限定し、副作用は `src/lib` のユーティリティで隔離
- html-to-image やダウンロード処理はファサード経由で呼び出し、テスト容易性を確保
- Cloudflare Workers 連携は `src/lib/hono` に分離し、ブラウザ機能と疎結合を維持

## Core Location
- ドメイン型: `src/types/profile.ts`
- 状態管理: `src/store/profile-store.ts`
- UI コンポーネント: `src/components/profile-card.tsx`, `src/components/category-selector.tsx`, `src/components/profile-form.tsx`
- 画面ロジック: `src/routes/index.tsx`, `src/routes/select.tsx`, `src/routes/create.tsx`, `src/routes/done.tsx`
- 画像出力: `src/lib/html-to-image-client.ts`
- テスト: `src/store/profile-store.test.ts`, `e2e/profile-card.spec.ts`

## System Independence
- `npm run dev` でローカル動作（ブラウザ内完結）
- ブラウザAPIのみでプレビュー生成と状態保持が完結し、オフラインでもフローが成立
- Cloudflare 連携はオプションであり、未接続でも既存UXに影響しない
