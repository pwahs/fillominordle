import {
  ChartBarIcon,
  CogIcon,
  InformationCircleIcon,
} from '@heroicons/react/outline'
import { useEffect, useState } from 'react'
import './App.css'
import { AlertContainer } from './components/alerts/AlertContainer'
import { Puzzle } from './components/grid/Puzzle'
import { Keyboard } from './components/keyboard/Keyboard'
import { InfoModal } from './components/modals/InfoModal'
import { SettingsModal } from './components/modals/SettingsModal'
import { StatsModal } from './components/modals/StatsModal'
import { RadioButtons } from './components/RadioButtons'
import {
  GAME_END_DELAY,
  GRID_SIZES,
  MAX_CHALLENGES,
  WELCOME_INFO_MODAL_MS,
} from './constants/settings'
import {
  CHOOSE_GRID_SIZE,
  CORRECT_WORD_MESSAGE,
  GAME_COPIED_MESSAGE,
  GAME_TITLE,
  NOT_ENOUGH_LETTERS_MESSAGE,
  WIN_MESSAGES,
  WORD_NOT_FOUND_MESSAGE as GUESS_INVALID_MESSAGE,
} from './constants/strings'
import { useAlert } from './context/AlertContext'
import {
  getStoredGridSize,
  getStoredIsDecreasedFontSize,
  getStoredIsHighContrastMode,
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
  setStoredGridSize,
  setStoredIsDecreasedFontSize,
  setStoredIsHighContrastMode,
} from './lib/localStorage'
import { addStatsForCompletedGame, loadStats } from './lib/stats'
import {
  isGuessValid,
  isWinningWord,
  solutions,
  unicodeLength,
} from './lib/guesses'
import _, { cloneDeep } from 'lodash'

function App() {
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches

  const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
    useAlert()
  const [currentGuesses, setCurrentGuesses] = useState<{
    [gridSize: number]: string
  }>(Object.fromEntries(GRID_SIZES.map((gridSize) => [gridSize, ''])))
  const [isGameWon, setIsGameWon] = useState<{ [gridSize: number]: boolean }>(
    () => {
      return Object.fromEntries(GRID_SIZES.map((gridSize) => [gridSize, false]))
    }
  )
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [currentGridClass, setCurrentGridClass] = useState('')
  const [isGameLost, setIsGameLost] = useState<{ [gridSize: number]: boolean }>(
    Object.fromEntries(GRID_SIZES.map((gridSize) => [gridSize, false]))
  )
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme')
      ? localStorage.getItem('theme') === 'dark'
      : prefersDarkMode
  )
  const [isHighContrastMode, setIsHighContrastMode] = useState(
    getStoredIsHighContrastMode()
  )
  const [isDecreasedFontSize, setIsDecreasedFontSize] = useState(
    getStoredIsDecreasedFontSize()
  )
  const [gridSize, setGridSize] = useState(getStoredGridSize())
  const [cursor, setCursor] = useState(0)
  const [isRevealing, setIsRevealing] = useState(false)
  const [guesses, setGuesses] = useState<{ [gridSize: number]: string[] }>(
    () => {
      const loaded = loadGameStateFromLocalStorage()
      if (!loaded || !_.isEqual(loaded.solutions, solutions)) {
        return Object.fromEntries(GRID_SIZES.map((gridSize) => [gridSize, []]))
      }
      let tempIsGameWon = cloneDeep(isGameWon)
      let tempIsGameLost = cloneDeep(isGameLost)
      GRID_SIZES.map((gridSize) => {
        const gameWasWon = loaded.guesses[gridSize].includes(
          solutions[gridSize]
        )
        if (gameWasWon) {
          tempIsGameWon = { ...tempIsGameWon, [gridSize]: true }
        }
        if (
          loaded.guesses[gridSize].length === MAX_CHALLENGES(gridSize) &&
          !gameWasWon
        ) {
          tempIsGameLost = { ...tempIsGameLost, [gridSize]: true }
          showErrorAlert(CORRECT_WORD_MESSAGE(solutions[gridSize], gridSize), {
            persist: true,
          })
        }
        return null
      })
      setIsGameWon(tempIsGameWon)
      setIsGameLost(tempIsGameLost)
      return loaded.guesses
    }
  )

  const [stats, setStats] = useState(() => loadStats())

  useEffect(() => {
    // if no game state on load,
    // show the user the how-to info modal
    if (!loadGameStateFromLocalStorage()) {
      setTimeout(() => {
        setIsInfoModalOpen(true)
      }, WELCOME_INFO_MODAL_MS)
    }
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    if (isHighContrastMode) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [isDarkMode, isHighContrastMode])

  const handleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  const handleHighContrastMode = (isHighContrast: boolean) => {
    setIsHighContrastMode(isHighContrast)
    setStoredIsHighContrastMode(isHighContrast)
  }

  const handleDecreasedFontSize = (isHighContrast: boolean) => {
    setIsDecreasedFontSize(isHighContrast)
    setStoredIsDecreasedFontSize(isHighContrast)
  }

  const handleGridSize = (newGridSize: number) => {
    if (gridSize === newGridSize) {
      return
    }
    setCursor(0)
    setGridSize(newGridSize)
    setStoredGridSize(newGridSize)
  }

  const clearCurrentRowClass = () => {
    setCurrentGridClass('')
  }

  useEffect(() => {
    saveGameStateToLocalStorage({ guesses, solutions })
  }, [guesses])

  useEffect(() => {
    if (isGameWon[gridSize]) {
      const winMessage =
        WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]
      const delayMs = GAME_END_DELAY(gridSize)

      showSuccessAlert(winMessage, {
        delayMs,
        onClose: () => setIsStatsModalOpen(true),
      })
    }

    if (isGameLost[gridSize]) {
      setTimeout(() => {
        setIsStatsModalOpen(true)
      }, GAME_END_DELAY(gridSize))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameWon, isGameLost, showSuccessAlert])

  const insertChar = (value: string) => {
    if (!isGameLost[gridSize] && !isGameWon[gridSize]) {
      let guess = currentGuesses[gridSize]
      while (guess.length < cursor) {
        guess = `${guess}?`
      }
      guess = `${guess.substring(0, cursor)}${value}${guess.substring(
        cursor + 1
      )}`
      setCurrentGuesses({
        ...currentGuesses,
        [gridSize]: guess,
      })
    }
  }

  const onChar = (value: string) => {
    insertChar(value)

    if (cursor < gridSize * gridSize - 1) {
      setCursor(cursor + 1)
    }
  }

  const onSpace = () => {
    insertChar('?')
  }

  const onDelete = () => {
    if (cursor === 0) {
      return
    }
    let toDelete = cursor - 1
    let guess = currentGuesses[gridSize]
    if (guess.length > cursor && guess[cursor] !== '?') {
      toDelete = cursor
    }
    while (guess.length < toDelete) {
      guess = `${guess}?`
    }
    guess = `${guess.substring(0, toDelete)}?${guess.substring(toDelete + 1)}`
    setCurrentGuesses({
      ...currentGuesses,
      [gridSize]: guess,
    })
    setCursor(toDelete)
  }

  const onEnter = () => {
    if (isGameWon[gridSize] || isGameLost[gridSize]) {
      return
    }

    if (!(unicodeLength(currentGuesses[gridSize]) === gridSize * gridSize)) {
      setCurrentGridClass('jiggle')
      return showErrorAlert(NOT_ENOUGH_LETTERS_MESSAGE, {
        onClose: clearCurrentRowClass,
      })
    }

    if (!isGuessValid(gridSize, currentGuesses[gridSize])) {
      setCurrentGridClass('jiggle')
      return showErrorAlert(GUESS_INVALID_MESSAGE, {
        onClose: clearCurrentRowClass,
      })
    }

    setIsRevealing(true)
    // turn this back off after all
    // chars have been revealed
    setTimeout(() => {
      setIsRevealing(false)
    }, GAME_END_DELAY(gridSize))

    const winningWord = isWinningWord(currentGuesses[gridSize], gridSize)

    if (
      unicodeLength(currentGuesses[gridSize]) === gridSize * gridSize &&
      guesses[gridSize].length < MAX_CHALLENGES(gridSize) &&
      !isGameWon[gridSize]
    ) {
      setGuesses({
        ...guesses,
        [gridSize]: [...guesses[gridSize], currentGuesses[gridSize]],
      })
      setCurrentGuesses({
        ...currentGuesses,
        [gridSize]: '',
      })
      setCursor(0)

      if (winningWord) {
        setStats(
          addStatsForCompletedGame(stats, guesses[gridSize].length, gridSize)
        )
        setIsGameWon({
          ...isGameWon,
          [gridSize]: true,
        })
        return
      }

      if (guesses[gridSize].length === MAX_CHALLENGES(gridSize) - 1) {
        setStats(
          addStatsForCompletedGame(
            stats,
            guesses[gridSize].length + 1,
            gridSize
          )
        )
        setIsGameLost({
          ...isGameLost,
          [gridSize]: true,
        })
        showErrorAlert(CORRECT_WORD_MESSAGE(solutions[gridSize], gridSize), {
          persist: true,
          delayMs: GAME_END_DELAY(gridSize),
        })
      }
    }
  }

  const onMove = (value: number) => {
    if (cursor + value >= 0 && cursor + value < gridSize * gridSize) {
      setCursor(cursor + value)
    }
  }

  return (
    <div className="flex column h-screen pt-2 pb-2 max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="flex w-80 mx-auto items-center mb-3 mt-5">
        <h1 className="text-xl ml-2.5 grow font-bold dark:text-white">
          {GAME_TITLE}
        </h1>
        <InformationCircleIcon
          className="h-6 w-6 mr-2 cursor-pointer dark:stroke-white"
          onClick={() => setIsInfoModalOpen(true)}
        />
        <ChartBarIcon
          className="h-6 w-6 mr-3 cursor-pointer dark:stroke-white"
          onClick={() => setIsStatsModalOpen(true)}
        />
        <CogIcon
          className="h-6 w-6 mr-3 cursor-pointer dark:stroke-white"
          onClick={() => setIsSettingsModalOpen(true)}
        />
      </div>
      <RadioButtons
        text={CHOOSE_GRID_SIZE}
        setting={'gridSize'}
        labels={GRID_SIZES}
        value={gridSize}
        handleValue={handleGridSize}
      />
      <Puzzle
        guesses={guesses[gridSize]}
        currentGuess={currentGuesses[gridSize]}
        isRevealing={isRevealing}
        currentGridClassName={currentGridClass}
        gridSize={gridSize}
        isDecreasedFontSize={isDecreasedFontSize}
        cursor={
          !isGameWon[gridSize] && !isGameLost[gridSize] ? cursor : undefined
        }
        setCursor={setCursor}
      />
      <Keyboard
        onChar={onChar}
        onDelete={onDelete}
        onEnter={onEnter}
        onMove={onMove}
        onSpace={onSpace}
        guesses={guesses[gridSize]}
        isRevealing={isRevealing}
        gridSize={gridSize}
      />
      <InfoModal
        isOpen={isInfoModalOpen}
        handleClose={() => setIsInfoModalOpen(false)}
      />
      <StatsModal
        isOpen={isStatsModalOpen}
        handleClose={() => setIsStatsModalOpen(false)}
        guesses={guesses[gridSize]}
        gameStats={stats}
        isGameLost={isGameLost[gridSize]}
        isGameWon={isGameWon[gridSize]}
        handleShare={() => showSuccessAlert(GAME_COPIED_MESSAGE)}
        isDarkMode={isDarkMode}
        isHighContrastMode={isHighContrastMode}
        gridSize={gridSize}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        handleClose={() => setIsSettingsModalOpen(false)}
        isDarkMode={isDarkMode}
        handleDarkMode={handleDarkMode}
        isHighContrastMode={isHighContrastMode}
        handleHighContrastMode={handleHighContrastMode}
        isDecreasedFontSize={isDecreasedFontSize}
        handleDecreasedFontSize={handleDecreasedFontSize}
      />

      <AlertContainer />
    </div>
  )
}

export default App
