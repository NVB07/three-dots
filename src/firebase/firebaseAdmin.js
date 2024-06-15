import admin from "firebase-admin";

import serviceAccount from "./serviceAccountKey";

if (!admin.apps.length) {
    console.log("Initializing Firebase Admin...");
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://social-chat-d2b4e-default-rtdb.firebaseio.com",
    });
}
// else {
//     console.log("Firebase Admin already initialized");
// }

const auth = admin.auth();
export { auth };
