import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "../ui/button";

interface ThemeToggleProps {
  initialTheme?: boolean;
  onThemeChange?: (isDark: boolean) => void;
}

const ThemeToggle = ({ initialTheme, onThemeChange }: ThemeToggleProps) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (initialTheme !== undefined) return initialTheme;

    // Check system preference or saved preference
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    // Apply theme to document
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", newTheme);
    }

    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };

  // Effect for initial theme setup
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", isDarkMode);
    }
  }, []);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full"
    >
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};

export default ThemeToggle;
