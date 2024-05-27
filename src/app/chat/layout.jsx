import Chat from "@/components/pages/chat/Chat";

export default function RootLayout({ children }) {
    return (
        <>
            <Chat>{children}</Chat>
        </>
    );
}
