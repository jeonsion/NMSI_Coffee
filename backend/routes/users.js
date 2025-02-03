const express = require("express");
const User = require("../models/User");

const router = express.Router();

// 모든 사용자 조회
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// 사용자 추가
router.post("/", async (req, res) => {
  const newUser = new User({ name: req.body.name });
  await newUser.save();
  res.json({ message: "사용자 추가 완료!", user: newUser });
});

// 사용자 삭제
router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "사용자 삭제 완료!" });
});

module.exports = router;
