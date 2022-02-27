import { getGuessStatuses } from './statuses'
import { solutionIndex } from './words'
import { GAME_TITLE } from '../constants/strings'
import { MAX_CHALLENGES, SHARED_GRIDS_PER_LINE } from '../constants/settings'

export const shareStatus = (
  guesses: string[],
  lost: boolean,
  isDarkMode: boolean,
  isHighContrastMode: boolean,
  gridSize: number
) => {
  navigator.clipboard.writeText(
    `${GAME_TITLE} ${gridSize}x${gridSize} ${solutionIndex} ${
      lost ? 'X' : guesses.length
    }/${MAX_CHALLENGES(gridSize)}\n` +
      generateEmojiGrid(
        guesses,
        getEmojiTiles(isDarkMode, isHighContrastMode),
        gridSize
      )
  )
}

export const generateEmojiGrid = (
  guesses: string[],
  tiles: string[],
  gridSize: number
) => {
  return guesses
    .map((guess) => {
      const status = getGuessStatuses(guess, gridSize)
      return guess
        .split('')
        .map((_, i) => {
          switch (status[i]) {
            case 'correct':
              return tiles[0]
            case 'present':
              return tiles[1]
            default:
              return tiles[2]
          }
        })
        // I'm sorry for the following.
        // ['a', 'b', 'c', 'd'] => [['a', 'b'], ['c', 'd']]
        .reduce((resultArray: string[][], item: string, index: number) => {
            const chunkIndex = Math.floor(index / gridSize)
            if (!resultArray[chunkIndex]) resultArray[chunkIndex] = []
            resultArray[chunkIndex].push(item)
            return resultArray
        }, [])
        // [['a', 'b'], ['c', 'd'] => ['ab', 'cd']
        .map((line)=>line.join(''))
    })
    // [['ab', 'cd'], ['ef', 'gh'], ['ij', 'kl'], ['mn', 'op']] => [[['ab', 'cd'], ['ef', 'gh'], ['ij', 'kl']], [['mn', 'op']]]
    .reduce((resultArray: string[][][], item: string[], index: number) => {
      const chunkIndex = Math.floor(index / SHARED_GRIDS_PER_LINE)
      if (!resultArray[chunkIndex]) resultArray[chunkIndex] = []
      resultArray[chunkIndex].push(item)
      return resultArray
    }, [])
    // [[['ab', 'cd'], ['ef', 'gh'], ['ij', 'kl']], [['mn', 'op']]] => ['ab ef ij\ncd gh kl', 'mn\nop']
    .map((lineBlock) => {
      return lineBlock
        // [['ab', 'cd'], ['ef', 'gh'], ['ij', 'kl']] => ['ab ef ij', 'cd gh kl']
        .reduce((resultArray: string[], item: string[], index: number) => {
          return resultArray.map((entry, i) => entry.concat(' ', item[i]))
        }, Array(gridSize).fill(''))
        // ['ab ef ij', 'cd gh kl'] => 'ab ef ij\ncd gh kl'
        .join('\n')
    })
    // ['ab ef ij\ncd gh kl', 'mn\nop'] => 'ab ef ij\ncd gh kl\n\nmn\nop'
    .join('\n\n')
}

const getEmojiTiles = (isDarkMode: boolean, isHighContrastMode: boolean) => {
  let tiles: string[] = []
  tiles.push(isHighContrastMode ? '🟧' : '🟩')
  tiles.push(isHighContrastMode ? '🟦' : '🟨')
  tiles.push(isDarkMode ? '⬛' : '⬜')
  return tiles
}
