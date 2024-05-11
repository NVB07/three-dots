import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ShareIcon from "@/components/icons/ShareIcon";
const ChatContent = () => {
    return (
        <>
            <div className="flex justify-between sticky top-0 h-14 z-10 bg-background border-b pt-2 px-3">
                <div className="flex items-center h-fit">
                    <Avatar className="mr-2">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>IMG</AvatarFallback>
                    </Avatar>
                    <div className="text-lg">Nguyen Van Binh</div>
                </div>
                <div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="flex w-10 h-10  items-center justify-center rounded-full  bg-transparent text-2xl p-1.5">
                                    <ShareIcon width={28} height={28} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                                <p>Đi đến trang cá nhân</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
            <ScrollArea className="h-[calc(100vh-122px)] w-full rounded-md  pl-3">
                <div className=" h-[1300px] w-full "></div>
            </ScrollArea>
        </>
    );
};

export default ChatContent;
