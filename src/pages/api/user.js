import { auth } from "@/lib/firebaseAdmin";
export default async function handler(req, res) {
    // Lấy uid từ query parameters
    const { uid } = req.query;
    if (!uid) {
        res.status(400).json({ error: "Missing UID" });
        return;
    }
    try {
        const userRecord = await auth.getUser(uid);
        res.status(200).json(userRecord);
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "Error fetching user data" });
    }
}
