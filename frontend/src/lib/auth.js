import jwt from "jsonwebtoken";

const jwtSecretKey = process.env.JWT_SECRET_KEY || "default-secret-key";
const tokenHeaderKey = process.env.TOKEN_HEADER_KEY || "auth-token";

// ✅ JWT 토큰 생성
export const generateToken = (email, isAdmin = false) => {
    return jwt.sign({ email, isAdmin }, jwtSecretKey, { expiresIn: "1h" });
};

// ✅ JWT 토큰 검증 미들웨어
export const authenticateToken = (req) => {
    const token = req.headers[tokenHeaderKey];
    if (!token) {
        throw new Error("토큰이 없습니다.");
    }

    try {
        return jwt.verify(token, jwtSecretKey);
    } catch (error) {
        throw new Error("유효하지 않은 토큰입니다.");
    }
};
