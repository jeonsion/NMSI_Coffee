// import "dotenv/config";
// import express from "express";
// import cors from "cors";
// import mongoose from "mongoose";
// import jwt from "jsonwebtoken";
// import usersRouter from "./routes/users.js"; // ✅ ES 모듈 방식으로 변경
// import coffeeRouter from "./routes/coffeeRecords.js"; // ✅ ES 모듈 방식으로 변경

// const app = express();

// // ✅ 미들웨어 설정
// app.use(cors({
//   origin: "*", // 프론트엔드 주소
//   methods: ["GET", "POST", "PUT", "DELETE"], // DELETE 허용
//   credentials: true, // 쿠키 허용
// }));

// app.use(express.json()); // JSON 요청 본문 처리

// // ✅ API 요청 로깅 (디버깅용)
// app.use((req, res, next) => {
//   console.log(`📌 [${new Date().toISOString()}] 요청: ${req.method} ${req.url}`);
//   next();
// });

// // ✅ MongoDB 연결
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log("✅ MongoDB Connected");
//   } catch (error) {
//     console.error("❌ MongoDB Connection Error:", error);
//     process.exit(1);
//   }
// };
// connectDB();

// // ✅ JWT 시크릿 키 설정
// const jwtSecretKey = process.env.JWT_SECRET_KEY || "default-secret-key";
// const tokenHeaderKey = process.env.TOKEN_HEADER_KEY || "auth-token";

// // ✅ JWT 토큰 검증 미들웨어
// function authenticateToken(req, res, next) {
//   const token = req.header(tokenHeaderKey);
//   if (!token) return res.status(401).json({ error: "토큰이 없습니다." });

//   try {
//     const user = jwt.verify(token, jwtSecretKey);
//     req.user = user;
//     next();
//   } catch (error) {
//     return res.status(403).json({ error: "유효하지 않은 토큰입니다." });
//   }
// }

// // ✅ JWT 토큰 생성 엔드포인트
// app.post("/api/auth/generateToken", (req, res) => {
//   const { email, isAdmin } = req.body;

//   if (!email) {
//     return res.status(400).json({ error: "이메일이 필요합니다." });
//   }

//   const payload = { email, isAdmin: isAdmin || false };

//   try {
//     const token = jwt.sign(payload, jwtSecretKey, { expiresIn: "1h" });
//     res.json({ token });
//     console.log(`✅ JWT 토큰 생성됨: ${token}`);
//   } catch (error) {
//     console.error("❌ 토큰 생성 중 오류:", error);
//     res.status(500).json({ error: "토큰 생성 중 오류가 발생했습니다." });
//   }
// });

// // ✅ JWT 토큰 검증 엔드포인트
// app.get("/api/auth/validateToken", (req, res) => {
//   const token = req.header("auth-token");
//   console.log("📌 받은 auth-token:", token);

//   if (!token) {
//     return res.status(401).json({ valid: false, error: "No token provided" });
//   }

//   try {
//     const verified = jwt.verify(token, jwtSecretKey);
//     console.log("✅ 토큰 검증 성공:", verified);
//     res.json({ valid: true, user: verified });
//   } catch (error) {
//     console.error("❌ 토큰 검증 실패:", error.message);
//     res.status(401).json({ valid: false, error: "Invalid token" });
//   }
// });

// // ✅ 사용자 및 커피 구매 기록 라우트 추가
// app.use("/api/users", usersRouter);
// app.use("/api/coffee", coffeeRouter);

// // ✅ 관리자 전용 API 예제
// app.get("/api/admin", authenticateToken, (req, res) => {
//   if (req.user?.isAdmin) {
//     res.send("관리자 전용 데이터");
//   } else {
//     res.status(403).json({ error: "관리자 권한이 없습니다." });
//   }
// });

// // ✅ 404 핸들러 (잘못된 경로 요청 방지)
// app.use((req, res) => {
//   console.error(`❌ 404 Not Found: ${req.originalUrl}`);
//   res.status(404).json({ error: "Not Found" });
// });

// // ✅ 서버 실행 (Vercel에서 실행될 경우 `PORT` 지정 불필요)
// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => {
//   console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
// });
