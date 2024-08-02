import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header/Header";
import AuthProvider from "@/context/AuthProvider";
import { BlogProvider } from "@/context/BlogContext";
import NotificationProvider from "@/context/NotificationProvider";
import Navigate from "@/components/header/Navigate";
import ProgressBar from "@/components/progress/ProgressBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Three dots",
    description: "Mạng xã hội Three dost",
    twitter: {
        card: "summary",
        title: "Three dots",
        description: "Mạng xã hội Three dost",
        creator: "@Nbzznbv",
        images: ["https://raw.githubusercontent.com/NVB07/three-dots/master/public/logo128.png"], // Must be an absolute URL
    },
    openGraph: {
        title: "Three dots",
        description: "Mạng xã hội Three dost",
        url: "https://three-dots.vercel.app/",
        siteName: "Three dots",
        images: [
            {
                url: "https://raw.githubusercontent.com/NVB07/three-dots/master/public/logo128.png", // Must be an absolute URL
                width: 320,
                height: 320,
            },
            {
                url: "https://raw.githubusercontent.com/NVB07/three-dots/master/public/logo320.png", // Must be an absolute URL
                width: 800,
                height: 800,
                alt: "Three dost logo",
            },
        ],
        locale: "vi_VN",
        type: "website",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="vi" suppressHydrationWarning>
            <body className={inter.className}>
                <ProgressBar>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                        <AuthProvider>
                            <Toaster richColors />
                            <NotificationProvider>
                                <Header />
                                <BlogProvider>{children}</BlogProvider>
                                <div className="backdrop-blur-md bg-[hsl(var(--background)/87%)] sticky w-full flex justify-center bottom-0 z-50 left-0 sm:hidden">
                                    <Navigate />
                                </div>
                            </NotificationProvider>
                        </AuthProvider>
                    </ThemeProvider>
                </ProgressBar>
            </body>
        </html>
    );
}
