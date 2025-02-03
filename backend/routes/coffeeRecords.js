const express = require("express");
const CoffeeRecord = require("../models/CoffeeRecord");

const router = express.Router();

// 모든 커피 구매 기록 조회
router.get("/", async (req, res) => {
  const records = await CoffeeRecord.find().populate("userId");
  res.json(records);
});

// 커피 구매 기록 추가
router.post("/", async (req, res) => {
  const newRecord = new CoffeeRecord({ userId: req.body.userId });
  await newRecord.save();
  res.json({ message: "커피 구매 기록 추가 완료!", record: newRecord });
});

module.exports = router;
