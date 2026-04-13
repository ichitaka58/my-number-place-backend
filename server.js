// パッケージの読み込み
const express = require("express");

const cors = require("cors");

const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("./generated/prisma/client");

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

const app = express();

// ミドルウェアの設定

// corsを許可
app.use(cors());
// req.bodyでJSONデータを受け取れるようにする
app.use(express.json());

// 環境変数
const PORT = process.env.PORT || 8888;

// 動作確認用エンドポイント
app.get("/", (req, res) => {
  res.json({ message: "Number Place API is running!" });
});


// クリアタイム一覧の取得
app.get("/api/clear-times", async (req, res) => {
  try {
    const clearTimes = await prisma.clearTime.findMany({
      orderBy: { time: "asc" },
    });
    res.json(clearTimes);

  } catch (error) {
    console.error("Error fetching ranking:", error);
    res.status(500).json({ error: "ランキングの取得ができませんでした" });
  }
})


// クリアタイムの登録
app.post("/api/clear-times", async (req, res) => {
  try {
    const { userId, time, level } = req.body;
    if (!time || !level || level.trim() === "") {
      return res.status(400).json({ error: "エラーが発生しました" });
    }
    const clearTime = await prisma.clearTime.create({
      data: {
        userId: userId || null,
        time: time,
        level: level,
      },
    });
    res.status(200).json(clearTime);

  } catch (error) {
    console.error("Error save matrix:", error);
    res.status(500).json({ error: "保存に失敗しました" });
  }
})


// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

