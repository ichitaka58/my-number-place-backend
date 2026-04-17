/**
 * パッケージの読み込み
 */
const express = require("express");
const cors = require("cors");
require("dotenv/config");

/**
 * Prismaクライアントのセットアップ
 * @prisma/adapter-pgを使用してPostgreSQLへの接続を設定します。
 */
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("./generated/prisma/client");

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

/**
 * Expressアプリケーションの初期化
 */
const app = express();

/**
 * ミドルウェアの設定
 */
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://my-number-place.vercel.app",
  ],
  credentials: true,
};
// 異なるオリジンからのAPIリクエスト（CORS）を許可する
app.use(cors(corsOptions));
// リクエストボディのJSONデータをパースして `req.body` として扱えるようにする
app.use(express.json());

/**
 * 環境変数の設定
 * PORTが指定されていない場合はデフォルトで8888を使用します。
 */
const PORT = process.env.PORT || 8888;

/**
 * 動作確認用エンドポイント
 * GET /
 */
app.get("/", (req, res) => {
  res.json({ message: "Number Place API is running!" });
});


/**
 * クリアタイム一覧の取得
 * GET /api/clear-times
 * 
 * データベースからクリアタイムのリストを取得し、時間の昇順（早い順）でソートして返します。
 */
app.get("/api/clear-times", async (req, res) => {
  try {
    // タイムが短い順にデータを取得
    const clearTimes = await prisma.clearTime.findMany({
      orderBy: { time: "asc" },
    });
    res.json(clearTimes);

  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).json({ error: "ランキングの取得ができませんでした" });
  }
})


/**
 * クリアタイムの登録
 * POST /api/clear-times
 * 
 * 新しいクリアタイムをデータベースに保存します。
 */
app.post("/api/clear-times", async (req, res) => {
  try {
    const { userName, time, level } = req.body;

    // バリデーション: timeとlevelの必須チェック
    if (!time || !level || level.trim() === "") {
      return res.status(400).json({ error: "エラーが発生しました" });
    }

    // データベースに新しいレコードを保存
    const clearTime = await prisma.clearTime.create({
      data: {
        userName: userName || "ゲストユーザー", // userNameがない場合はゲストユーザーを保存
        time: time,
        level: level,
      },
    });
    res.status(200).json(clearTime);

  } catch (error) {
    console.error("Error save record:", error);
    res.status(500).json({ error: "保存に失敗しました" });
  }
})

/**
 * クリアタイムの削除
 * DELETE /api/clear-times/:id
 * 
 * 指定されたIDのクリアタイムをデータベースから削除します。
 */
app.delete("/api/clear-times/:id", async (req, res) => {
  try {
    // URLパラメータからIDを取得し、数値に変換
    const id = parseInt(req.params.id);

    // IDが数値でない場合はエラー
    if (isNaN(id)) {
      return res.status(400).json({ error: "無効なIDです" });
    }

    // データベースから該当レコードを削除
    await prisma.clearTime.delete({
      where: { id },
    });

    res.json({ message: "レコードを削除しました" });

  } catch (error) {
    console.error("Error deleting record:", error);

    // P2025 = Prisma のエラーコード（該当IDのレコードが見つからない場合）
    if (error.code === "P2025") {
      return res.status(404).json({ error: "レコードが見つかりません" });
    }
    res.status(500).json({ error: "レコードの削除に失敗しました" });
  }
})

/**
 * サーバー起動
 * 指定されたポートでリクエストの待機を開始します。
 */
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

