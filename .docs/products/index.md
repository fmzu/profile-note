---
icon: ""
schema: {}
---

# Products Overview

MyProfile Suite は「プロフィール帳」と「ログインボーナス管理」という 2 つの体験をまとめたミニアプリ群です。

## Product Relationships

- **MyProfileNote App (`/profile`)**: プロフィールカテゴリ選択から画像保存までを提供するSPA
- **Login Bonus App (`/login-bonus`, planned)**: ログインボーナスの配布スケジュールと演出を設定するアプリ（近日追加）
- 共通するドメイン型 `Profile` や背景テーマ設定は `src/types` と `src/store` に集約し、アプリ間で再利用可能にしています。ログインボーナス未実装時でもプロフィール帳アプリ単体で動作します。

## Architecture Context (Optional)

Cloudflare Pages 上の静的ホスティングと、必要に応じて Workers + Hono API を統合する構成を想定しています。API 連携はオプションで、フロント単独でも完結します。
