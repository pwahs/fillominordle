import { Cell } from './Cell'
import { unicodeSplit } from '../../lib/guesses'

type Props = {
  guess: string
  gridSize: number
  className: string
}

export const CurrentRow = ({ guess, className, gridSize }: Props) => {
  const splitGuess = unicodeSplit(guess)
  const emptyCells = Array.from(Array(gridSize - splitGuess.length))
  const classes = `flex justify-center mb-1 ${className}`

  return (
    <div className={classes}>
      {splitGuess.map((letter, i) => (
        <Cell key={i} value={letter} />
      ))}
      {emptyCells.map((_, i) => (
        <Cell key={i} />
      ))}
    </div>
  )
}
