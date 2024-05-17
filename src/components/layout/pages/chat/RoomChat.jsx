import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const RoomChat = ({ avatarSRC = "", avatarFallback = "?", name }) => {
    return (
        <div className="w-full my-1 h-16 cursor-pointer hover:bg-accent p-2 pr-5  flex items-center rounded-s-lg">
            <Avatar>
                <AvatarImage src={avatarSRC} alt="@shadcn" />
                <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
            <div className="ml-2 hidden sm:block text-base line-clamp-2">{name}</div>
        </div>
    );
};

export default RoomChat;
