"use client";
import { createContext, useEffect, useState } from "react";
import { collection, query, onSnapshot, orderBy, limit, getCountFromServer } from "firebase/firestore";
import { fireStore } from "@/firebase/config";
import Cookies from "js-cookie";

export const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
    const [initialPosts, setInitialPosts] = useState([]);
    const [additionalPosts, setAdditionalPosts] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [countDocument, setCountDocument] = useState(null);
    // Sử dụng useEffect để fetch dữ liệu ban đầu từ Firestore
    useEffect(() => {
        const coll = collection(fireStore, "blogs");
        const initialQuery = query(coll, orderBy("createAt", "desc"), limit(20));

        if (Cookies.get("accessToken")) {
            const unsubscribe = onSnapshot(initialQuery, (querySnapshot) => {
                const initialDocs = [];
                let lastVisibleDoc = null;
                querySnapshot.forEach((doc) => {
                    initialDocs.push({ data: doc.data(), id: doc.id });
                    lastVisibleDoc = doc;
                });
                setInitialPosts(initialDocs);
                setLastVisible(lastVisibleDoc);
            });

            const unsubscribeCount = onSnapshot(coll, async () => {
                const snapshot = await getCountFromServer(coll);
                setCountDocument(snapshot.data().count);
            });

            return () => {
                unsubscribe();
                unsubscribeCount();
            };
        }
    }, []);

    const uniquePostsMap = new Map();
    [...initialPosts, ...additionalPosts].forEach((post) => {
        uniquePostsMap.set(post.id, post);
    });
    const allPosts = Array.from(uniquePostsMap.values());

    return (
        <BlogContext.Provider
            value={{
                allPosts,
                countDocument,
                lastVisible,
                setAdditionalPosts,
                setLastVisible,
            }}
        >
            {children}
        </BlogContext.Provider>
    );
};
