"use client";
import { Button } from "@/components/ui/button";
import { Home, Search, SquarePen, MessageSquareMore, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "@/auth/AuthProvider";
const Navigate = () => {
    const data = useContext(AuthContext);
    const urlPath = usePathname();
    const router = useRouter();
    return (
        <div className="h-[66px]">
            <Button className="w-[92px] h-[66px] mx-[3px]" variant="ghost" onClick={() => router.push("/")}>
                <Home strokeWidth={2} width={32} height={32} style={urlPath === "/" ? { opacity: 1 } : { opacity: 0.4 }} />
            </Button>
            <Button className="w-[92px] h-[66px] p-0" variant="ghost">
                <Link href={"/search"} className="flex items-center justify-center w-full h-full">
                    <Search strokeWidth={2.5} width={32} height={32} style={urlPath.includes("search") ? { opacity: 1 } : { opacity: 0.4 }} />
                </Link>
            </Button>
            <Button className="w-[92px] h-[66px] mx-[3px]" variant="ghost">
                <SquarePen strokeWidth={2} width={32} height={32} style={{ opacity: 0.4 }} />
            </Button>
            <Button className="w-[92px] h-[66px] p-0" variant="ghost">
                <Link href={"/chat"} className="flex items-center justify-center w-full h-full">
                    <MessageSquareMore strokeWidth={2} width={32} height={32} style={urlPath.includes("chat") ? { opacity: 1 } : { opacity: 0.4 }} />
                </Link>
            </Button>
            <Button className="w-[92px] h-[66px] p-0" variant="ghost">
                <Link href={"/user/@" + data?.uid} className="flex items-center justify-center w-full h-full">
                    <User strokeWidth={2.5} width={32} height={32} style={urlPath.includes("user") ? { opacity: 1 } : { opacity: 0.4 }} />
                </Link>
            </Button>
        </div>
    );
};

export default Navigate;
