import { MAX_CHALLENGES } from '../../constants/settings'
import { CompletedGrid } from './CompletedGrid'
import { CurrentGrid } from './CurrentGrid'
import { EmptyGrid } from './EmptyGrid'

type Props = {
  guesses: string[]
  currentGuess: string
  isRevealing?: boolean
  currentRowClassName: string
  gridSize: number
  isDecreasedFontSize?: boolean
  cursor?: number
  setCursor?: (position: number) => void
}

export const Puzzle = ({
  guesses,
  currentGuess,
  isRevealing,
  currentRowClassName,
  gridSize,
  isDecreasedFontSize,
  cursor,
  setCursor,
}: Props) => {
  const empties =
    guesses.length < MAX_CHALLENGES(gridSize) - 1
      ? Array.from(Array(MAX_CHALLENGES(gridSize) - 1 - guesses.length))
      : []

  return (
    <div className="flex flex-grow overflow-y-scroll justify-center content-start wrap pb-6">
      {guesses.map((guess, i) => (
        <CompletedGrid
          key={i}
          gridSize={gridSize}
          guess={guess}
          isRevealing={isRevealing && guesses.length - 1 === i}
          isDecreasedFontSize={isDecreasedFontSize}
        />
      ))}
      {guesses.length < MAX_CHALLENGES(gridSize) && (
        <CurrentGrid
          gridSize={gridSize}
          guess={currentGuess}
          className={currentRowClassName}
          isDecreasedFontSize={isDecreasedFontSize}
          cursor={cursor}
          setCursor={setCursor}
        />
      )}
      {empties.map((_, i) => (
        <EmptyGrid
          gridSize={gridSize}
          key={i}
          isDecreasedFontSize={isDecreasedFontSize}
        />
      ))}
    </div>
  )
}
