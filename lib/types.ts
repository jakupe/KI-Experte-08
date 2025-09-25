// TypeScript-Typen für das Endzeit-Survival-Spiel

export interface GameState {
  currentScene: string
  day: number
  maxDays: number
  health: number
  maxHealth: number
  hunger: number
  maxHunger: number
  gameOver: boolean
  victory: boolean
  chapter: number
  maxChapters: number
  soundEnabled: boolean
  selectedItem: string | null
}

export interface InventoryItem {
  id: string
  amount: number
}

export interface CraftingRecipe {
  id: string
  name: string
  icon: string
  ingredients: Record<string, number>
  description: string
}

export interface SceneObject {
  id: string
  name: string
  icon: string
  x: number
  y: number
  type: string
  amount?: number
  items?: string[]
}

export interface HiddenObject {
  id: string
  name: string
  type: string
  amount: number
  x: number
  y: number
}

export interface Scene {
  name: string
  background: string
  description: string
  objects: SceneObject[]
  hiddenObjects?: HiddenObject[]
}

export interface GameScenes {
  [key: string]: Scene
}

export interface SoundSystem {
  click: HTMLAudioElement
  collect: HTMLAudioElement
  craft: HTMLAudioElement
  use: HTMLAudioElement
}

export interface GameElements {
  currentScene: HTMLElement | null
  sceneImage: HTMLElement | null
  hiddenObjects: HTMLElement | null
  sceneNavigation: HTMLElement | null
  inventoryGrid: HTMLElement | null
  craftingRecipes: HTMLElement | null
  healthFill: HTMLElement | null
  hungerFill: HTMLElement | null
  healthText: HTMLElement | null
  hungerText: HTMLElement | null
  dayCounter: HTMLElement | null
  chapterCounter: HTMLElement | null
  messageText: HTMLElement | null
  gameModal: HTMLElement | null
  modalTitle: HTMLElement | null
  modalMessage: HTMLElement | null
  helpModal: HTMLElement | null
}

export interface GameConfig {
  maxInventorySlots: number
  defaultHealth: number
  defaultHunger: number
  hungerPerDay: number
  healthLossWhenHungry: number
  soundVolume: number
}

export type ItemType = 
  | 'wood' 
  | 'metal' 
  | 'fabric' 
  | 'food' 
  | 'knife' 
  | 'campfire' 
  | 'bandage' 
  | 'toolbox' 
  | 'rations' 
  | 'radio'

export type SceneType = 'house' | 'street' | 'supermarket' | 'bunker'

export type SoundType = 'click' | 'collect' | 'craft' | 'use'

// jQuery Types - Simplified for compatibility
export type JQuery = any
export type JQueryInstance = any
