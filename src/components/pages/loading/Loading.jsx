import Logo from "@/components/icons/Logo";

const Loading = () => {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center ">
            <Logo style="animate-bubble" color="hsl(var(--foreground))" />
            <span className="text-6xl font-bold text-[#0d9b00]">Three dots</span>
        </div>
    );
};

export default Loading;
