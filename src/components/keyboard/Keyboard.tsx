import { getStatuses } from '../../lib/statuses'
import { Key } from './Key'
import { useEffect } from 'react'
import { ENTER_TEXT, DELETE_TEXT } from '../../constants/strings'
import { localeAwareUpperCase } from '../../lib/words'
import { KEY_DELAY_MS } from '../../constants/settings'

type Props = {
  onChar: (value: string) => void
  onDelete: () => void
  onEnter: () => void
  guesses: string[]
  isRevealing?: boolean
  gridSize: number
}

export const Keyboard = ({
  onChar,
  onDelete,
  onEnter,
  guesses,
  isRevealing,
  gridSize,
}: Props) => {
  const keyDelayMs = KEY_DELAY_MS(gridSize)
  const charStatuses = getStatuses(guesses, gridSize)

  const onClick = (value: string) => {
    if (value === 'ENTER') {
      onEnter()
    } else if (value === 'DELETE') {
      onDelete()
      console.log('DELETE')
    } else {
      onChar(value)
    }
  }

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.code === 'Enter') {
        onEnter()
      } else if (e.code === 'Backspace') {
        onDelete()
        console.log('Backspace')
      } else {
        const key = localeAwareUpperCase(e.key)
        // TODO: check this test if the range works with non-english letters
        if (key.length === 1 && key >= '1' && key <= '9') {
          onChar(key)
        }
      }
    }
    window.addEventListener('keyup', listener)
    return () => {
      window.removeEventListener('keyup', listener)
    }
  }, [onEnter, onDelete, onChar])

  return (
    <div>
      <div className="flex justify-center mb-1">
        {['1', '2', '3'].map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={charStatuses[key]}
            isRevealing={isRevealing}
            keyDelayMs={keyDelayMs}
          />
        ))}
      </div>
      <div className="flex justify-center mb-1">
        <Key
          width={65.4}
          value="ENTER"
          onClick={onClick}
          keyDelayMs={keyDelayMs}
        >
          {ENTER_TEXT}
        </Key>
        {['4', '5', '6'].map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={charStatuses[key]}
            isRevealing={isRevealing}
            keyDelayMs={keyDelayMs}
          />
        ))}
        <Key
          width={65.4}
          value="DELETE"
          onClick={onClick}
          keyDelayMs={keyDelayMs}
        >
          {DELETE_TEXT}
        </Key>
      </div>
      <div className="flex justify-center mb-1">
        {['7', '8', '9'].map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={charStatuses[key]}
            isRevealing={isRevealing}
            keyDelayMs={keyDelayMs}
          />
        ))}
      </div>
    </div>
  )
}
