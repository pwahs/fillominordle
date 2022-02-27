import { FC } from 'react'
import { EmptyRow } from './EmptyRow'

type Props = {
  gridSize: number
}

export const EmptyGrid: FC<Props> = ({ gridSize }) => {
  const emptyCells = Array.from(Array(gridSize))

  return (
    <div className="flex justify-center mb-3 mr-3 column">
      {emptyCells.map((_, i) => (
        <EmptyRow gridSize={gridSize} key={i} />
      ))}
    </div>
  )
}
