const express = require("express");
const User = require("../models/User");
const mongoose = require("mongoose");

const router = express.Router();

// 모든 사용자 조회
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("📌 개별 사용자 조회 요청:", id);

    const user = await User.findById(id);
    if (!user) {
      console.error("❌ 사용자 찾을 수 없음:", id);
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    res.json(user);
  } catch (err) {
    console.error("❌ 사용자 조회 오류:", err);
    res.status(500).json({ error: "서버 오류" });
  }
});



router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "이름을 입력하세요" });

    const newUser = new User({ name, createdAt: new Date() });
    await newUser.save();
    
    res.status(201).json(newUser);    
  } catch (err) {
    console.error("사용자 추가 오류:", err);
    res.status(500).json({ error: "서버 오류" });
  }
});

// 사용자 삭제
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  // ✅ ObjectId 유효성 검사 추가
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error("❌ 잘못된 ID 형식:", id);
    return res.status(400).json({ error: "잘못된 ID 형식입니다." });
  }

  try {
    console.log("📌 삭제 요청 도착! ID:", id);

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      console.error("❌ 사용자 찾을 수 없음:", id);
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    console.log("✅ 사용자 삭제 성공:", deletedUser);
    res.json({ message: "사용자가 삭제되었습니다.", deletedUser });
  } catch (err) {
    console.error("❌ 사용자 삭제 오류:", err);
    res.status(500).json({ error: "서버 오류" });
  }
});

module.exports = router;
