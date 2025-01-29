import { firestore, storage, auth } from "../../lib/firebaseAdmin";

const deleteDocument = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split("Bearer ")[1];

    try {
        // Xác thực token và lấy thông tin người dùng
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;
        console.log(userId);

        const { collectionName, documentID, pathImage } = req.body;

        if (!collectionName || !documentID) {
            return res.status(400).json({ error: "Invalid input" });
        }

        const documentRef = firestore.collection(collectionName).doc(documentID);
        const doc = await documentRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Document not found" });
        }

        const docData = doc.data();
        if (docData.author.uid !== userId) {
            return res.status(403).json({ error: "Forbidden: You do not have permission to delete this document" });
        }

        // Xóa tài liệu và các subcollections
        await recursiveDelete(documentRef);
        console.log(`Successfully deleted document: ${documentRef.path}`);

        // Xóa ảnh nếu có
        if (pathImage) {
            const file = storage.file(pathImage);
            await file.delete();
            console.log(`Successfully deleted image: ${pathImage}`);
        }

        return res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
        console.error("Error deleting document:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }

    // const { collectionName, documentID, pathImage } = req.body;

    // try {
    //     const documentRef = firestore.collection(collectionName).doc(documentID);

    //     // Sử dụng recursiveDelete để xóa document và các subcollections
    //     await firestore.recursiveDelete(documentRef);
    //     console.log(`Successfully deleted document: ${documentRef.path}`);

    //     // Xóa ảnh nếu có
    //     if (pathImage) {
    //         const file = storage.file(pathImage);
    //         await file.delete();
    //         console.log(`Successfully deleted image: ${pathImage}`);
    //     }

    //     return res.status(200).json({ message: "Document deleted successfully" });
    // } catch (error) {
    //     console.error("Error deleting document:", error);
    //     return res.status(500).json({ error: "Internal Server Error" });
    // }
};
const recursiveDelete = async (documentRef) => {
    const subcollections = await documentRef.listCollections();
    for (const collection of subcollections) {
        const snapshot = await collection.get();
        for (const doc of snapshot.docs) {
            await recursiveDelete(doc.ref);
        }
    }
    await documentRef.delete();
};
export default deleteDocument;
