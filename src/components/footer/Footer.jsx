const Footer = () => {
    return (
        <footer className="p-4 hidden font-mono items-center justify-between bg-background border-t border-border sm:flex">
            <a target="_blank" className="flex items-center justify-center w-1/3 " href="https://www.facebook.com/binh.jupiter">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07" />
                </svg>
                <span className="ml-2 hover:underline"> binh.jupiter</span>
            </a>
            <aside className="flex w-1/3 items-center justify-center">
                <p className="font-mono  ">
                    <span className="text-xl">©</span> Three dots 2024
                </p>
            </aside>
            <a href="mailto:nvbinh.zzz@gmail.com" target="_blank" className="flex items-center justify-center w-1/3">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span target="_blank" className="ml-2 hover:underline">
                    nvbinh.zzz@gmail.com
                </span>
            </a>
        </footer>
    );
};

export default Footer;
