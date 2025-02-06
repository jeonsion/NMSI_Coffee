const mongoose = require("mongoose");

const CoffeeRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true }, // ✅ 사용자 이름 추가
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CoffeeRecord", CoffeeRecordSchema, "coffeeRecords");
