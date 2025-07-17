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
                    <Button variant="ghost" size="default" className=" active:scale-95 transition-all rounded-full p-1 relative group">
                        <div className="rounded-full shadow-[0_0_0.75rem_rgba(0,0,0,0.15)] dark:shadow-[0_0_0.75rem_rgba(255,255,255,0.15)]">
                            <Image src={authUserData?.photoURL || "/avatarDefault.svg"} width={36} height={36} className="rounded-full" alt="user" />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 bg-background rounded-full p-0.5 shadow-md border border-border/50">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-foreground"
                            >
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-52 p-0">
                    <div className="flex flex-col py-2">
                        <div className="flex items-center px-2 space-x-2 mb-2">
                            <Image src={authUserData?.photoURL || "/avatarDefault.svg"} width={32} height={32} className="rounded-full" alt="user" />
                            <div className="min-w-0">
                                <p className="font-medium text-sm truncate">{authUserData?.displayName}</p>
                            </div>
                        </div>

                        <div className="mt-1">
                            <div className="flex items-center justify-between py-1.5 mb-1">
                                <ToggleTheme />
                            </div>

                            <div className="flex items-center justify-between px-2 hover:bg-accent py-1.5">
                                <span className="text-base">Âm báo</span>
                                <Switch id="alarm" onCheckedChange={handleAlarm} checked={allowAlarm} />
                            </div>
                        </div>

                        <div className="mt-2 ">
                            <button
                                className="w-full px-2 h-9 flex items-center justify-start text-[#f14b5c] hover:text-[#f14b5c] hover:bg-red-500/10 dark:hover:bg-red-950/40"
                                onClick={handleSignOut}
                            >
                                <span className="text-sm">Đăng xuất</span>
                            </button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default Options;
