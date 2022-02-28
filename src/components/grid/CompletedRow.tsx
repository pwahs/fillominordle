import { CharStatus } from '../../lib/statuses'
import { Cell } from './Cell'
import { unicodeSplit } from '../../lib/guesses'

type Props = {
  guess: string
  isRevealing?: boolean
  position: number
  status: CharStatus[]
}

export const CompletedRow = ({
  guess,
  isRevealing,
  position,
  status,
}: Props) => {
  const splitGuess = unicodeSplit(guess)

  return (
    <div className="flex justify-center mb-1">
      {splitGuess.map((letter, i) => (
        <Cell
          key={i}
          value={letter}
          status={status[i]}
          position={position + i}
          isRevealing={isRevealing}
          isCompleted
        />
      ))}
    </div>
  )
}
