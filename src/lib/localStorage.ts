const gameStateKey = 'gameState'
const highContrastKey = 'highContrast'
const decreasedFontSizeKey = 'decreasedFontSize'
const gridSizeKey = 'gridSize'

type StoredGameState = {
  guesses: { [gridSize: number]: string[] }
  solutions: { [gridSize: number]: string }
}

export const saveGameStateToLocalStorage = (gameState: StoredGameState) => {
  localStorage.setItem(gameStateKey, JSON.stringify(gameState))
}

export const loadGameStateFromLocalStorage = () => {
  const state = localStorage.getItem(gameStateKey)
  console.log(state)
  return state ? (JSON.parse(state) as StoredGameState) : null
}

const gameStatKey = 'gameStats'

export type GameStats = {
  winDistribution: {
    [gridSize: number]: number[]
  }
  gamesFailed: { [gridSize: number]: number }
  currentStreak: { [gridSize: number]: number }
  bestStreak: { [gridSize: number]: number }
  totalGames: { [gridSize: number]: number }
  successRate: { [gridSize: number]: number }
}

export const saveStatsToLocalStorage = (gameStats: GameStats) => {
  localStorage.setItem(gameStatKey, JSON.stringify(gameStats))
}

export const loadStatsFromLocalStorage = () => {
  const stats = localStorage.getItem(gameStatKey)
  return stats ? (JSON.parse(stats) as GameStats) : null
}

export const setStoredIsHighContrastMode = (isHighContrast: boolean) => {
  if (isHighContrast) {
    localStorage.setItem(highContrastKey, '1')
  } else {
    localStorage.removeItem(highContrastKey)
  }
}

export const getStoredIsHighContrastMode = () => {
  const highContrast = localStorage.getItem(highContrastKey)
  return highContrast === '1'
}

export const setStoredIsDecreasedFontSize = (isDecreasedFontSize: boolean) => {
  if (isDecreasedFontSize) {
    localStorage.setItem(decreasedFontSizeKey, '1')
  } else {
    localStorage.removeItem(decreasedFontSizeKey)
  }
}

export const getStoredIsDecreasedFontSize = () => {
  const decreasedFontSize = localStorage.getItem(decreasedFontSizeKey)
  return decreasedFontSize === '1'
}

export const setStoredGridSize = (gridSize: number) => {
  localStorage.setItem(gridSizeKey, `${gridSize}`)
}

export const getStoredGridSize = () => {
  return parseInt(localStorage.getItem(gridSizeKey) ?? '3')
}
