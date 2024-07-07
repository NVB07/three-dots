import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header/Header";
import AuthProvider from "@/context/AuthProvider";
import Navigate from "@/components/header/Navigate";
import ProgressBar from "@/components/progress/ProgressBar";

import { BlogProvider } from "@/context/BlogContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Three dots",
    description: "Mạng xã hội Three dost",
    twitter: {
        card: "summary",
        title: "Three dots",
        description: "Mạng xã hội Three dost",
        creator: "@Nbzznbv",
        images: [
            "https://firebasestorage.googleapis.com/v0/b/social-chat-d2b4e.appspot.com/o/appLogo%2Flogo320.png?alt=media&token=01efb0bb-032d-42cf-8475-be635cda6c78",
        ], // Must be an absolute URL
    },
};

export default function RootLayout({ children }) {
    return (
        <>
            <html lang="vi" suppressHydrationWarning>
                <body className={inter.className}>
                    <ProgressBar>
                        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                            <AuthProvider>
                                <Toaster />
                                <Header />
                                <BlogProvider>{children}</BlogProvider>
                                <div className="backdrop-blur-md bg-[hsl(var(--background)/87%)] sticky w-full flex justify-center bottom-0 z-50 left-0 sm:hidden">
                                    <Navigate />
                                </div>
                            </AuthProvider>
                        </ThemeProvider>
                    </ProgressBar>
                </body>
            </html>
        </>
    );
}
