"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "@/components/ui/button";

function DarkModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="absolute size-4 scale-0 -rotate-90 transition-all duration-200 dark:scale-100 dark:rotate-0" />
      <Moon className="absolute size-4 scale-100 rotate-0 transition-all duration-200 dark:scale-0 dark:-rotate-90" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default DarkModeToggle;
