"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "@/auth/AuthProvider";
import NewBlog from "../newBlog/NewBlog";
import HomeIcon from "@/components/icons/HomeIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import ChatIcon from "@/components/icons/ChatIcon";
import UserIcon from "@/components/icons/UserIcon";
import WriteBlogIcon from "@/components/icons/WriteBlogIcon";
const Navigate = () => {
    const data = useContext(AuthContext);
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
            <Button className="sm:w-[92px] w-10 h-10 p-0 sm:h-[66px] mx-[3px] active:scale-95 transition-transform" variant="ghost">
                <Link href={"/chat"} className="flex items-center justify-center w-full h-full ">
                    <ChatIcon width={32} height={32} solid={urlPath.includes("chat")} />
                </Link>
            </Button>
            <Button className="sm:w-[92px] w-10 h-10 p-0 sm:h-[66px] mx-[3px] active:scale-95 transition-transform" variant="ghost">
                <Link href={"/user/@" + data?.uid} className="flex items-center justify-center w-full h-full">
                    <UserIcon width={32} height={32} solid={urlPath.includes("user")} />
                </Link>
            </Button>
        </div>
    );
};

export default Navigate;