import { FC } from 'react'
import { Cell } from './Cell'

type Props = {
  gridSize: number
  isDecreasedFontSize?: boolean
}

export const EmptyRow: FC<Props> = ({ gridSize, isDecreasedFontSize }) => {
  const emptyCells = Array.from(Array(gridSize))

  return (
    <div className="flex justify-center mb-1 emptyrow">
      {emptyCells.map((_, i) => (
        <Cell key={i} isDecreasedFontSize={isDecreasedFontSize} />
      ))}
    </div>
  )
}
