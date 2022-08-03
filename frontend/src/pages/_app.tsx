import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../../styles/globals.css'
import GoTop from '../components/GoTop'
import NavBar from '../components/NavBar'
import { AuthProvider } from '../contexts/AuthContext'
import { SearchProvider } from '../contexts/SearchContext'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <SearchProvider>
                <AuthProvider>
                    <Head>
                        <title>Bat Dev</title>
                        <link
                            rel="icon"
                            sizes="32x32"
                            href="/image/favicon.ico"
                        />
                    </Head>
                    <NavBar />
                    <Component {...pageProps} />
                    <GoTop />
                </AuthProvider>
            </SearchProvider>
        </>
    )
}

export default MyApp
