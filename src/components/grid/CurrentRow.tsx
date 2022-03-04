import { Cell } from './Cell'
import { unicodeSplit } from '../../lib/guesses'

type Props = {
  guess: string
  gridSize: number
  isDecreasedFontSize?: boolean
  rowNumber: number
  cursor?: number
  setCursor?: (position: number) => void
}

export const CurrentRow = ({
  guess,
  gridSize,
  isDecreasedFontSize,
  rowNumber,
  cursor,
  setCursor,
}: Props) => {
  const splitGuess = unicodeSplit(guess)
  const emptyCells = Array.from(Array(gridSize - splitGuess.length))

  return (
    <div className="flex justify-center mb-1">
      {splitGuess.map((letter, i) => (
        <Cell
          key={i}
          value={letter}
          isDecreasedFontSize={isDecreasedFontSize}
          position={rowNumber * gridSize + i}
          isSelected={
            cursor !== undefined && rowNumber * gridSize + i === cursor
          }
          onClick={setCursor}
        />
      ))}
      {emptyCells.map((_, i) => (
        <Cell
          key={i}
          value="?"
          isDecreasedFontSize={isDecreasedFontSize}
          position={rowNumber * gridSize + splitGuess.length + i}
          isSelected={
            cursor !== undefined &&
            rowNumber * gridSize + splitGuess.length + i === cursor
          }
          onClick={setCursor}
        />
      ))}
    </div>
  )
}
