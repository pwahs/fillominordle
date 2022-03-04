import { splitGuess } from '../../lib/guesses'
import { CurrentRow } from './CurrentRow'

type Props = {
  gridSize: number
  guess: string
  className: string
  isDecreasedFontSize?: boolean
  cursor?: number
  setCursor?: (position: number) => void
}

export const CurrentGrid = ({
  gridSize,
  guess,
  className,
  isDecreasedFontSize,
  cursor,
  setCursor,
}: Props) => {
  const rows = splitGuess(guess, gridSize)
  const classes = `flex justify-center mb-3 mx-1.5 column ${className}`

  return (
    <div className={classes}>
      {rows.map((row, i) => (
        <CurrentRow
          guess={row}
          gridSize={gridSize}
          key={i}
          isDecreasedFontSize={isDecreasedFontSize}
          rowNumber={i}
          setCursor={setCursor}
          cursor={cursor}
        />
      ))}
    </div>
  )
}
