---
icon: ""
schema: {}
---

# MyProfileNote App

MyProfileNote App は、カテゴリ選択からカード生成までを `/profile` 配下で提供するプロフィール帳アプリケーションです。

## What We Provide

やさしいパステルトーンのUIで、最大4件のカテゴリを選び、内容を入力し、即時プレビューを PNG として保存できる体験を提供します。

## Target Users

- middle-school-student: 友だちとプロフィールカードを交換したい学生
- hobby-community-member: オンラインコミュニティで自己紹介カードを共有したい参加者
- guardian: 子どもの思い出をかわいく保存したい保護者

## Core Value Proposition

ステップガイドと素朴なカードレイアウトにより、初めてでも迷わずカード作成でき、完成時に達成感を得られます。

## Technical Architecture

- Frontend: React + TypeScript + Vite
- Routing: @tanstack/react-router（`/profile` → `/profile/select` → `/profile/create` → `/profile/done`）
- State: Zustand + Reducer パターンでグローバル状態管理
- Styling: Tailwind CSS（無地パステル／角丸／余白16px）
- Image Output: html-to-image でプレビューを PNG 化
- Backend (Optional): Hono on Cloudflare Workers でテンプレート共有 API を提供予定

## Context (Optional)

Reducer のテストと E2E テストを整備し、今後の背景テーマ拡張やテンプレート共有機能にも対応できるようにします。
