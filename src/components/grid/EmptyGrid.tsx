import { FC } from 'react'
import { EmptyRow } from './EmptyRow'

type Props = {
  gridSize: number
  isDecreasedFontSize?: boolean
}

export const EmptyGrid: FC<Props> = ({ gridSize, isDecreasedFontSize }) => {
  const emptyCells = Array.from(Array(gridSize))

  return (
    <div className="flex justify-center mb-3 mx-1.5 column">
      {emptyCells.map((_, i) => (
        <EmptyRow
          gridSize={gridSize}
          key={i}
          isDecreasedFontSize={isDecreasedFontSize}
        />
      ))}
    </div>
  )
}
