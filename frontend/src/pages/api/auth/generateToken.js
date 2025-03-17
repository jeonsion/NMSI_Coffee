import { generateToken } from "@/lib/auth";

export default function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { email, isAdmin } = req.body;
    if (!email) {
        return res.status(400).json({ error: "이메일이 필요합니다." });
    }

    try {
        const token = generateToken(email, isAdmin);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: "토큰 생성 중 오류 발생" });
    }
}
