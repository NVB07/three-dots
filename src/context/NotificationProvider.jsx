"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { collection, query, onSnapshot, orderBy, where, limit } from "firebase/firestore";
import { fireStore } from "@/firebase/config";
import { AuthContext } from "@/context/AuthProvider";
import useAlarm from "@/customHook/useAlarm";
export const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
    const { authUserData } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const { audioPlay, audioPause } = useAlarm();

    useEffect(() => {
        const coll = collection(fireStore, "roomsChat");
        const q = query(coll, where("user", "array-contains", authUserData.uid));
        let notificationArray = [];
        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.forEach((doc) => {
                const chatRoomId = doc.id;
                // Lắng nghe các thay đổi trong subcollection chat của phòng chat này
                const chatColl = collection(fireStore, `roomsChat/${chatRoomId}/chat`);
                const chatQuery = query(chatColl, orderBy("sendTime", "desc"), limit(1));
                onSnapshot(chatQuery, (chatSnapshot) => {
                    chatSnapshot.forEach((chatDoc) => {
                        const chatData = chatDoc.data();
                        if (chatData.uid !== authUserData.uid) {
                            notificationArray.push(chatRoomId);
                            const localAllow = JSON.parse(localStorage.getItem("ping"));
                            if (localAllow) {
                                audioPlay();
                            } else {
                                audioPause();
                            }
                        } else {
                            notificationArray = notificationArray.filter((id) => id !== chatRoomId);
                        }
                    });

                    setNotifications([...new Set(notificationArray)]);
                });
            });
        });

        return () => unsubscribe();
    }, []);

    return <NotificationContext.Provider value={{ notifications, setNotifications }}>{children}</NotificationContext.Provider>;
};

export default NotificationProvider;
