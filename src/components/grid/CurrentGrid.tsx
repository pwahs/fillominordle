import { splitGuess } from '../../lib/words'
import { CurrentRow } from './CurrentRow'

type Props = {
  gridSize: number
  guess: string
  className: string
}

export const CurrentGrid = ({ gridSize, guess, className }: Props) => {
  const rows = splitGuess(guess, gridSize)
  const classes = `flex justify-center mb-3 mr-3 column ${className}`

  return (
    <div className={classes}>
      {rows.map((row, i) => (
        <CurrentRow
          guess={row}
          gridSize={gridSize}
          className={className}
          key={i}
        />
      ))}
    </div>
  )
}
