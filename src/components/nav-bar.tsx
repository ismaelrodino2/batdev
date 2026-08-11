"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./theme-toggle";
import { NAV, SITE } from "@/lib/site";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-3 sm:px-8"
      >
        <Link
          href="/"
          className="text-lg font-extrabold tracking-tight sm:text-xl"
        >
          {SITE.name}
        </Link>

        <ul className="ml-auto flex items-center gap-5 text-[11px] font-extrabold uppercase tracking-label sm:gap-7 sm:text-xs">
          {NAV.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  data-active={active}
                  aria-current={active ? "page" : undefined}
                  className="underline-sweep inline-block text-ink transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="ml-1 sm:ml-3">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
