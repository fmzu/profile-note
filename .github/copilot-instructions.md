---
applyTo: "**/*"
---

# Overview
プロジェクトは複数のミニアプリを収めたフロントエンド集約体です。現在はプロフィール帳アプリ（MyProfileNote）が `/profile` 配下で稼働しており、今後ログインボーナス設定アプリを `/login-bonus` 配下に追加予定です。いずれのアプリもやさしい体験を目指し、将来的な Cloudflare Workers 連携に備えた構成にします。

## Directory Structure
- `src/routes/profile`: プロフィール帳向けのページ群（`index.tsx`, `select.tsx`, `create.tsx`, `done.tsx`）
- `src/routes/index.tsx`: ルート選択ページ（アプリの入口）
- `src/components`: 共通UI（プロフィールカード、カテゴリカードなど）
- `src/store`: Zustand（Reducerパターン）による共有ストア
- `src/types`: ドメイン型（プロフィール、カテゴリ、背景設定など）
- `src/lib`: html-to-image などのユーティリティ
- `public/`: パステルトーンの静的アセット
- `src/styles/app.css`: Tailwind カスタムレイヤ

## Technical Features
- React 19 + TypeScript 5 + Vite 7
- @tanstack/react-router のファイルベースルーティング
- Zustand + Reducer でアプリ間共有可能な状態管理を実装
- Tailwind CSS による柔らかなパステルUI
- html-to-image でプレビューを PNG ダウンロード
- npm scripts で Reducer 単体テストと E2E テストを実行予定
- Cloudflare Pages + Workers + Hono での将来展開を想定

## Decoupled Design
- ルートファイルはページフローに専念し、UI は `src/components` に集約
- 状態更新は `src/store/profile-context.tsx` の Reducer 経由に制限し、副作用は `src/lib` に切り出し
- html-to-image などブラウザ依存処理はファサード化してテスト容易性を確保
- 各アプリは独立ディレクトリ配下にまとめ、将来の `/login-bonus` 追加時も干渉しない構造を維持

## Core Location
- プロフィール型: `src/types/types.ts`
- プロフィール状態: `src/store/profile-context.tsx`
- プレビュー＆カテゴリUI: `src/components/profile-preview-card.tsx`, `src/components/category-toggle-card.tsx`
- プロフィールルート: `src/routes/profile/index.tsx`, `select.tsx`, `create.tsx`, `done.tsx`
- 画像保存処理: `src/lib/html-to-image-client.ts`
- 初期選択ページ: `src/routes/index.tsx`

## System Independence
- `npm run dev` でローカル動作（ブラウザのみで完結）
- 状態保持・画像生成はブラウザAPIのみで実行でき、オフラインでもプロフィールフローが成立
- Cloudflare 連携はオプションで、未設定でも既存機能に影響しない
