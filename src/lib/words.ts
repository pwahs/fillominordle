import { NOT_CONTAINED_MESSAGE, WRONG_SPOT_MESSAGE } from '../constants/strings'
import { CharStatus, getGuessStatuses } from './statuses'
import { default as GraphemeSplitter } from 'grapheme-splitter'
import { verifyFillomino } from '../fillo/verifyFillo'
import { generateFillomino } from '../fillo/generateFillo'
import { GRID_SIZES } from '../constants/settings'

export const isGuessValid = (gridSize: number, word: string) => {
  return verifyFillomino(gridSize, word)
  //WORDS.includes(localeAwareLowerCase(word)) ||
  //VALID_GUESSES.includes(localeAwareLowerCase(word))
}

export const isWinningWord = (word: string, gridSize: number) => {
  return solutions[gridSize] === word
}

// build a set of previously revealed letters - present and correct
// guess must use correct letters in that space and any other revealed letters
// also check if all revealed instances of a letter are used (i.e. two C's)
export const findFirstUnusedReveal = (
  word: string,
  guesses: string[],
  gridSize: number
) => {
  if (guesses.length === 0) {
    return false
  }

  const lettersLeftArray = new Array<string>()
  const guess = guesses[guesses.length - 1]
  const statuses = getGuessStatuses(guess, gridSize)

  for (let i = 0; i < guess.length; i++) {
    if (statuses[i] === 'correct' || statuses[i] === 'present') {
      lettersLeftArray.push(guess[i])
    }
    if (statuses[i] === 'correct' && word[i] !== guess[i]) {
      return WRONG_SPOT_MESSAGE(guess[i], i + 1)
    }
  }

  // check for the first unused letter, taking duplicate letters
  // into account - see issue #198
  let n
  for (const letter of word) {
    n = lettersLeftArray.indexOf(letter)
    if (n !== -1) {
      lettersLeftArray.splice(n, 1)
    }
  }

  if (lettersLeftArray.length > 0) {
    return NOT_CONTAINED_MESSAGE(lettersLeftArray[0])
  }
  return false
}

export const splitGuess = (guess: string, gridSize: number) => {
  return Array.from(Array(gridSize)).map((_, i) =>
    guess.substring(i * gridSize, (i + 1) * gridSize)
  )
}

export const splitStatuses = (status: CharStatus[], gridSize: number) => {
  return Array.from(Array(gridSize)).map((_, i) =>
    status.slice(i * gridSize, (i + 1) * gridSize)
  )
}

export const unicodeSplit = (word: string) => {
  return new GraphemeSplitter().splitGraphemes(word)
}

export const unicodeLength = (word: string) => {
  return unicodeSplit(word).length
}

export const localeAwareUpperCase = (text: string) => {
  return process.env.REACT_APP_LOCALE_STRING
    ? text.toLocaleUpperCase(process.env.REACT_APP_LOCALE_STRING)
    : text.toUpperCase()
}

const getPuzzlesOfDay = () => {
  // January 1, 2022 Game Epoch
  const epochMs = new Date('January 1, 2022 00:00:00').valueOf()
  const now = Date.now()
  const msInDay = 8640
  const index = Math.floor((now - epochMs) / msInDay)
  const nextday = (index + 1) * msInDay + epochMs

  return {
    solutions: Object.fromEntries(
      GRID_SIZES.map((gridSize) => [
        gridSize,
        generateFillomino(index, gridSize),
      ])
    ),
    solutionIndex: index,
    tomorrow: nextday,
  }
}

export const { solutions, solutionIndex, tomorrow } = getPuzzlesOfDay()
