require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" })); // 프론트엔드와 연결

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));


// 기본 API 라우트
app.get("/", (req, res) => {
  res.send("☕ 커피 N분의 1 백엔드 서버!");
});

app.use("/api/users", require("./routes/users"));
app.use("/api/coffee", require("./routes/coffeeRecords"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
