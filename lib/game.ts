/**
 * Endzeit Survival Game - Hauptspiel-Logik
 * Optimiert für Next.js und jQuery
 */

import { 
  GameState, 
  GameScenes, 
  CraftingRecipe, 
  SoundSystem, 
  GameElements,
  GameConfig,
  ItemType,
  SceneType,
  SoundType
} from './types'

export class EndzeitSurvivalGame {
  private gameState: GameState
  private inventory: Map<string, number>
  private craftingRecipes: CraftingRecipe[]
  private scenes: GameScenes
  private sounds: SoundSystem
  private elements: GameElements
  private config: GameConfig
  private $: any // jQuery

  constructor(jQuery: any) {
    this.$ = jQuery
    this.config = {
      maxInventorySlots: 12,
      defaultHealth: 100,
      defaultHunger: 100,
      hungerPerDay: 30,
      healthLossWhenHungry: 25,
      soundVolume: 0.3
    }

    this.initializeGameState()
    this.initializeCraftingRecipes()
    this.initializeScenes()
    this.initializeSounds()
    this.initializeElements()
    this.initializeEventListeners()
    this.initializeGame()
  }

  /**
   * Spielzustand initialisieren
   */
  private initializeGameState(): void {
    this.gameState = {
      currentScene: 'house',
      day: 1,
      maxDays: 3,
      health: this.config.defaultHealth,
      maxHealth: this.config.defaultHealth,
      hunger: this.config.defaultHunger,
      maxHunger: this.config.defaultHunger,
      gameOver: false,
      victory: false,
      chapter: 1,
      maxChapters: 3,
      soundEnabled: true,
      selectedItem: null
    }
  }

  /**
   * Crafting-Rezepte definieren
   */
  private initializeCraftingRecipes(): void {
    this.craftingRecipes = [
      {
        id: 'knife',
        name: 'Messer',
        icon: '🔪',
        ingredients: { metal: 1, fabric: 1 },
        description: 'Ein scharfes Messer für bessere Ressourcengewinnung'
      },
      {
        id: 'campfire',
        name: 'Lagerfeuer',
        icon: '🔥',
        ingredients: { wood: 2, fabric: 1 },
        description: 'Wärmt dich und reduziert Hunger'
      },
      {
        id: 'bandage',
        name: 'Verband',
        icon: '🩹',
        ingredients: { fabric: 2 },
        description: 'Heilt deine Gesundheit'
      },
      {
        id: 'toolbox',
        name: 'Werkzeugkasten',
        icon: '🧰',
        ingredients: { metal: 2, wood: 1 },
        description: 'Gibt dir bessere Ressourcen beim Sammeln'
      },
      {
        id: 'rations',
        name: 'Rationen',
        icon: '🍽️',
        ingredients: { food: 2 },
        description: 'Nahrhafte Rationen - stillt Hunger effektiv'
      },
      {
        id: 'radio',
        name: 'Funkgerät',
        icon: '📻',
        ingredients: { metal: 3 },
        description: 'Schaltet neue Kapitel frei!'
      }
    ]
  }

  /**
   * Szenen definieren
   */
  private initializeScenes(): void {
    this.scenes = {
      house: {
        name: 'Zerstörtes Haus',
        background: '🏠',
        description: 'Ein halb zerstörtes Haus. Hier findest du vielleicht nützliche Gegenstände.',
        objects: [
          { id: 'wood1', name: 'Holzbalken', icon: '🪵', x: 20, y: 30, type: 'wood', amount: 1 },
          { id: 'fabric1', name: 'Stofffetzen', icon: '🧵', x: 70, y: 40, type: 'fabric', amount: 1 },
          { id: 'drawer', name: 'Schublade', icon: '🗄️', x: 50, y: 60, type: 'container', items: ['metal', 'fabric'] }
        ],
        hiddenObjects: [
          { id: 'hidden1', name: 'Verstecktes Metall', type: 'metal', amount: 1, x: 15, y: 20 },
          { id: 'hidden2', name: 'Verstecktes Essen', type: 'food', amount: 1, x: 80, y: 70 }
        ]
      },
      street: {
        name: 'Straßensperre',
        background: '🚧',
        description: 'Eine verlassene Straßensperre. Metallteile und Werkzeuge liegen herum.',
        objects: [
          { id: 'metal1', name: 'Metallschrott', icon: '🔩', x: 30, y: 25, type: 'metal', amount: 1 },
          { id: 'metal2', name: 'Eisenstange', icon: '⚙️', x: 60, y: 35, type: 'metal', amount: 1 },
          { id: 'wood2', name: 'Holzplanke', icon: '🪵', x: 80, y: 50, type: 'wood', amount: 1 }
        ],
        hiddenObjects: [
          { id: 'hidden3', name: 'Verstecktes Holz', type: 'wood', amount: 1, x: 10, y: 60 },
          { id: 'hidden4', name: 'Versteckter Stoff', type: 'fabric', amount: 1, x: 90, y: 30 }
        ]
      },
      supermarket: {
        name: 'Verlassener Supermarkt',
        background: '🏪',
        description: 'Ein geplünderter Supermarkt. Vielleicht findest du noch etwas Essbares.',
        objects: [
          { id: 'food1', name: 'Konservendose', icon: '🥫', x: 25, y: 40, type: 'food', amount: 1 },
          { id: 'fabric2', name: 'Kleidung', icon: '👕', x: 55, y: 30, type: 'fabric', amount: 1 },
          { id: 'crate', name: 'Kiste', icon: '📦', x: 75, y: 60, type: 'container', items: ['wood', 'metal', 'food'] }
        ],
        hiddenObjects: [
          { id: 'hidden5', name: 'Verstecktes Essen', type: 'food', amount: 1, x: 40, y: 80 },
          { id: 'hidden6', name: 'Verstecktes Metall', type: 'metal', amount: 1, x: 70, y: 15 }
        ]
      }
    }
  }

  /**
   * Sound-System initialisieren
   */
  private initializeSounds(): void {
    const createSound = (dataUrl: string): HTMLAudioElement => {
      const audio = new Audio(dataUrl)
      audio.volume = this.config.soundVolume
      return audio
    }

    this.sounds = {
      click: createSound('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'),
      collect: createSound('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'),
      craft: createSound('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'),
      use: createSound('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT')
    }
  }

  /**
   * UI-Elemente referenzieren
   */
  private initializeElements(): void {
    this.elements = {
      currentScene: this.$('#currentScene')[0],
      sceneImage: this.$('#sceneImage')[0],
      hiddenObjects: this.$('#hiddenObjects')[0],
      sceneNavigation: this.$('#sceneNavigation')[0],
      inventoryGrid: this.$('#inventoryGrid')[0],
      craftingRecipes: this.$('#craftingRecipes')[0],
      healthFill: this.$('#healthFill')[0],
      hungerFill: this.$('#hungerFill')[0],
      healthText: this.$('#healthText')[0],
      hungerText: this.$('#hungerText')[0],
      dayCounter: this.$('#dayCounter')[0],
      chapterCounter: this.$('#chapterCounter')[0],
      messageText: this.$('#messageText')[0],
      gameModal: this.$('#gameModal')[0],
      modalTitle: this.$('#modalTitle')[0],
      modalMessage: this.$('#modalMessage')[0],
      helpModal: this.$('#helpModal')[0]
    }
  }

  /**
   * Event-Listener registrieren
   */
  private initializeEventListeners(): void {
    // Tastatur-Shortcuts
    this.$(document).on('keydown', (e: KeyboardEvent) => {
      switch(e.key.toLowerCase()) {
        case 'i':
          this.toggleInventory()
          break
        case 'c':
          this.toggleCrafting()
          break
        case 'h':
          this.toggleHelp()
          break
        case 'u':
          this.useSelectedItem()
          break
        case 's':
          this.toggleSound()
          break
        case 'escape':
          this.closeModals()
          break
      }
    })

    // Szene-Navigation
    this.$('.nav-button').on('click', (e: Event) => {
      const sceneId = this.$(e.target).data('scene')
      this.changeScene(sceneId)
    })

    // Aktions-Buttons
    this.$('#nextDayBtn').on('click', () => this.nextDay())
    this.$('#inventoryToggle').on('click', () => this.toggleInventory())
    this.$('#craftingToggle').on('click', () => this.toggleCrafting())
    this.$('#useItemBtn').on('click', () => this.useSelectedItem())
    this.$('#soundToggle').on('click', () => this.toggleSound())

    // Modal-Buttons
    this.$('#restartBtn').on('click', () => this.restartGame())
    this.$('#closeHelpBtn').on('click', () => this.toggleHelp())
    this.$('#helpBtn').on('click', () => this.toggleHelp())

    // Modal-Hintergrund klicken zum Schließen
    this.$('#gameModal').on('click', (e: Event) => {
      if (e.target === this.elements.gameModal) {
        this.closeModals()
      }
    })

    this.$('#helpModal').on('click', (e: Event) => {
      if (e.target === this.elements.helpModal) {
        this.closeModals()
      }
    })
  }

  /**
   * Spiel initialisieren
   */
  private initializeGame(): void {
    this.inventory = new Map()
    this.loadScene(this.gameState.currentScene)
    this.updateUI()
    this.updateInventoryDisplay()
    this.updateCraftingDisplay()
    this.showMessage('Willkommen in der Endzeit! Sammle Ressourcen und überlebe 3 Tage.')
  }

  /**
   * Szene laden
   */
  private loadScene(sceneId: string): void {
    const scene = this.scenes[sceneId]
    if (!scene) return

    // Szene-Hintergrundbild setzen
    this.$(this.elements.sceneImage).removeClass().addClass(`scene-image scene-${sceneId}`)
    
    // Versteckte Objekte laden
    this.$(this.elements.hiddenObjects).empty()
    if (scene.hiddenObjects) {
      scene.hiddenObjects.forEach(obj => {
        const hiddenElement = this.$('<div>')
          .addClass('hidden-object')
          .css({ left: `${obj.x}%`, top: `${obj.y}%` })
          .attr('title', obj.name)
          .data('objectId', obj.id)
          .on('click', () => this.interactWithHiddenObject(obj))

        this.$(this.elements.hiddenObjects).append(hiddenElement)
      })
    }

    // Normale interaktive Objekte hinzufügen
    scene.objects.forEach(obj => {
      const objectElement = this.$('<div>')
        .addClass(`interactive-object object-${obj.type}`)
        .css({ left: `${obj.x}%`, top: `${obj.y}%` })
        .html(obj.icon)
        .attr('title', obj.name)
        .data('objectId', obj.id)
        .on('click', () => this.interactWithObject(obj))
        .on('mouseenter', (e: Event) => this.showTooltip(e, obj.name))
        .on('mouseleave', () => this.hideTooltip())

      this.$(this.elements.currentScene).append(objectElement)
    })
  }

  /**
   * Mit Objekt interagieren
   */
  private interactWithObject(obj: any): void {
    this.playSound('click')
    
    if (obj.type === 'container') {
      const randomItem = obj.items[Math.floor(Math.random() * obj.items.length)]
      this.addToInventory(randomItem, 1)
      this.showMessage(`Du findest ${this.getItemName(randomItem)} in der ${obj.name}!`)
    } else {
      this.addToInventory(obj.type, obj.amount || 1)
      this.showMessage(`Du sammelst ${obj.amount || 1}x ${obj.name}!`)
    }

    this.playSound('collect')

    // Objekt aus Szene entfernen
    this.$(`[data-object-id="${obj.id}"]`)
      .css({ opacity: '0.3', pointerEvents: 'none' })

    this.updateInventoryDisplay()
  }

  /**
   * Mit verstecktem Objekt interagieren
   */
  private interactWithHiddenObject(obj: any): void {
    this.playSound('click')
    
    this.addToInventory(obj.type, obj.amount || 1)
    this.showMessage(`Du findest verstecktes ${obj.name}!`)
    this.playSound('collect')

    // Objekt als gefunden markieren
    this.$(`[data-object-id="${obj.id}"]`)
      .addClass('found')
      .css('pointerEvents', 'none')

    this.updateInventoryDisplay()
  }

  /**
   * Item zum Inventar hinzufügen
   */
  private addToInventory(itemId: string, amount: number = 1): void {
    const currentAmount = this.inventory.get(itemId) || 0
    this.inventory.set(itemId, currentAmount + amount)
  }

  /**
   * Item aus Inventar entfernen
   */
  private removeFromInventory(itemId: string, amount: number = 1): boolean {
    const currentAmount = this.inventory.get(itemId) || 0
    if (currentAmount >= amount) {
      this.inventory.set(itemId, currentAmount - amount)
      if (this.inventory.get(itemId) === 0) {
        this.inventory.delete(itemId)
      }
      return true
    }
    return false
  }

  /**
   * Inventar-Anzeige aktualisieren
   */
  private updateInventoryDisplay(): void {
    this.$(this.elements.inventoryGrid).empty()

    // 12 Slots erstellen
    for (let i = 0; i < this.config.maxInventorySlots; i++) {
      const slot = this.$('<div>')
        .addClass('inventory-slot')
        .data('slotIndex', i)
      this.$(this.elements.inventoryGrid).append(slot)
    }

    // Items in Slots platzieren
    let slotIndex = 0
    for (const [itemId, amount] of this.inventory) {
      if (slotIndex >= this.config.maxInventorySlots) break

      const slot = this.$(this.elements.inventoryGrid).children().eq(slotIndex)
      slot.addClass('occupied')
        .html(`
          <div class="item-icon">${this.getItemIcon(itemId)}</div>
          <div class="item-count">${amount}</div>
        `)
        .attr('title', `${this.getItemName(itemId)} (${amount}) - Klick zum Auswählen`)
        .on('click', () => this.selectItem(itemId))
      
      slotIndex++
    }
  }

  /**
   * Crafting-Anzeige aktualisieren
   */
  private updateCraftingDisplay(): void {
    this.$(this.elements.craftingRecipes).empty()

    this.craftingRecipes.forEach(recipe => {
      const recipeElement = this.$('<div>')
        .addClass('recipe-item')
      
      if (this.canCraftRecipe(recipe)) {
        recipeElement.addClass('craftable')
      }

      recipeElement.html(`
        <div class="recipe-name">${recipe.icon} ${recipe.name}</div>
        <div class="recipe-ingredients">
          ${Object.entries(recipe.ingredients)
            .map(([item, amount]) => `${this.getItemIcon(item)} ${amount}x ${this.getItemName(item)}`)
            .join(', ')}
        </div>
      `).on('click', () => this.craftItem(recipe))

      this.$(this.elements.craftingRecipes).append(recipeElement)
    })
  }

  /**
   * Prüfen ob Rezept craftbar ist
   */
  private canCraftRecipe(recipe: CraftingRecipe): boolean {
    return Object.entries(recipe.ingredients).every(([item, amount]) => {
      return (this.inventory.get(item) || 0) >= amount
    })
  }

  /**
   * Item craften
   */
  private craftItem(recipe: CraftingRecipe): void {
    if (!this.canCraftRecipe(recipe)) {
      this.showMessage('Nicht genug Materialien!')
      return
    }

    // Zutaten verbrauchen
    Object.entries(recipe.ingredients).forEach(([item, amount]) => {
      this.removeFromInventory(item, amount)
    })

    // Fertiges Item hinzufügen
    this.addToInventory(recipe.id, 1)
    this.showMessage(`Du craftest: ${recipe.name}! ${recipe.description}`)
    this.playSound('craft')

    this.updateInventoryDisplay()
    this.updateCraftingDisplay()
  }

  /**
   * Nächster Tag
   */
  private nextDay(): void {
    this.gameState.day++
    
    // Hunger reduzieren
    this.gameState.hunger = Math.max(0, this.gameState.hunger - this.config.hungerPerDay)
    
    // Gesundheit reduzieren wenn zu hungrig
    if (this.gameState.hunger <= 0) {
      this.gameState.health = Math.max(0, this.gameState.health - this.config.healthLossWhenHungry)
    }

    // Warnung wenn wenig Hunger
    if (this.gameState.hunger <= 20) {
      this.showMessage(`⚠️ KRITISCH: Du verhungerst! Finde Essen oder stirb! Hunger: ${this.gameState.hunger}/100`)
    } else {
      this.showMessage(`Tag ${this.gameState.day} beginnt. Hunger: -${this.config.hungerPerDay}, Gesundheit: ${this.gameState.hunger <= 0 ? `-${this.config.healthLossWhenHungry}` : '0'}`)
    }

    // Sieg prüfen
    if (this.gameState.day > this.gameState.maxDays) {
      this.victory()
      return
    }

    // Game Over prüfen
    if (this.gameState.health <= 0) {
      this.gameOver()
      return
    }

    this.updateUI()
  }

  /**
   * Item verwenden
   */
  private useItem(itemId: string): void {
    this.playSound('use')
    
    switch(itemId) {
      case 'food':
        this.gameState.hunger = Math.min(this.gameState.maxHunger, this.gameState.hunger + 40)
        this.removeFromInventory('food', 1)
        this.showMessage('Du isst etwas. Hunger: +40')
        break
      case 'rations':
        this.gameState.hunger = Math.min(this.gameState.maxHunger, this.gameState.hunger + 60)
        this.removeFromInventory('rations', 1)
        this.showMessage('Du isst nahrhafte Rationen. Hunger: +60')
        break
      case 'bandage':
        this.gameState.health = Math.min(this.gameState.maxHealth, this.gameState.health + 30)
        this.removeFromInventory('bandage', 1)
        this.showMessage('Du verbindest deine Wunden. Gesundheit: +30')
        break
      case 'campfire':
        this.gameState.hunger = Math.min(this.gameState.maxHunger, this.gameState.hunger + 20)
        this.removeFromInventory('campfire', 1)
        this.showMessage('Das Lagerfeuer wärmt dich. Hunger: +20')
        break
      case 'radio':
        this.unlockNextChapter()
        this.removeFromInventory('radio', 1)
        this.showMessage('Das Funkgerät funktioniert! Neues Kapitel freigeschaltet!')
        break
      default:
        this.showMessage('Dieses Item kann nicht verwendet werden.')
        return
    }
    this.updateUI()
    this.updateInventoryDisplay()
  }

  /**
   * Nächstes Kapitel freischalten
   */
  private unlockNextChapter(): void {
    if (this.gameState.chapter < this.gameState.maxChapters) {
      this.gameState.chapter++
      this.showMessage(`Kapitel ${this.gameState.chapter} freigeschaltet!`)
      
      // Neue Szenen für höhere Kapitel freischalten
      if (this.gameState.chapter === 2) {
        this.addNewScene('bunker', {
          name: 'Geheimer Bunker',
          background: '🏗️',
          description: 'Ein geheimer Bunker mit wertvollen Ressourcen.',
          objects: [
            { id: 'metal3', name: 'Seltene Metalle', icon: '⚡', x: 30, y: 40, type: 'metal', amount: 2 },
            { id: 'food3', name: 'MRE Rationen', icon: '🍽️', x: 60, y: 30, type: 'food', amount: 2 }
          ],
          hiddenObjects: [
            { id: 'hidden7', name: 'Versteckte Rationen', type: 'rations', amount: 1, x: 20, y: 60 }
          ]
        })
      }
    }
  }

  /**
   * Neue Szene hinzufügen
   */
  private addNewScene(sceneId: string, sceneData: any): void {
    this.scenes[sceneId] = sceneData
    
    // Navigation-Button hinzufügen
    const navButton = this.$('<button>')
      .addClass('nav-button')
      .data('scene', sceneId)
      .text(`${sceneData.background} ${sceneData.name}`)
      .on('click', () => this.changeScene(sceneId))
    
    this.$(this.elements.sceneNavigation).append(navButton)
  }

  /**
   * Szene wechseln
   */
  private changeScene(sceneId: string): void {
    if (this.scenes[sceneId]) {
      this.gameState.currentScene = sceneId
      this.loadScene(sceneId)
      this.updateSceneNavigation()
      this.showMessage(`Du betrittst: ${this.scenes[sceneId].name}`)
    }
  }

  /**
   * Szene-Navigation aktualisieren
   */
  private updateSceneNavigation(): void {
    this.$('.nav-button').removeClass('active')
    this.$(`[data-scene="${this.gameState.currentScene}"]`).addClass('active')
  }

  /**
   * Ausgewähltes Item verwenden
   */
  private useSelectedItem(): void {
    if (!this.gameState.selectedItem) {
      this.showMessage('Wähle zuerst ein Item aus dem Inventar aus!')
      return
    }
    
    this.useItem(this.gameState.selectedItem)
    this.gameState.selectedItem = null
  }

  /**
   * Item auswählen
   */
  private selectItem(itemId: string): void {
    this.gameState.selectedItem = itemId
    this.showMessage(`${this.getItemName(itemId)} ausgewählt. Drücke U oder klicke "Item verwenden".`)
    
    // Visuelles Feedback
    this.$('.inventory-slot').removeClass('selected')
    this.$('.inventory-slot').each((index: number, element: HTMLElement) => {
      if (this.$(element).text().includes(this.getItemIcon(itemId))) {
        this.$(element).addClass('selected')
      }
    })
  }

  /**
   * Sound ein-/ausschalten
   */
  private toggleSound(): void {
    this.gameState.soundEnabled = !this.gameState.soundEnabled
    this.$('#soundToggle').text(this.gameState.soundEnabled ? '🔊 Sound (S)' : '🔇 Sound (S)')
    this.showMessage(`Sound ${this.gameState.soundEnabled ? 'eingeschaltet' : 'ausgeschaltet'}`)
  }

  /**
   * Sound abspielen
   */
  private playSound(soundType: SoundType): void {
    if (this.gameState.soundEnabled && this.sounds[soundType]) {
      this.sounds[soundType].play().catch((e: Error) => {
        console.log('Sound konnte nicht abgespielt werden:', e)
      })
    }
  }

  /**
   * UI aktualisieren
   */
  private updateUI(): void {
    // Gesundheit
    const healthPercent = (this.gameState.health / this.gameState.maxHealth) * 100
    this.$(this.elements.healthFill).css('width', `${healthPercent}%`)
    this.$(this.elements.healthText).text(`${this.gameState.health}/${this.gameState.maxHealth}`)
    
    // Gesundheit-Bar-Farbe
    this.$(this.elements.healthFill).removeClass('health-low health-medium health-high')
    if (healthPercent <= 30) this.$(this.elements.healthFill).addClass('health-low')
    else if (healthPercent <= 60) this.$(this.elements.healthFill).addClass('health-medium')
    else this.$(this.elements.healthFill).addClass('health-high')

    // Hunger
    const hungerPercent = (this.gameState.hunger / this.gameState.maxHunger) * 100
    this.$(this.elements.hungerFill).css('width', `${hungerPercent}%`)
    this.$(this.elements.hungerText).text(`${this.gameState.hunger}/${this.gameState.maxHunger}`)
    
    // Hunger-Bar-Farbe
    this.$(this.elements.hungerFill).removeClass('hunger-low hunger-medium hunger-high')
    if (hungerPercent <= 30) this.$(this.elements.hungerFill).addClass('hunger-low')
    else if (hungerPercent <= 60) this.$(this.elements.hungerFill).addClass('hunger-medium')
    else this.$(this.elements.hungerFill).addClass('hunger-high')

    // Tag und Kapitel
    this.$(this.elements.dayCounter).text(this.gameState.day)
    this.$(this.elements.chapterCounter).text(this.gameState.chapter)
  }

  /**
   * Nachricht anzeigen
   */
  private showMessage(message: string): void {
    this.$(this.elements.messageText).text(message)
    this.$(this.elements.messageText).parent().addClass('pulse')
    setTimeout(() => {
      this.$(this.elements.messageText).parent().removeClass('pulse')
    }, 2000)
  }

  /**
   * Tooltip anzeigen
   */
  private showTooltip(event: Event, text: string): void {
    const tooltip = this.$('<div>')
      .addClass('tooltip')
      .text(text)
      .css({
        left: `${(event as MouseEvent).pageX + 10}px`,
        top: `${(event as MouseEvent).pageY - 30}px`
      })
    
    this.$('body').append(tooltip)
  }

  /**
   * Tooltip verstecken
   */
  private hideTooltip(): void {
    this.$('.tooltip').remove()
  }

  /**
   * Inventar ein-/ausblenden
   */
  private toggleInventory(): void {
    this.$('#inventoryPanel').toggleClass('hidden')
  }

  /**
   * Crafting ein-/ausblenden
   */
  private toggleCrafting(): void {
    this.$('#craftingPanel').toggleClass('hidden')
  }

  /**
   * Hilfe ein-/ausblenden
   */
  private toggleHelp(): void {
    this.$('#helpModal').toggleClass('hidden')
  }

  /**
   * Alle Modals schließen
   */
  private closeModals(): void {
    this.$('#gameModal').addClass('hidden')
    this.$('#helpModal').addClass('hidden')
  }

  /**
   * Sieg-Screen anzeigen
   */
  private victory(): void {
    this.gameState.victory = true
    this.$(this.elements.modalTitle).text('🎉 Sieg!')
    this.$(this.elements.modalMessage).text('Glückwunsch! Du hast 3 Tage in der Endzeit überlebt! Du bist ein wahrer Überlebenskünstler.')
    this.$('#gameModal').removeClass('hidden')
  }

  /**
   * Game Over-Screen anzeigen
   */
  private gameOver(): void {
    this.gameState.gameOver = true
    this.$(this.elements.modalTitle).text('💀 Game Over')
    this.$(this.elements.modalMessage).text('Du hast es nicht geschafft. Deine Gesundheit ist auf 0 gesunken. Versuche es nochmal!')
    this.$('#gameModal').removeClass('hidden')
  }

  /**
   * Spiel neu starten
   */
  private restartGame(): void {
    this.initializeGameState()
    this.inventory.clear()
    this.closeModals()
    this.initializeGame()
  }

  /**
   * Item-Icon basierend auf ID
   */
  private getItemIcon(itemId: string): string {
    const icons: Record<string, string> = {
      wood: '🪵',
      metal: '🔩',
      fabric: '🧵',
      food: '🥫',
      knife: '🔪',
      campfire: '🔥',
      bandage: '🩹',
      toolbox: '🧰',
      rations: '🍽️',
      radio: '📻'
    }
    return icons[itemId] || '❓'
  }

  /**
   * Item-Name basierend auf ID
   */
  private getItemName(itemId: string): string {
    const names: Record<string, string> = {
      wood: 'Holz',
      metal: 'Metall',
      fabric: 'Stoff',
      food: 'Essen',
      knife: 'Messer',
      campfire: 'Lagerfeuer',
      bandage: 'Verband',
      toolbox: 'Werkzeugkasten',
      rations: 'Rationen',
      radio: 'Funkgerät'
    }
    return names[itemId] || 'Unbekanntes Item'
  }
}
