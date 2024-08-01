import admin from "firebase-admin";

import serviceAccount from "./serviceAccountKey";

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://social-chat-d2b4e-default-rtdb.firebaseio.com",
    });
}

export const auth = admin.auth();
