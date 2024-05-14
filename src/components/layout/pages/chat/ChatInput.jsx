import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ShareIcon from "@/components/icons/ShareIcon";
const ChatInput = () => {
    return (
        <div className="sticky  bottom-0 z-20 bg-background pl-3 h-16 pt-2 ">
            <div className="flex pr-3 items-center w-full border-border border-2 overflow-hidden  rounded-full">
                <Input type="text" placeholder="Nhắn tin..." className="h-11 flex-1 border-none rounded-full" />
                <Button variant="ghost" size="icon" className="rounded-full w-7 h-7 hover:bg-transparent rotate-[25deg]">
                    <ShareIcon color="#0095f6" />
                </Button>
            </div>
        </div>
    );
};

export default ChatInput;
