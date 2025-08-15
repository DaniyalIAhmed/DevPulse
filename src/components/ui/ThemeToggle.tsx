"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";


export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="cursor-pointer">
            {theme === "dark" ? <Sun className="size-5 text-white" /> : <Moon className="size-5 text-black" />}
        </div>
    )
}