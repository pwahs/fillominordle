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
  // const empties =
  //   guesses.length < MAX_CHALLENGES - 1
  //     ? Array.from(Array(MAX_CHALLENGES - 1 - guesses.length))
  //     : []

  return (
    <div className="flex wrap pb-6">
      {guesses.map((guess, i) => (
        <CompletedGrid
          key={i}
          gridSize={gridSize}
          guess={guess}
          isRevealing={isRevealing && guesses.length - 1 === i}
        />
      ))}
      {guesses.length < MAX_CHALLENGES && (
        <CurrentGrid
          gridSize={gridSize}
          guess={currentGuess}
          className={currentRowClassName}
        />
      )}
    </div>
  )
}

//{empties.map((_, i) => (
//<EmptyGrid gridSize={gridSize} key={i} />
//))}