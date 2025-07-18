"use client";
import { createContext, useEffect, useState, useContext } from "react";
import { collection, query, onSnapshot, orderBy, limit, getCountFromServer, where } from "firebase/firestore";
import { fireStore } from "@/firebase/config";
import Cookies from "js-cookie";
import { AuthContext } from "@/context/AuthProvider";
export const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
    const { authUserData } = useContext(AuthContext);

    const [initialPosts, setInitialPosts] = useState([]);
    const [initialFollowPosts, setInitialFollowPosts] = useState([]);

    const [additionalPosts, setAdditionalPosts] = useState([]);
    const [additionalFollowPosts, setAdditionalFollowPosts] = useState([]);

    const [lastVisible, setLastVisible] = useState(null);
    const [lastVisibleFollow, setLastVisibleFollow] = useState(null);

    const [countDocument, setCountDocument] = useState(null);
    const [countDocumentFollow, setCountDocumentFollow] = useState(null);
    useEffect(() => {
        const coll = collection(fireStore, "blogs");
        const initialQuery = query(coll, where("privacyValue", "==", "public"), orderBy("createAt", "desc"), limit(20));

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

            const countQuery = query(coll, where("privacyValue", "==", "public"));

            const unsubscribeCount = onSnapshot(countQuery, async () => {
                const snapshot = await getCountFromServer(countQuery);
                setCountDocument(snapshot.data().count);
            });

            return () => {
                unsubscribe();
                unsubscribeCount();
            };
        }
    }, []);

    useEffect(() => {
        if (Array.isArray(authUserData?.following) && authUserData?.following.length > 0) {
            const coll = collection(fireStore, "blogs");
            const initialQuery = query(coll, where("author.uid", "in", authUserData?.following), orderBy("createAt", "desc"), limit(20));

            if (Cookies.get("accessToken")) {
                const unsubscribe = onSnapshot(initialQuery, (querySnapshot) => {
                    const initialDocs = [];
                    let lastVisibleDoc = null;
                    querySnapshot.forEach((doc) => {
                        initialDocs.push({ data: doc.data(), id: doc.id });
                        lastVisibleDoc = doc;
                    });
                    setInitialFollowPosts(initialDocs);
                    setLastVisibleFollow(lastVisibleDoc);
                });

                const countQuery = query(coll, where("author.uid", "in", authUserData?.following));

                const unsubscribeCount = onSnapshot(countQuery, async () => {
                    const snapshot = await getCountFromServer(countQuery);
                    setCountDocumentFollow(snapshot.data().count);
                });

                return () => {
                    unsubscribe();
                    unsubscribeCount();
                };
            }
        }
    }, []);

    const uniquePostsMap = new Map();
    [...initialPosts, ...additionalPosts].forEach((post) => {
        uniquePostsMap.set(post.id, post);
    });
    const allPosts = Array.from(uniquePostsMap.values());

    const uniquePostsFollowMap = new Map();
    [...initialFollowPosts, ...additionalFollowPosts].forEach((post) => {
        uniquePostsFollowMap.set(post.id, post);
    });
    const allFollwPosts = Array.from(uniquePostsFollowMap.values());

    return (
        <BlogContext.Provider
            value={{
                allPosts,
                allFollwPosts,
                countDocument,
                countDocumentFollow,
                lastVisible,
                lastVisibleFollow,
                setAdditionalPosts,
                setAdditionalFollowPosts,
                setLastVisible,
                setLastVisibleFollow,
            }}
        >
            {children}
        </BlogContext.Provider>
    );
};
