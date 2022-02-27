import { GRID_SIZES, MAX_CHALLENGES } from '../constants/settings'
import {
  GameStats,
  loadStatsFromLocalStorage,
  saveStatsToLocalStorage,
} from './localStorage'

// In stats array elements 0-5 are successes in 1-6 trys

export const addStatsForCompletedGame = (
  gameStats: GameStats,
  count: number,
  gridSize: number
) => {
  // Count is number of incorrect guesses before end.
  const stats = { ...gameStats }

  stats.totalGames[gridSize] += 1

  if (count >= MAX_CHALLENGES(gridSize)) {
    // A fail situation
    stats.currentStreak[gridSize] = 0
    stats.gamesFailed[gridSize] += 1
  } else {
    stats.winDistribution[gridSize][count] += 1
    stats.currentStreak[gridSize] += 1

    if (stats.bestStreak[gridSize] < stats.currentStreak[gridSize]) {
      stats.bestStreak[gridSize] = stats.currentStreak[gridSize]
    }
  }

  stats.successRate[gridSize] = getSuccessRate(stats, gridSize)

  saveStatsToLocalStorage(stats)
  return stats
}

const defaultStats: GameStats = {
  winDistribution: Object.fromEntries(
    GRID_SIZES.map((gridSize) => [
      gridSize,
      Array.from(new Array(MAX_CHALLENGES(gridSize)), () => 0),
    ])
  ),
  gamesFailed: Object.fromEntries(GRID_SIZES.map((gridSize) => [gridSize, 0])),
  currentStreak: Object.fromEntries(
    GRID_SIZES.map((gridSize) => [gridSize, 0])
  ),
  bestStreak: Object.fromEntries(GRID_SIZES.map((gridSize) => [gridSize, 0])),
  totalGames: Object.fromEntries(GRID_SIZES.map((gridSize) => [gridSize, 0])),
  successRate: Object.fromEntries(GRID_SIZES.map((gridSize) => [gridSize, 0])),
}

export const loadStats = () => {
  return loadStatsFromLocalStorage() || defaultStats
}

const getSuccessRate = (gameStats: GameStats, gridSize: number) => {
  const { totalGames, gamesFailed } = gameStats

  return Math.round(
    (100 * (totalGames[gridSize] - gamesFailed[gridSize])) /
      Math.max(totalGames[gridSize], 1)
  )
}
