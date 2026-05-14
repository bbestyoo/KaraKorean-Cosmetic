"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem("theme") as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const value = theme === "dark" ? "dark" : "light";
    root.setAttribute("data-theme", value);
    body.setAttribute("data-theme", value);
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const stored = window.localStorage.getItem("theme");
      if (!stored) setTheme(media.matches ? "dark" : "light");
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  if (!mounted) {
    return <div className="w-12 h-7" />; // Placeholder to prevent hydration mismatch
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(prev => (prev === "dark" ? "light" : "dark"))}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-accent"
      style={{
        backgroundColor: theme === "dark" ? "var(--accent)" : "rgba(0,0,0,0.1)",
        border: "1px solid var(--line-color)"
      }}
    >
      <span
        className={`${
          theme === "dark" ? "translate-x-6" : "translate-x-1"
        } inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out`}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
