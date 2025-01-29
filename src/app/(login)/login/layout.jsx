import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Đăng nhập",
    description: "Đăng nhập để vào Three Dots",
};
export default function LoginLayout({ children }) {
    return (
        <html lang="vi" suppressHydrationWarning>
            <body className={inter.className}>{children}</body>
        </html>
    );
}
