import connectDB from "@/lib/db";
import User from "@/models/User";

export default async function handler(req, res) {
    await connectDB();

    if (req.method === "DELETE") {
        try {
            const { id } = req.query;
            console.log("📌 삭제 요청 ID:", id);

            const deletedUser = await User.findByIdAndDelete(id);

            if (!deletedUser) {
                return res.status(404).json({ error: "해당 사용자를 찾을 수 없습니다." });
            }

            return res.status(200).json({ message: "사용자가 삭제되었습니다.", deletedUser });
        } catch (error) {
            console.error("❌ 사용자 삭제 오류:", error);
            return res.status(500).json({ error: "서버 오류 발생" });
        }
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}
