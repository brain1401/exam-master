"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "./button";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function ToggleThemeButton() {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    if (resolvedTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  useEffect(() => {
    console.log("resolvedTheme :", resolvedTheme);
  }, [resolvedTheme]);

  return (
    <Button size="icon" variant="outline" onClick={() => toggleTheme()}>
      <Moon className="block dark:hidden" />
      <Sun className="hidden dark:block" />
    </Button>
  );
}
