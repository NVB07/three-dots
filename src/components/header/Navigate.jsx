"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useRouter } from "next13-progressbar";
import { useContext } from "react";
import { NotificationContext } from "@/context/NotificationProvider";
import { AuthContext } from "@/context/AuthProvider";
import NewBlog from "../newBlog/NewBlog";
import HomeIcon from "@/components/icons/HomeIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import ChatIcon from "@/components/icons/ChatIcon";
import UserIcon from "@/components/icons/UserIcon";
import WriteBlogIcon from "@/components/icons/WriteBlogIcon";
const Navigate = () => {
    const { notifications } = useContext(NotificationContext);
    const { authUserData } = useContext(AuthContext);
    const urlPath = usePathname();
    const router = useRouter();
    return (
        <div className="h-[66px] flex items-center justify-evenly w-full">
            <Button className="sm:w-[92px] w-10 h-10 p-0  sm:h-[66px]  mx-[3px] active:scale-95 transition-transform" variant="ghost" onClick={() => router.push("/")}>
                <HomeIcon width={32} height={32} solid={urlPath === "/"} />
            </Button>
            <Button className="sm:w-[92px] w-10 h-10 p-0 sm:h-[66px] mx-[3px] active:scale-95 transition-transform" variant="ghost">
                <Link href={"/search"} className="flex items-center justify-center w-full h-full">
                    <SearchIcon width={32} height={32} solid={urlPath.includes("search")} />
                </Link>
            </Button>

            <NewBlog
                styleButton="sm:w-[92px] w-10 h-10 p-0  sm:h-[66px] mx-[3px] active:scale-95 transition-transform"
                buttonTitle={<WriteBlogIcon width={32} height={32} />}
            />
            <Button className="sm:w-[92px] w-10 h-10 p-0 sm:h-[66px] mx-[3px] active:scale-95 transition-transform relative" variant="ghost">
                <Link href={"/chat"} className="flex items-center justify-center w-full h-full ">
                    <ChatIcon width={32} height={32} solid={urlPath.includes("chat")} />
                </Link>
                {notifications.length > 0 && (
                    <div className="absolute sm:top-1.5 -top-1.5 z-10 left-[55%]  flex items-center justify-center w-5 h-5 rounded-full bg-[#ff0000] text-white text-sm">
                        {notifications.length}
                    </div>
                )}
            </Button>
            <Button className="sm:w-[92px] w-10 h-10 p-0 sm:h-[66px] mx-[3px] active:scale-95 transition-transform" variant="ghost">
                <Link href={"/user/@" + authUserData?.uid} className="flex items-center justify-center w-full h-full">
                    <UserIcon width={32} height={32} solid={urlPath.includes("user")} />
                </Link>
            </Button>
        </div>
    );
};

export default Navigate;
