import connectDB from "@/lib/db";
import User from "@/models/User";

export default async function handler(req, res) {
    try {
        await connectDB();
    } catch (error) {
        console.error("❌ DB 연결 오류:", error);
        return res.status(500).json({ error: "데이터베이스 연결 실패" });
    }


    if (req.method === "POST") {
        try {
            const { name } = req.body;
            console.log("📌 요청 데이터:", req.body); // ✅ 요청 데이터 확인

            if (!name || name.trim() === "") {
                return res.status(400).json({ error: "이름을 입력해야 합니다." });
            }

            // ✅ 동일한 이름이 있는지 확인
            const existingUser = await User.findOne({ name });
            if (existingUser) {
                return res.status(400).json({ error: "이미 존재하는 사용자입니다." });
            }

            // ✅ 새로운 사용자 생성
            const newUser = new User({ name, createdAt: new Date() });
            await newUser.save();

            return res.status(201).json(newUser);
        } catch (error) {
            console.error("❌ 사용자 추가 오류:", error);
            return res.status(500).json({ error: "서버 오류 발생" });
        }
    }

    if (req.method === "GET") {
        try {
            const users = await User.find().sort({ createdAt: -1 });
            return res.status(200).json(users);
        } catch (error) {
            console.error("❌ 사용자 목록 조회 오류:", error);
            return res.status(500).json({ error: "서버 오류 발생" });
        }
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}
