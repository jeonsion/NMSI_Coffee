import connectDB from "@/lib/db";
import CoffeeRecord from "@/models/CoffeeRecord";

export default async function handler(req, res) {
    await connectDB();

    const { id } = req.query; // ✅ URL에서 id 가져오기

    if (req.method === "DELETE") {
        try {
            const deletedRecord = await CoffeeRecord.findByIdAndDelete(id);

            if (!deletedRecord) {
                return res.status(404).json({ error: "해당 기록을 찾을 수 없습니다." });
            }

            return res.status(200).json({ message: "구매 기록이 삭제되었습니다.", deletedRecord });
        } catch (error) {
            console.error("❌ 결제 기록 삭제 오류:", error);
            return res.status(500).json({ error: "서버 오류 발생" });
        }
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}
