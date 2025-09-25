import { useEffect, useRef } from 'react'
import { EndzeitSurvivalGame } from '../lib/game'

declare global {
  interface Window {
    $: any
    game: EndzeitSurvivalGame
  }
}

export default function Game() {
  const gameContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Warten bis jQuery geladen ist
    const initializeGame = () => {
      if (window.$ && gameContainerRef.current) {
        try {
          // Spiel initialisieren
          window.game = new EndzeitSurvivalGame(window.$)
          console.log('🎮 Endzeit Überleben - Spiel gestartet!')
          console.log('📋 Verfügbare Befehle: I (Inventar), C (Crafting), H (Hilfe)')
          console.log('🎯 Ziel: Überlebe 3 Tage in der Endzeit!')
        } catch (error) {
          console.error('Fehler beim Initialisieren des Spiels:', error)
        }
      } else {
        // jQuery noch nicht geladen, nochmal versuchen
        setTimeout(initializeGame, 100)
      }
    }

    initializeGame()

    // Cleanup
    return () => {
      if (window.game) {
        // Event-Listener entfernen
        window.$(document).off('keydown')
        window.$('.nav-button').off('click')
        window.$('#nextDayBtn').off('click')
        window.$('#inventoryToggle').off('click')
        window.$('#craftingToggle').off('click')
        window.$('#useItemBtn').off('click')
        window.$('#soundToggle').off('click')
        window.$('#restartBtn').off('click')
        window.$('#closeHelpBtn').off('click')
        window.$('#helpBtn').off('click')
        window.$('#gameModal').off('click')
        window.$('#helpModal').off('click')
      }
    }
  }, [])

  return (
    <div id="gameContainer" ref={gameContainerRef}>
      {/* Header mit Spielstatus */}
      <header id="gameHeader">
        <div className="status-bar">
          <div className="status-item">
            <span className="status-label">Gesundheit:</span>
            <div className="health-bar">
              <div id="healthFill" className="health-fill"></div>
            </div>
            <span id="healthText">100/100</span>
          </div>
          <div className="status-item">
            <span className="status-label">Hunger:</span>
            <div className="hunger-bar">
              <div id="hungerFill" className="hunger-fill"></div>
            </div>
            <span id="hungerText">100/100</span>
          </div>
          <div className="status-item">
            <span className="status-label">Tag:</span>
            <span id="dayCounter">1</span>
          </div>
          <div className="status-item">
            <span className="status-label">Kapitel:</span>
            <span id="chapterCounter">1</span>
          </div>
        </div>
      </header>

      {/* Hauptspielbereich */}
      <main id="gameMain">
        {/* Aktuelle Szene */}
        <div id="sceneContainer">
          <div id="currentScene" className="scene">
            <div id="sceneImage" className="scene-image"></div>
            <div id="hiddenObjects" className="hidden-objects"></div>
          </div>
          
          {/* Navigation zwischen Szenen */}
          <div id="sceneNavigation">
            <button className="nav-button" data-scene="house">🏠 Zerstörtes Haus</button>
            <button className="nav-button" data-scene="street">🚧 Straßensperre</button>
            <button className="nav-button" data-scene="supermarket">🏪 Supermarkt</button>
          </div>
        </div>

        {/* Inventar Panel */}
        <div id="inventoryPanel" className="panel">
          <h3>Inventar</h3>
          <div id="inventoryGrid" className="inventory-grid">
            {/* Inventar-Slots werden dynamisch erstellt */}
          </div>
        </div>

        {/* Crafting Panel */}
        <div id="craftingPanel" className="panel">
          <h3>Crafting</h3>
          <div id="craftingRecipes" className="recipes-list">
            {/* Rezepte werden dynamisch geladen */}
          </div>
        </div>
      </main>

      {/* Aktionsbereich */}
      <div id="actionArea">
        <button id="nextDayBtn" className="action-button">🌙 Nacht verbringen</button>
        <button id="inventoryToggle" className="action-button">📦 Inventar (I)</button>
        <button id="craftingToggle" className="action-button">🔨 Crafting (C)</button>
        <button id="useItemBtn" className="action-button">🍽️ Item verwenden (U)</button>
        <button id="soundToggle" className="action-button">🔊 Sound (S)</button>
      </div>

      {/* Nachrichtenbereich */}
      <div id="messageArea">
        <div id="messageText">Willkommen in der Endzeit! Sammle Ressourcen und überlebe 3 Tage.</div>
      </div>

      {/* Game Over / Victory Modal */}
      <div id="gameModal" className="modal hidden">
        <div className="modal-content">
          <h2 id="modalTitle">Spiel beendet</h2>
          <p id="modalMessage">Nachricht</p>
          <button id="restartBtn" className="action-button">🔄 Neues Spiel</button>
        </div>
      </div>

      {/* Hilfe Modal */}
      <div id="helpModal" className="modal hidden">
        <div className="modal-content">
          <h2>Spielanleitung</h2>
          <div className="help-content">
            <h3>Ziel:</h3>
            <p>Überlebe 3 Tage in der Endzeit! Sammle Ressourcen, craft Gegenstände und halte deine Gesundheit und deinen Hunger im grünen Bereich.</p>
            
            <h3>Steuerung:</h3>
            <ul>
              <li><strong>Mausklick:</strong> Interagiere mit Objekten in der Szene</li>
              <li><strong>I:</strong> Inventar öffnen/schließen</li>
              <li><strong>C:</strong> Crafting-Panel öffnen/schließen</li>
              <li><strong>U:</strong> Ausgewähltes Item verwenden</li>
              <li><strong>S:</strong> Sound ein-/ausschalten</li>
              <li><strong>H:</strong> Diese Hilfe anzeigen</li>
            </ul>

            <h3>Crafting-Rezepte:</h3>
            <ul>
              <li><strong>Messer:</strong> Metall + Stoff</li>
              <li><strong>Lagerfeuer:</strong> Holz + Stoff</li>
              <li><strong>Verband:</strong> Stoff + Stoff</li>
              <li><strong>Werkzeugkasten:</strong> Metall + Holz</li>
              <li><strong>Rationen:</strong> Essen + Essen</li>
              <li><strong>Funkgerät:</strong> Metall + Metall + Metall</li>
            </ul>

            <h3>Tipps:</h3>
            <ul>
              <li>Jede Nacht reduziert deinen Hunger - ohne Essen stirbst du!</li>
              <li>Klicke auf versteckte Objekte in den Szenen</li>
              <li>Verwende Lagerfeuer um Hunger zu reduzieren</li>
              <li>Verbande heilt deine Gesundheit</li>
              <li>Werkzeugkasten gibt dir bessere Ressourcen</li>
              <li>Rationen sind effektiver als normales Essen</li>
              <li>Funkgerät schaltet neue Kapitel frei!</li>
            </ul>
          </div>
          <button id="closeHelpBtn" className="action-button">Schließen</button>
        </div>
      </div>

      {/* Hilfe Button */}
      <button id="helpBtn" className="help-button">❓ Hilfe (H)</button>
    </div>
  )
}
