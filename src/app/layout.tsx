import NavBar from '@/components/nav-bar'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { MuiProvider } from '@/contexts/MuiContext'
import { SearchProvider } from '@/contexts/SearchContext'
import { DarkModeProvider } from '@/contexts/DarkModeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import Footer from '@/components/footer'
import GoTop from '@/components/go-top'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BatDev',
  description: 'A place for your development stories',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <MuiProvider>
          <SearchProvider>
            <DarkModeProvider>
              <AuthProvider>
                <NavBar />
                {children}
                <GoTop />
                <Footer />
              </AuthProvider>
            </DarkModeProvider>
          </SearchProvider>
        </MuiProvider>
        </body>
    </html>
  )
}
