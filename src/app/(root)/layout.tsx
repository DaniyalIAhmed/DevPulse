import React from "react";
import Header from "@/features/home/components/Header";
import Footer from "@/features/home/components/Footer";
import { cn } from "@/lib/utils";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <div
                className={cn(
                    "absolute inset-0",
                    "[background-size:40px_40px]",
                    "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
                    "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
                )}
            />
            <main className="z-20 relative w-full pt-0 md:pt-0">
                {children}
            </main>
            <Footer />
        </>
    )
}