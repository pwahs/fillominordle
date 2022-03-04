import { CharStatus } from '../../lib/statuses'
import classnames from 'classnames'
import { REVEAL_TIME_MS } from '../../constants/settings'
import { getStoredIsHighContrastMode } from '../../lib/localStorage'

type Props = {
  value?: string
  status?: CharStatus
  isRevealing?: boolean
  isCompleted?: boolean
  position?: number
  isDecreasedFontSize?: boolean
  onClick?: (value: number) => void
  isSelected?: boolean
}

export const Cell = ({
  value,
  status,
  isRevealing,
  isCompleted,
  position = 0,
  isDecreasedFontSize,
  onClick,
  isSelected,
}: Props) => {
  const isFilled = value && value !== '?' && !isCompleted
  const shouldReveal = isRevealing && isCompleted
  const animationDelay = isRevealing ? `${position * REVEAL_TIME_MS}ms` : '0ms'
  const isHighContrast = getStoredIsHighContrastMode()

  const classes = classnames(
    'border-solid border-2 flex items-center justify-center mx-0.5 font-bold rounded dark:text-white',
    {
      'w-12 h-12 text-4xl': !isDecreasedFontSize,
      'w-8 h-8 text-2xl': isDecreasedFontSize,
      'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-600':
        !isSelected && !status,
      'shadowed border-gray-500 bg-gray-500': isSelected && !status,
      'border-black dark:border-slate-100': value && value !== '?' && !status,
      'absent shadowed bg-slate-400 dark:bg-slate-700 text-white border-slate-400 dark:border-slate-700':
        status === 'absent',
      'correct shadowed bg-orange-500 text-white border-orange-500':
        status === 'correct' && isHighContrast,
      'present shadowed bg-cyan-500 text-white border-cyan-500':
        status === 'present' && isHighContrast,
      'correct shadowed bg-green-500 text-white border-green-500':
        status === 'correct' && !isHighContrast,
      'present shadowed bg-yellow-500 text-white border-yellow-500':
        status === 'present' && !isHighContrast,
      'cell-fill-animation': isFilled,
      'cell-reveal': shouldReveal,
    }
  )

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    onClick?.(position)
    console.log(position)
    event.currentTarget.blur()
  }

  return (
    <div className={classes} style={{ animationDelay }} onClick={handleClick}>
      <div className="letter-container" style={{ animationDelay }}>
        {value && value !== '?' ? value : ''}
      </div>
    </div>
  )
}
