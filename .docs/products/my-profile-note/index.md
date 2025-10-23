---
icon: ""
schema: {}
---

# MyProfileNote App

MyProfileNote App は、カテゴリ選択からカード生成までをワンフローで提供するプロフィール帳アプリケーションです。

## What We Provide

やさしいトーンのUIで、最大4件のカテゴリを選び、内容を入力し、即時プレビューをPNGとして保存できる体験を提供します。

## Target Users

- middle-school-student: 友だちとプロフィールカードを交換したい学生
- hobby-community-member: オンラインコミュニティで自己紹介カードを共有したい参加者
- guardian: 子どもの思い出をかわいく保存したい保護者

## Core Value Proposition

ステップガイドと田の字レイアウトにより、初めてでも迷わずカード作成でき、完成時に達成感を得られます。

## Technical Architecture

- Frontend: React + TypeScript + Vite
- Routing: @tanstack/react-router（`/` → `/select` → `/create` → `/done`）
- State: Zustand（Reducer パターン）でグローバル状態管理
- Styling: Tailwind CSS（無地パステル、角丸、余白16px）
- Image Output: html-to-image でプレビューをPNG化
- Backend (Optional): Hono on Cloudflare Workers でテンプレート／プリセットAPIを提供予定

## Context (Optional)

Reducer のテストとE2Eテストを整備し、将来のマルチテーマ展開やテンプレート共有機能に対応できるようにします。
