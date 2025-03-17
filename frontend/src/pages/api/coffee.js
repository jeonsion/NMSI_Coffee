import connectDB from "@/lib/db";
import CoffeeRecord from "@/models/CoffeeRecord";

export default async function handler(req, res) {
    await connectDB();

    if (req.method === "GET") {
        const records = await CoffeeRecord.find({});
        return res.status(200).json(records);
    }

    res.status(405).json({ error: "Method Not Allowed" });
}
