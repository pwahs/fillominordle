import { splitGuess } from '../lib/guesses'

export const GAME_TITLE = process.env.REACT_APP_GAME_NAME!

export const WIN_MESSAGES = ['Great Job!', 'Awesome', 'Well done!']
export const GAME_COPIED_MESSAGE = 'Game copied to clipboard'
export const NOT_ENOUGH_LETTERS_MESSAGE = 'Not enough numbers'
export const WORD_NOT_FOUND_MESSAGE = 'Fillomino not valid'
export const CORRECT_WORD_MESSAGE = (solution: string, gridSize: number) =>
  `The solution was ${splitGuess(solution, gridSize).join(',')}`
export const WRONG_SPOT_MESSAGE = (guess: string, position: number) =>
  `Must use ${guess} in position ${position}`
export const NOT_CONTAINED_MESSAGE = (digit: string) =>
  `Guess must contain ${digit}`
export const ENTER_TEXT = 'Enter'
export const DELETE_TEXT = 'Delete'
export const STATISTICS_TITLE = (gridSize: number, solutionIndex: number) =>
  `Statistics for size ${gridSize}x${gridSize} on day ${solutionIndex}`
export const GUESS_DISTRIBUTION_TEXT = 'Guess Distribution'
export const NEW_WORD_TEXT = 'New fillomino in'
export const SHARE_TEXT = 'Share'
export const TOTAL_TRIES_TEXT = 'Total tries'
export const SUCCESS_RATE_TEXT = 'Success rate'
export const CURRENT_STREAK_TEXT = 'Current streak'
export const BEST_STREAK_TEXT = 'Best streak'
export const CHOOSE_GRID_SIZE = 'Grid size:'
