import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey"; // Đảm bảo rằng tệp là JSON

// Kiểm tra xem ứng dụng đã được khởi tạo chưa để tránh lỗi khởi tạo nhiều lần
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: "social-chat-d2b4e.appspot.com", // Thay thế bằng tên bucket của mày
        databaseURL: "https://social-chat-d2b4e-default-rtdb.firebaseio.com", // URL của Realtime Database nếu cần
    });
}

console.log("Firebase Admin Initialized");

const auth = admin.auth();
const firestore = admin.firestore();
const storage = admin.storage().bucket(); // Lấy bucket lưu trữ

export { firestore, storage, auth };
