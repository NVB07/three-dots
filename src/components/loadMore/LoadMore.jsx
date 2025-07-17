"use client";
import { useState, useEffect } from "react";
import { query, collection, startAfter, limit, getDocs } from "firebase/firestore";
import { fireStore } from "@/firebase/config";
import LoadingIcon from "../icons/LoadingIcon";

const LoadMore = ({ lastVisible, setAdditionalPosts, setLastVisible, collectionName, queryParam }) => {
    const [loading, setLoading] = useState(false);

    const loadMore = async () => {
        setLoading(true);
        if (lastVisible) {
            const nextQuery = query(collection(fireStore, collectionName), ...queryParam, startAfter(lastVisible), limit(20));
            const querySnapshot = await getDocs(nextQuery);
            const newDocs = [];
            let lastVisibleDoc = lastVisible;

            querySnapshot.forEach((doc) => {
                newDocs.push({ data: doc.data(), id: doc.id });
                lastVisibleDoc = doc;
            });
            setAdditionalPosts((prevPosts) => [...prevPosts, ...newDocs]);
            setLastVisible(lastVisibleDoc);
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.innerHeight + window.scrollY;
            const threshold = document.body.offsetHeight - 200;

            if (scrollPosition >= threshold && !loading) {
                loadMore();
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [loading, lastVisible]);

    return (
        <div>
            {loading && (
                <div className="flex justify-center mt-4">
                    <LoadingIcon width={20} height={20} />
                </div>
            )}
        </div>
    );
};

export default LoadMore;
