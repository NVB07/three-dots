"use client";
import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import WriteBlogIcon from "@/components/icons/WriteBlogIcon";

import { AuthContext } from "@/context/AuthProvider";

import ListRoomChat from "./ListRoomChat";

const Chat = ({ children }) => {
    const { authUserData } = useContext(AuthContext);
    return (
        <div className="w-full h-auto flex items-start px-4">
            <div className="lg:w-80 md:w-64 sm:w-60 w-fit  h-[calc(100vh-140px)] sm:h-[calc(100vh-74px)] overflow-y-hidden border-r border-border ">
                <div className=" sm:flex hidden justify-between sticky top-0 h-12 z-10 bg-background pt-2 px-3">
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
            <div className="flex-1 h-[calc(100vh-140px)] sm:h-[calc(100vh-74px)] overflow-y-hidden">{children}</div>
        </div>
    );
};

export default Chat;
