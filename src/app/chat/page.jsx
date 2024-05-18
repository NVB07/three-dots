const ChatPage = ({ children }) => {
    return <>{children ? children : <div className="w-full h-screen flex items-center justify-center">Hãy chọn 1 người bạn để bắt đầu chat</div>}</>;
};

export default ChatPage;
