import { authenticateToken } from "@/lib/auth";

export default function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const user = authenticateToken(req);
        res.status(200).json({ valid: true, user });
    } catch (error) {
        res.status(401).json({ valid: false, error: error.message });
    }
}
