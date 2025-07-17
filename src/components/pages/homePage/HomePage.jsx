"use client";
import { useContext, useState } from "react";
import { BlogContext } from "@/context/BlogContext";
import Blog from "../../blog/Blog";
import { orderBy } from "firebase/firestore";
import { Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import LoadMore from "@/components/loadMore/LoadMore";

const HomePage = () => {
    const {
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
    } = useContext(BlogContext);
    const [viewMode, setViewMode] = useState("all"); // "all" | "following"

    return (
        <div className="w-full flex justify-center">
            {viewMode === "all" ? (
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
            ) : (
                <div className="w-full max-w-[620px] px-0 sm:px-6">
                    {allFollwPosts.map((post) => (
                        <Blog key={post.id} blogid={post.id} authorid={post?.data.author.uid} />
                    ))}
                    <div className="w-full flex justify-center py-10">
                        {allFollwPosts.length < countDocumentFollow ? (
                            <LoadMore
                                lastVisible={lastVisibleFollow}
                                setAdditionalPosts={setAdditionalFollowPosts}
                                setLastVisible={setLastVisibleFollow}
                                collectionName={"blogs"}
                                queryParam={[orderBy("createAt", "desc")]}
                            />
                        ) : null}
                    </div>
                </div>
            )}
            {/* Floating button */}
            <Button
                onClick={() => setViewMode(viewMode === "all" ? "following" : "all")}
                className={cn(
                    "fixed bottom-20 right-4 sm:right-8 z-50 h-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
                    "bg-primary hover:bg-primary/90 text-primary-foreground",
                    "flex items-center gap-2 px-4"
                )}
            >
                {viewMode === "following" ? (
                    <>
                        <Users className="w-5 h-5" />
                        <div className="flex flex-col justify-start">
                            <span className="hidden sm:block text-xs text-accent text-left">Đang xem</span>
                            <span className="hidden sm:block">Người theo dõi</span>
                        </div>
                    </>
                ) : (
                    <>
                        <Globe className="w-5 h-5" />
                        <div className="flex flex-col justify-start">
                            <span className="hidden sm:block text-xs text-accent text-left">Đang xem</span>
                            <span className="hidden sm:block">Mọi người</span>
                        </div>
                    </>
                )}
            </Button>
        </div>
    );
};

export default HomePage;
