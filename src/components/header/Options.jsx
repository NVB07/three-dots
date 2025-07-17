"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useContext, useState } from "react";
import useAlarm from "@/customHook/useAlarm";
import ToggleTheme from "./ToggleTheme";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { AuthContext } from "@/context/AuthProvider";
import Image from "next/image";

import useAuth from "@/customHook/useAuth";
const Options = () => {
    const { authUserData } = useContext(AuthContext);
    const { localAllow } = useAlarm();
    const [allowAlarm, setAllowAlarm] = useState(localAllow);
    const { logout } = useAuth();

    const handleSignOut = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };
    const handleAlarm = () => {
        setAllowAlarm((pre) => {
            localStorage.setItem("ping", JSON.stringify(!pre));
            return !pre;
        });
    };
    return (
        <div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="secondary" size="default" className="active:scale-95 transition-transform rounded-full pr-1 pl-2   ">
                        {authUserData?.displayName.length > 25 ? authUserData?.displayName.slice(0, 25) + "..." : authUserData?.displayName}
                        <Image src={authUserData?.photoURL || "/avatarDefault.svg"} width={32} height={32} className=" ml-1 rounded-full max-w-8 max-h-8" alt="user" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full flex flex-col p-0">
                    <div className="flex items-center ">
                        <ToggleTheme />
                    </div>
                    <div className="flex items-center p-2 hover:bg-transparent sm:hover:bg-accent hover:text-accent-foreground">
                        <label htmlFor="alarm" className="select-none cursor-pointer">
                            Âm báo
                        </label>
                        <Switch id="alarm" className="ml-2" onCheckedChange={handleAlarm} checked={allowAlarm} />
                    </div>
                    <Button variant="ghost" className=" transition-all p-2 rounded-none rounded-b-md border-t border-solid border-[#8a8a8a3f] " onClick={handleSignOut}>
                        <p className="text-[#f14b5c] w-full text-left text-base">Đăng xuất</p>
                    </Button>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default Options;
