---
icon: ""
schema: {}
---

# Products Overview

MyProfileNote ファミリーの製品は、プロフィールカード作成体験を中心に構成されます

## Product Relationships

- **MyProfileNote App**: フロントエンドSPA。カテゴリ選択から画像保存までを提供
- **MyProfileNote Cloud API (Optional)**: Hono on Workers でテンプレート共有やカテゴリプリセットを提供予定
- 共通要素は `Profile` ドメインモデルとカードテーマ設定で共有され、APIが未提供でもアプリ単体で完結します

## Architecture Context (Optional)

Cloudflare Pages 上の静的ホスティングと、必要に応じて Workers 上のHono APIを統合する構成を想定しています
