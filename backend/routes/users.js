const express = require("express");
const User = require("../models/User");

const router = express.Router();

// 모든 사용자 조회
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
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
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });

    res.json({ message: "사용자가 삭제되었습니다.", deletedUser });
  } catch (err) {
    console.error("사용자 삭제 오류:", err);
    res.status(500).json({ error: "서버 오류" });
  }
});

module.exports = router;
