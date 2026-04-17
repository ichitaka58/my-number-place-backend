# My Number Place Backend

このプロジェクトは、ナンプレアプリのバックエンドサーバーです。
ユーザーのクリアタイムを保存し、ランキング形式で取得・管理するためのAPIを提供します。

## 技術スタック

* **Runtime**: [Node.js](https://nodejs.org/)
* **Framework**: [Express](https://expressjs.com/)
* **ORM**: [Prisma](https://www.prisma.io/)
* **Database**: PostgreSQL (Supabase等)

## 機能

* アプリからのゲームクリアタイム（ユーザー名、タイム、難易度）の保存
* 保存されたクリアタイムデータのランキング一覧取得
* 特定のクリアタイムレコードの削除

## デプロイメント

本アーキテクチャでは、フロントエンドとバックエンドをそれぞれ別のプラットフォームにデプロイしています。

* **フロントエンド (Vercel)**: ナンプレアプリのUIを提供します。
* **バックエンド (Render)**: このリポジトリで管理されているAPIサーバーです。データベース(Supabase等)と連携してスコアを管理します。

**本番環境(Render)での環境変数:**
Renderダッシュボードの環境変数設定にて、以下の項目を設定してください。
* `DATABASE_URL`: 接続先のPostgreSQLデータベースURL

*(※フロントエンド側(Vercel)の環境変数には、Renderで発行されたバックエンドのURL(`https://your-app.onrender.com` 等)を指定して連携させます)*

## 開発環境のセットアップ手順

### 1. リポジトリのクローンと依存関係のインストール

```bash
git clone https://github.com/ichitaka58/my-number-place-backend.git
cd my-number-place-backend
npm install
```

### 2. 環境変数の設定

プロジェクトのルートディレクトリに `.env` ファイルを作成し、環境変数を設定します。

```env
DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[database]"
PORT=8888
```

### 3. Prismaの設定とデータベースの準備

データベースのマイグレーションと、Prismaクライアントのジェネレートを行います。

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. サーバーの起動

開発モード（ホットリロード付き）で起動する場合：
```bash
npm run dev
```

本番モードとして起動する場合：
```bash
npm start
```

サーバーはデフォルトで `http://localhost:8888` で起動します。

## API仕様

### ヘルスチェック
* `GET /`
  * サーバーの稼働状態を確認するためのエンドポイントです。

### クリアタイム一覧の取得
* `GET /api/clear-times`
  * データベースからクリアタイムのリストを取得し、時間の早い順にソートして返します。
  * **レスポンス例**:
    ```json
    [
      {
        "id": 1,
        "userName": "プレイヤー1",
        "time": 120,
        "level": "easy",
        "createdAt": "2026-04-17T12:00:00Z",
        "updatedAt": "2026-04-17T12:00:00Z"
      }
    ]
    ```

### クリアタイムの登録
* `POST /api/clear-times`
  * 新しいクリアタイムを保存します。
  * **リクエストボディ**:
    ```json
    {
      "userName": "プレイヤー名", // 値がない場合は「ゲストユーザー」として保存されます
      "time": 150, // 必須
      "level": "medium" // 必須
    }
    ```

### クリアタイムの削除
* `DELETE /api/clear-times/:id`
  * 指定されたIDのクリアタイムレコードを削除します。

## ライセンス

ISC License
