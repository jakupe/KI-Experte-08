import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'
import '../styles/game.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Endzeit Überleben - Point & Click Survival Game</title>
        <meta name="description" content="Überlebe 3 Tage in der Endzeit! Sammle Ressourcen, craft Gegenstände und erkunde verlassene Orte." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="survival, game, endzeit, point and click, crafting, überleben" />
        <meta name="author" content="Endzeit Survival Game" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Endzeit Überleben - Point & Click Survival Game" />
        <meta property="og:description" content="Überlebe 3 Tage in der Endzeit! Sammle Ressourcen, craft Gegenstände und erkunde verlassene Orte." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/og-image.jpg" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Preload jQuery for better performance */}
        <link rel="preload" href="https://code.jquery.com/jquery-3.7.1.min.js" as="script" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
