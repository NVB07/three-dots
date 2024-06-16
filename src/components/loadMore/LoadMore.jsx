"use client";
import { useState } from "react";
import { query, collection, startAfter, limit, getDocs } from "firebase/firestore";
import { fireStore } from "@/firebase/config";
import { Button } from "../ui/button";
import LoadingIcon from "../icons/LoadingIcon";
import ChevronRight from "../icons/ChevronRight";

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

    return (
        <Button variant="link" className="w-10 h-10  border border-[] outline-none" onClick={loadMore}>
            {loading ? (
                <p className="">
                    <LoadingIcon width={20} height={20} />
                </p>
            ) : (
                <p className="underline  rotate-90">
                    <ChevronRight width={20} height={20} />
                </p>
            )}
        </Button>
    );
};

export default LoadMore;
