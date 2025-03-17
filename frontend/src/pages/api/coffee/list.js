import connectDB from "@/lib/db";
import CoffeeRecord from "@/models/CoffeeRecord";
import User from "@/models/User";
import moment from "moment";

export default async function handler(req, res) {
    await connectDB();

    if (req.method === "POST") {
        try {
            const { userId } = req.body;
            console.log("📌 결제 요청 받은 사용자 ID:", userId);

            if (!userId) {
                return res.status(400).json({ error: "사용자 ID가 필요합니다." });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(400).json({ error: "사용자를 찾을 수 없습니다." });
            }

            // ✅ 오늘 날짜 범위 설정
            const todayStart = moment().startOf("day").toDate();
            const todayEnd = moment().endOf("day").toDate();

            // ✅ 오늘 이미 결제한 사람이 있는지 확인
            const existingRecord = await CoffeeRecord.findOne({
                date: { $gte: todayStart, $lte: todayEnd }
            });

            if (existingRecord) {
                return res.status(400).json({ error: "오늘 이미 결제한 사람이 있습니다!" });
            }

            // ✅ 새로운 결제 기록 저장
            const newRecord = new CoffeeRecord({
                userId: user._id,
                userName: user.name,
                date: new Date(),
            });

            await newRecord.save();

            console.log("✅ 결제 기록 저장 완료:", newRecord);
            return res.status(201).json(newRecord);
        } catch (error) {
            console.error("❌ 결제 기록 추가 오류:", error);
            return res.status(500).json({ error: "서버 오류 발생" });
        }
    }

    if (req.method === "GET") {
        try {
            const records = await CoffeeRecord.find().sort({ date: -1 });
            return res.status(200).json(records);
        } catch (error) {
            console.error("❌ 커피 기록 조회 오류:", error);
            return res.status(500).json({ error: "서버 오류 발생" });
        }
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}
