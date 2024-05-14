import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import OptionIcon from "@/components/icons/OptionIcon";
import Message from "./Message";
import ChatInput from "./ChatInput";
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
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full w-7 h-7">
                                <OptionIcon width={24} height={24} />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full  flex flex-col p-0">
                            <Button variant="ghost" className=" rounded-b-none">
                                Xem trang cá nhân
                            </Button>
                            <Button variant="ghost" className="rounded-t-none flex justify-start text-[#f14b5c] hover:text-[#f14b5c]">
                                Xóa đoạn chat
                            </Button>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <ScrollArea className="h-[calc(100vh-194px)] w-full rounded-md mt-2 pl-3 pb-3">
                <Message message="chao may" />
                <Message message="chao may" />
                <Message message="chao may" />
                <Message message="chao may ml-1 bg-accent py-1 px-2 rounded-3xl chao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xl" />
                <Message message="chao may ml-1 bg-accent py-1 px-2 rounded-3xl chao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xl" />
                <Message message="chao may ml-1 bg-accent py-1 px-2 rounded-3xl chao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xl" />
                <Message message="chao may ml-1 bg-accent py-1 px-2 rounded-3xl chao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xl" />
                <Message message="chao may ml-1 bg-accent py-1 px-2 rounded-3xl chao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xl" />
                <Message message="chao may ml-1 bg-accent py-1 px-2 rounded-3xl chao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xl" />
                <Message message="chao may ml-1 bg-accent py-1 px-2 rounded-3xl chao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xl" />
                <Message message="chao may ml-1 bg-accent py-1 px-2 rounded-3xl chao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xl" />
                <Message message="chao may ml-1 bg-accent py-1 px-2 rounded-3xl chao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xl" />
                <Message
                    myMessage
                    message="chao may ml-1 bg-accent py-1 px-2 rounded-3xl chao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xlchao may ml-1 bg-accent py-1 px-2 rounded-3xl"
                />
                <Message message="chao may" />
                <Message message="chao may" />
                <Message message="chao may" />
                <Message
                    myMessage
                    message="Chúng ta đã định nghĩa một tiện ích tùy chỉnh line-clamp-2 trong phần @layer utilities của TailwindCSS để thiết lập các thuộc tính CSS cần thiế"
                />
                <Message myMessage message="😜🎉😍😢😎" />
                <Message myMessage message="chao may 😜" />
            </ScrollArea>
            <ChatInput />
        </>
    );
};

export default ChatContent;
