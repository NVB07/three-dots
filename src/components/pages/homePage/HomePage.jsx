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
    const { allPosts, countDocument, lastVisible, setAdditionalPosts, setLastVisible } = useContext(BlogContext);
    const [viewMode, setViewMode] = useState("all"); // "all" | "following"

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

            {/* Floating button */}
            <Button
                onClick={() => setViewMode(viewMode === "all" ? "following" : "all")}
                className={cn(
                    "fixed bottom-20 right-4 sm:right-8 z-50 h-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
                    "bg-primary hover:bg-primary/90 text-primary-foreground",
                    "flex items-center gap-2 px-4"
                )}
            >
                {viewMode === "all" ? (
                    <>
                        <Users className="w-5 h-5" />
                        <span className="hidden sm:inline">Người theo dõi</span>
                    </>
                ) : (
                    <>
                        <Globe className="w-5 h-5" />
                        <span className="hidden sm:inline">Tất cả</span>
                    </>
                )}
            </Button>
        </div>
    );
};

export default HomePage;
