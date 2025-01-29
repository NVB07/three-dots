"use client";
import { useContext } from "react";
import { BlogContext } from "@/context/BlogContext";
import Blog from "../../blog/Blog";
import { orderBy } from "firebase/firestore";

import LoadMore from "@/components/loadMore/LoadMore";

const HomePage = () => {
    const { allPosts, countDocument, lastVisible, setAdditionalPosts, setLastVisible } = useContext(BlogContext);

    return (
        <div className="w-full flex justify-center">
            <div className="w-full max-w-[620px] px-0 sm:px-6">
                {allPosts.map((post) => (
                    <Blog key={post.id} blogid={post.id} authorid={post?.data.author.uid} />
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

export default HomePage;
