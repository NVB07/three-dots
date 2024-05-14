import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const RoomChat = ({ avatarSRC, avatarFallback, name }) => {
    return (
        <div className="w-full my-1 h-16 cursor-pointer hover:bg-accent p-2 pr-5  flex items-center rounded-s-lg">
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="ml-2 text-base line-clamp-2">Nguyen Van Binh </div>
        </div>
    );
};

export default RoomChat;
