const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();
const jwtSecretKey = process.env.JWT_SECRET_KEY || "default-secret-key";
const tokenHeaderKey = process.env.TOKEN_HEADER_KEY || "auth-token";

// ✅ JWT 토큰 검증 엔드포인트
router.get("/validateToken", (req, res) => {
  try {
    const token = req.header(tokenHeaderKey);
    if (!token) {
      return res.status(401).json({ error: "토큰이 없습니다." });
    }

    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      return res.json({ message: "✅ 인증 성공", user: verified });
    } else {
      return res.status(401).json({ error: "❌ 인증 실패" });
    }
  } catch (error) {
    return res.status(401).json({ error: "❌ 유효하지 않은 토큰" });
  }
});

module.exports = router;
