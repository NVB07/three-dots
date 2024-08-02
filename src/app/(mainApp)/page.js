"use client";
import Footer from "@/components/footer/Footer";
import HomePage from "@/components/pages/homePage/HomePage";
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
export default function Home() {
    return (
        <QueryClientProvider client={queryClient}>
            <main>
                <HomePage />
            </main>
            <Footer />
        </QueryClientProvider>
    );
}
