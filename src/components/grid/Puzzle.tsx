import { MAX_CHALLENGES } from '../../constants/settings'
import { CompletedGrid } from './CompletedGrid'
import { CurrentGrid } from './CurrentGrid'

type Props = {
  guesses: string[]
  currentGuess: string
  isRevealing?: boolean
  currentRowClassName: string
  gridSize: number
}

export const Puzzle = ({
  guesses,
  currentGuess,
  isRevealing,
  currentRowClassName,
  gridSize,
}: Props) => {
  return (
    <div className="flex justify-center wrap pb-6">
      {guesses.map((guess, i) => (
        <CompletedGrid
          key={i}
          gridSize={gridSize}
          guess={guess}
          isRevealing={isRevealing && guesses.length - 1 === i}
        />
      ))}
      {guesses.length < MAX_CHALLENGES(gridSize) && (
        <CurrentGrid
          gridSize={gridSize}
          guess={currentGuess}
          className={currentRowClassName}
        />
      )}
    </div>
  )
}
