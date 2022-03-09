import { getStatuses } from '../../lib/statuses'
import { Key } from './Key'
import { useEffect } from 'react'
import { ENTER_TEXT, DELETE_TEXT } from '../../constants/strings'
import { localeAwareUpperCase } from '../../lib/guesses'
import { KEY_DELAY_MS } from '../../constants/settings'

type Props = {
  onChar: (value: string) => void
  onDelete: () => void
  onEnter: () => void
  onMove: (value: number) => void
  onSpace: () => void
  guesses: string[]
  isRevealing?: boolean
  gridSize: number
}

export const Keyboard = ({
  onChar,
  onDelete,
  onEnter,
  onMove,
  onSpace,
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
    } else {
      onChar(value)
    }
  }

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      const numLock = e.getModifierState("NumLock") === false ? false : true
      if (e.code === 'Enter') {
        onEnter()
      } else if (e.code === 'Backspace') {
        onDelete()
      } else if (e.code === 'ArrowUp' || e.code === 'KeyW' || (e.code === 'Numpad8' && !numLock)) {
        onMove(-gridSize)
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS' || (e.code === 'Numpad2' && !numLock)) {
        onMove(+gridSize)
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA' || (e.code === 'Numpad4' && !numLock)) {
        onMove(-1)
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD' || (e.code === 'Numpad6' && !numLock)) {
        onMove(+1)
      } else if (e.code === 'Numpad7' && !numLock) {
        onMove(-gridSize-1)
      } else if (e.code === 'Numpad9' && !numLock) {
        onMove(-gridSize+1)
      } else if (e.code === 'Numpad3' && !numLock) {
        onMove(+gridSize+1)
      } else if (e.code === 'Numpad1' && !numLock) {
        onMove(+gridSize-1)
      } else if (e.code === 'Space') {
        onSpace()
      } else {
        const key = localeAwareUpperCase(e.key)
        if (key.length === 1 && key >= '1' && key <= '9') {
          onChar(key)
        }
      }
    }
    window.addEventListener('keyup', listener)
    return () => {
      window.removeEventListener('keyup', listener)
    }
  }, [onEnter, onDelete, onChar, onMove, onSpace, gridSize])
  return (
    <div className="mt-3">
      <div className="flex justify-center mb-1">
        {['1', '2', '3', '4', '5', '6'].map((key) => (
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
        <Key width={62} value="ENTER" onClick={onClick} keyDelayMs={keyDelayMs}>
          {ENTER_TEXT}
        </Key>
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
        <Key
          width={62}
          value="DELETE"
          onClick={onClick}
          keyDelayMs={keyDelayMs}
        >
          {DELETE_TEXT}
        </Key>
      </div>
    </div>
  )
}
