"use client";
import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";

import WriteBlogIcon from "@/components/icons/WriteBlogIcon";

import { AuthContext } from "@/context/AuthProvider";

import ListRoomChat from "./ListRoomChat";

const Chat = ({ children }) => {
    const pathname = usePathname();
    const { authUserData } = useContext(AuthContext);
    return (
        <div className="w-full h-auto flex items-start px-4">
            <div
                className={`lg:w-80 md:w-64 ${
                    pathname === "/chat" ? "w-full" : "w-0"
                }   h-[calc(100vh-140px)] sm:h-[calc(100vh-74px)] overflow-y-hidden md:border-r border-border`}
            >
                <div className=" flex justify-between sticky top-0 h-12 z-10 bg-background pt-2 px-3">
                    <div className="text-xl font-bold">{authUserData?.displayName}</div>
                    <div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="flex  items-center justify-center rounded-full w-full h-full bg-transparent text-2xl p-1.5"
                                    >
                                        <WriteBlogIcon style="opacity-100" width={28} height={28} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">
                                    <p>Tin nhắn mới</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                <ListRoomChat />
            </div>
            {children}
        </div>
    );
};

export default Chat;
