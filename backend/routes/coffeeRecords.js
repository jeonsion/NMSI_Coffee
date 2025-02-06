const express = require("express");
const CoffeeRecord = require("../models/CoffeeRecord");
const moment = require("moment");

const router = express.Router();

// ✅ 모든 커피 구매 기록 조회
router.get("/", async (req, res) => {
  try {
    const records = await CoffeeRecord.find().populate("userId");
    res.json(records);
  } catch (err) {
    console.error("커피 기록 조회 오류:", err);
    res.status(500).json({ error: "서버 오류" });
  }
});

// ✅ 결제 기록 추가 (중복 검사 포함)
router.post("/", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "사용자 ID가 필요합니다." });

    // ✅ 오늘 날짜의 시작과 끝 범위 설정
    const todayStart = moment().startOf("day").toDate();
    const todayEnd = moment().endOf("day").toDate();

    // ✅ 오늘 이미 결제한 사람이 있는지 확인
    const existingRecord = await CoffeeRecord.findOne({
      date: { $gte: todayStart, $lte: todayEnd },
    });

    if (existingRecord) {
      return res.status(400).json({ error: "오늘 이미 결제한 사람이 있습니다!" });
    }

    // ✅ 결제 기록 추가
    const newRecord = new CoffeeRecord({ userId, date: new Date() });
    await newRecord.save();

    res.status(201).json(newRecord);
  } catch (err) {
    console.error("커피 기록 추가 오류:", err);
    res.status(500).json({ error: "서버 오류" });
  }
});

// ✅ 특정 커피 구매 기록 삭제
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecord = await CoffeeRecord.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res.status(404).json({ error: "해당 기록을 찾을 수 없습니다." });
    }

    res.json({ message: "구매 기록이 삭제되었습니다.", deletedRecord });
  } catch (err) {
    console.error("커피 기록 삭제 오류:", err);
    res.status(500).json({ error: "서버 오류" });
  } 
});


module.exports = router;
