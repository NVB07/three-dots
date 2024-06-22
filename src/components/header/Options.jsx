"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useContext } from "react";
import ToggleTheme from "./ToggleTheme";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/config";
import { AuthContext } from "@/context/AuthProvider";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const Options = () => {
    const { authUserData } = useContext(AuthContext);
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
                    <Button
                        variant="ghost"
                        size="icon"
                        className=" sm:hover:bg-transparent active:scale-95 transition-transform rounded-full *:hover:opacity-100 *:transition-all relative after:absolute after:content-[''] after:bottom-1 after:text-white after:right-0.5 after:w-3 after:h-3 after:flex after:items-center after:justify-center after:rotate-90 after:rounded-full after:bg-red-600"
                    >
                        <Image src={authUserData?.photoURL} width={32} height={32} className="rounded-full max-w-8 max-h-8" alt="user" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full flex flex-col p-0">
                    <div className="flex items-center border-b border-solid border-[#8a8a8a3f]">
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
