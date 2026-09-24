"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/app-context";

export function ThemeToggle() {
  const { theme, toggleTheme } = useAppContext();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon /> : <Sun />}
    </Button>
  );
}
