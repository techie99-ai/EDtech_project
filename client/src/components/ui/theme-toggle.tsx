"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Initialize theme based on system preference or localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    
    if (!isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full bg-background/10 backdrop-blur border-border"
    >
      <motion.div
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative h-5 w-5 overflow-hidden"
      >
        <Sun className={`h-5 w-5 absolute top-0 left-0 transform transition-all duration-500 ${isDark ? "opacity-0 translate-y-full" : "opacity-100 translate-y-0"}`} />
        <Moon className={`h-5 w-5 absolute top-0 left-0 transform transition-all duration-500 ${isDark ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"}`} />
      </motion.div>
    </Button>
  );
}