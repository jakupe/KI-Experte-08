import { useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'

// Dynamically import the game component to avoid SSR issues
const Game = dynamic(() => import('../components/Game'), {
  ssr: false,
  loading: () => (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <p>Lade Endzeit Überleben...</p>
    </div>
  )
})

export default function Home() {
  useEffect(() => {
    // Load jQuery dynamically
    const script = document.createElement('script')
    script.src = 'https://code.jquery.com/jquery-3.7.1.min.js'
    script.async = true
    script.onload = () => {
      // jQuery is loaded, game can initialize
      console.log('jQuery loaded successfully')
    }
    document.head.appendChild(script)

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return (
    <>
      <Head>
        <title>Endzeit Überleben - Point & Click Survival Game</title>
        <meta name="description" content="Überlebe 3 Tage in der Endzeit! Sammle Ressourcen, craft Gegenstände und erkunde verlassene Orte." />
      </Head>
      
      <main className="main-container">
        <Game />
      </main>
    </>
  )
}
