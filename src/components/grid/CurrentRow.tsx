import { Cell } from './Cell'
import { unicodeSplit } from '../../lib/guesses'

type Props = {
  guess: string
  gridSize: number
  className: string
  isDecreasedFontSize?: boolean
}

export const CurrentRow = ({
  guess,
  className,
  gridSize,
  isDecreasedFontSize,
}: Props) => {
  const splitGuess = unicodeSplit(guess)
  const emptyCells = Array.from(Array(gridSize - splitGuess.length))
  const classes = `flex justify-center mb-1 ${className}`

  return (
    <div className={classes}>
      {splitGuess.map((letter, i) => (
        <Cell
          key={i}
          value={letter}
          isDecreasedFontSize={isDecreasedFontSize}
        />
      ))}
      {emptyCells.map((_, i) => (
        <Cell key={i} isDecreasedFontSize={isDecreasedFontSize} />
      ))}
    </div>
  )
}
