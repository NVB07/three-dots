"use client";
import { Menu } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ToggleTheme from "./ToggleTheme";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/config";

const Options = () => {
    const router = useRouter();
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.push("/");
        } catch (error) {
            console.error("Lỗi khi đăng xuất", error);
        }
    };
    return (
        <div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="">
                        <Menu strokeWidth={2} width={32} height={32} />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full flex flex-col p-0">
                    <div className="flex items-center border-b border-solid border-[#8a8a8a3f]">
                        {/* <span className="mr-2">Giao diện </span> */}
                        <ToggleTheme />
                    </div>

                    <Button variant="ghost" className=" transition-all p-2 rounded-none rounded-b-md " onClick={handleSignOut}>
                        <p className="text-[#f14b5c] w-full text-left text-base">Đăng xuất</p>
                    </Button>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default Options;
