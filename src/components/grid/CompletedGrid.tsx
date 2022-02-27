import { getGuessStatuses } from '../../lib/statuses'
import { splitGuess, splitStatuses } from '../../lib/words'
import { CompletedRow } from './CompletedRow'

type Props = {
  gridSize: number
  guess: string
  isRevealing?: boolean
}

export const CompletedGrid = ({ gridSize, guess, isRevealing }: Props) => {
  const statuses = splitStatuses(getGuessStatuses(guess), gridSize)
  const rows = splitGuess(guess, gridSize)

  return (
    <div className="flex justify-center mb-3 mr-3 column">
      {rows.map((row, i) => (
        <CompletedRow
          key={i}
          guess={row}
          position={i}
          status={statuses[i]}
          isRevealing={isRevealing}
        />
      ))}
    </div>
  )
}
