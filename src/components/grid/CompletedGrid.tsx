import { getGuessStatuses } from '../../lib/statuses'
import { splitGuess, splitStatuses } from '../../lib/guesses'
import { CompletedRow } from './CompletedRow'

type Props = {
  gridSize: number
  guess: string
  isRevealing?: boolean
  isDecreasedFontSize?: boolean
}

export const CompletedGrid = ({
  gridSize,
  guess,
  isRevealing,
  isDecreasedFontSize,
}: Props) => {
  const statuses = splitStatuses(getGuessStatuses(guess, gridSize), gridSize)
  const rows = splitGuess(guess, gridSize)

  return (
    <div className="flex justify-center mb-3 mx-1.5 column">
      {rows.map((row, i) => (
        <CompletedRow
          key={i}
          guess={row}
          position={i}
          status={statuses[i]}
          isRevealing={isRevealing}
          isDecreasedFontSize={isDecreasedFontSize}
        />
      ))}
    </div>
  )
}
