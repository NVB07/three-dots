import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Message = ({ message = "", myMessage = false, photoURL }) => {
    return (
        <div className={`flex items-end my-3 mr-4 ${myMessage ? "flex-row-reverse" : "justify-start"}`}>
            {!myMessage ? (
                <Avatar className="w-7 h-7">
                    <AvatarImage src={photoURL} alt="@shadcn" />
                    <AvatarFallback>TD</AvatarFallback>
                </Avatar>
            ) : null}
            <div className={`ml-1.5 max-w-[75%] ${myMessage ? "bg-[#3797f0] text-white content-end " : "bg-accent"}   py-1 px-2.5 rounded-2xl `}>
                <p style={{ wordBreak: "break-word" }} className=" break-words   max-w-full text-sm">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default Message;