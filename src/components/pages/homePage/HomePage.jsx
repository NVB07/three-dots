"use client";
import { collection, query, onSnapshot, orderBy, limit, getCountFromServer } from "firebase/firestore";
import { fireStore } from "@/firebase/config";
import { useEffect, useState, memo } from "react";
import Blog from "../../blog/Blog";
import LoadMore from "@/components/loadMore/LoadMore";

const HomePage = () => {
    const [initialPosts, setInitialPosts] = useState([]);
    const [additionalPosts, setAdditionalPosts] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [countDocument, setCountDocument] = useState(null);

    useEffect(() => {
        const coll = collection(fireStore, "blogs");

        const unsubscribeCount = onSnapshot(coll, async () => {
            const snapshot = await getCountFromServer(coll);
            setCountDocument(snapshot.data().count);
        });
        return () => unsubscribeCount();
    }, []);

    useEffect(() => {
        const initialQuery = query(collection(fireStore, "blogs"), orderBy("createAt", "desc"), limit(20));

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

        return () => unsubscribe();
    }, []);

    const uniquePostsMap = new Map();
    [...initialPosts, ...additionalPosts].forEach((post) => {
        uniquePostsMap.set(post.id, post);
    });
    const allPosts = Array.from(uniquePostsMap.values());

    return (
        <div className="w-full flex justify-center">
            <div className="w-full max-w-[620px] px-0 sm:px-6">
                {allPosts.map((post) => (
                    <MemoizedBlogs key={post.id} blogid={post.id} authorid={post?.data.author.uid} />
                ))}
                <div className="w-full flex justify-center py-10">
                    {allPosts.length < countDocument ? (
                        <LoadMore
                            lastVisible={lastVisible}
                            setAdditionalPosts={setAdditionalPosts}
                            setLastVisible={setLastVisible}
                            collectionName={"blogs"}
                            queryParam={[orderBy("createAt", "desc")]}
                        />
                    ) : null}
                </div>
            </div>
        </div>
    );
};

const MemoizedBlogs = memo(Blog);
export default HomePage;
