"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark" | "system";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    root.classList.toggle("dark", prefersDark);
  } else {
    root.classList.toggle("dark", theme === "dark");
  }
}

function getTheme(): Theme {
  const raw = localStorage.getItem("theme");
  if (raw === "light" || raw === "dark" || raw === "system") return raw;
  return "system";
}

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setStoredTheme(theme: Theme) {
  localStorage.setItem("theme", theme);
  applyTheme(theme);
  emit();
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "system");

  const cycle = () => {
    const next: Theme =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setStoredTheme(next);
  };

  const label =
    theme === "light" ? "Light" : theme === "dark" ? "Dark" : "System";

  return (
    <button
      type="button"
      onClick={cycle}
      suppressHydrationWarning
      className="rounded-full border border-zinc-300/80 bg-white/80 px-3 py-1.5 text-xs font-medium text-zinc-800 shadow-sm backdrop-blur transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-100 dark:hover:bg-zinc-800"
      aria-label={`Theme: ${label}. Click to cycle.`}
    >
      {label}
    </button>
  );
}
