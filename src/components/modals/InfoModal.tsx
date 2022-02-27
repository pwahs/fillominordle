import { Cell } from '../grid/Cell'
import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const InfoModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal title="How to play" isOpen={isOpen} handleClose={handleClose}>
      <p className="text-sm text-gray-500 dark:text-gray-300 mb-3">
        Guess the{' '}
        <a
          href="https://de.wikipedia.org/wiki/Fillomino"
          className="underline font-bold"
        >
          Fillomino
        </a>{' '}
        of size 3x3, 4x4 or 5x5 in 5, 6 or 7 tries, respectively. After each
        guess, the color of the tiles will change to show how close your guess
        was to the fillomino.
      </p>

      <p className="text-sm text-gray-500 dark:text-gray-300">
        A valid fillomino has a number in each cell, and each group of connected
        cells with the same number is exactly as large as the number says. This
        game only has fillominos with numbers from 1 to 9.
      </p>

      <div className="flex justify-center mb-1 mt-4 column">
        <div className="flex justify-center mb-1">
          <Cell
            isRevealing={true}
            isCompleted={true}
            value="3"
            status="correct"
          />
          <Cell value="3" />
          <Cell value="1" />
          <Cell value="3" />
        </div>
        <div className="flex justify-center">
          <Cell value="3" />
          <Cell value="1" />
          <Cell value="3" />
          <Cell value="3" />
        </div>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The number 3 is in the fillomino and in the correct spot.
      </p>
      <div className="flex justify-center mb-1 mt-4 column">
        <div className="flex justify-center mb-1">
          <Cell value="2" />
          <Cell
            isRevealing={true}
            isCompleted={true}
            value="1"
            status="present"
          />
          <Cell value="4" />
          <Cell value="4" />
        </div>
        <div className="flex justify-center">
          <Cell value="2" />
          <Cell value="4" />
          <Cell value="4" />
          <Cell value="1" />
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-300">
        The number 1 is in the fillomino but in the wrong spot.
      </p>
      <div className="flex justify-center mb-1 mt-4 column">
        <div className="flex justify-center mb-1">
          <Cell value="2" />
          <Cell value="2" />
          <Cell
            isRevealing={true}
            isCompleted={true}
            value="6"
            status="absent"
          />
          <Cell value="6" />
        </div>
        <div className="flex justify-center">
          <Cell value="6" />
          <Cell value="6" />
          <Cell value="6" />
          <Cell value="6" />
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-300">
        The number 6 is not in the fillomino in any spot.
      </p>

      <p className="mt-6 italic text-sm text-gray-500 dark:text-gray-300">
        This is an open source version of the word guessing game we all know and
        love -{' '}
        <a
          href="https://github.com/pwahs/fillominordle"
          className="underline font-bold"
        >
          check out the code and licenses here
        </a>{' '}
      </p>
    </BaseModal>
  )
}
