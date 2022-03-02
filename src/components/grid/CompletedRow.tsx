import { CharStatus } from '../../lib/statuses'
import { Cell } from './Cell'
import { unicodeSplit } from '../../lib/guesses'

type Props = {
  guess: string
  isRevealing?: boolean
  position: number
  status: CharStatus[]
  isDecreasedFontSize?: boolean
}

export const CompletedRow = ({
  guess,
  isRevealing,
  position,
  status,
  isDecreasedFontSize,
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
          isDecreasedFontSize={isDecreasedFontSize}
        />
      ))}
    </div>
  )
}
