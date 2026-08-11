"use client";

import { useEffect, useState } from "react";

/**
 * The initial theme is applied by the blocking script in `layout.tsx` so the
 * page never flashes the wrong palette. This component only mirrors and
 * mutates that state, which is why it reads from the DOM on mount.
 */
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("theme-dark"));
    setMounted(true);
  }, []);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("theme-dark", next);
    try {
      window.localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* private mode — the choice just won't persist */
    }
    setDark(next);
  }

  const showSun = mounted && dark;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch colour theme"
      title="Switch colour theme"
      className="flex size-9 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-line-strong hover:text-ink"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4"
      >
        {showSun ? (
          <path d="M12 3v1.5m0 15V21m9-9h-1.5m-15 0H3m15.36-6.36l-1.06 1.06M6.7 17.3l-1.06 1.06m12.72 0l-1.06-1.06M6.7 6.7L5.64 5.64M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        ) : (
          <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
        )}
      </svg>
    </button>
  );
}
