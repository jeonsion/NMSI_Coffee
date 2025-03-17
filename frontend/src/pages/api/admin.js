import { authenticateToken } from "../../lib/auth";

export default function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const user = authenticateToken(req);
        if (!user.isAdmin) {
            return res.status(403).json({ error: "관리자 권한이 없습니다." });
        }
        res.status(200).json({ message: "관리자 전용 데이터" });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}
