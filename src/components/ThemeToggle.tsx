import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card/70 text-muted-foreground shadow-sm transition hover:bg-card hover:text-foreground"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <span className="relative flex h-4 w-4 items-center justify-center">
        <Sun
          className={`absolute h-4 w-4 transition-transform duration-200 ${isDark ? "scale-0 rotate-90" : "scale-100 rotate-0"}`}
        />
        <Moon
          className={`absolute h-4 w-4 transition-transform duration-200 ${isDark ? "scale-100 rotate-0" : "scale-0 -rotate-90"}`}
        />
      </span>
    </button>
  );
}

