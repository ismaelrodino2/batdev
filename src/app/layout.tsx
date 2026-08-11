import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import Footer from "@/components/footer";
import NavBar from "@/components/nav-bar";
import { SITE } from "@/lib/site";
import "./globals.css";

// Self-hosted by next/font — no runtime request to Google, so the CSP can keep
// `font-src 'self'`.
const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-raleway"
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`
  },
  description: SITE.description,
  authors: [{ name: SITE.author.fullName, url: SITE.author.portfolio }],
  creator: SITE.author.fullName,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": `${SITE.url}/rss.xml` }
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    url: SITE.url,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    // 1200×630 JPEG derived from public/batnoir2.png. Social scrapers don't go
    // through the image optimizer, so this one is pre-sized by hand.
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${SITE.name} — ${SITE.tagline}` }]
  },
  twitter: { card: "summary_large_image" }
};

// Runs before first paint so the page never flashes the wrong palette.
// Mirrors the storage key used by components/theme-toggle.tsx.
const themeScript = `(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d){document.documentElement.classList.add('theme-dark')}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={raleway.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
        >
          Skip to content
        </a>
        <NavBar />
        <main id="content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
