import {
  ChartBarIcon,
  CogIcon,
  InformationCircleIcon,
} from '@heroicons/react/outline'
import { default as GraphemeSplitter } from 'grapheme-splitter'
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
  getStoredIsHighContrastMode,
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
  setStoredGridSize,
  setStoredIsHighContrastMode,
} from './lib/localStorage'
import { addStatsForCompletedGame, loadStats } from './lib/stats'
import {
  isGuessValid,
  isWinningWord,
  solutions,
  unicodeLength,
} from './lib/guesses'
import _ from 'lodash'

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
    Object.fromEntries(GRID_SIZES.map((gridSize) => [gridSize, false]))
  )
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [currentRowClass, setCurrentRowClass] = useState('')
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
  const [gridSize, setGridSize] = useState(getStoredGridSize())
  const [isRevealing, setIsRevealing] = useState(false)
  const [guesses, setGuesses] = useState<{ [gridSize: number]: string[] }>(
    () => {
      const loaded = loadGameStateFromLocalStorage()
      if (!loaded || !_.isEqual(loaded.solutions, solutions)) {
        return Object.fromEntries(GRID_SIZES.map((gridSize) => [gridSize, []]))
      }
      GRID_SIZES.map((gridSize) => {
        const gameWasWon = loaded.guesses[gridSize].includes(
          solutions[gridSize]
        )
        if (gameWasWon) {
          setIsGameWon({
            ...isGameWon,
            [gridSize]: true,
          })
        }
        if (
          loaded.guesses[gridSize].length === MAX_CHALLENGES(gridSize) &&
          !gameWasWon
        ) {
          setIsGameLost({
            ...isGameLost,
            [gridSize]: true,
          })
          showErrorAlert(CORRECT_WORD_MESSAGE(solutions[gridSize], gridSize), {
            persist: true,
          })
        }
        return null
      })
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

  const handleGridSize = (gridSize: number) => {
    setGridSize(gridSize)
    setStoredGridSize(gridSize)
  }

  const clearCurrentRowClass = () => {
    setCurrentRowClass('')
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
  }, [gridSize, isGameWon, isGameLost, showSuccessAlert])

  const onChar = (value: string) => {
    if (
      unicodeLength(`${currentGuesses[gridSize]}${value}`) <=
        gridSize * gridSize &&
      guesses[gridSize].length < MAX_CHALLENGES(gridSize) &&
      !isGameWon[gridSize]
    ) {
      setCurrentGuesses({
        ...currentGuesses,
        [gridSize]: `${currentGuesses[gridSize]}${value}`,
      })
    }
  }

  const onDelete = () => {
    setCurrentGuesses({
      ...currentGuesses,
      [gridSize]: new GraphemeSplitter()
        .splitGraphemes(currentGuesses[gridSize])
        .slice(0, -1)
        .join(''),
    })
  }

  const onEnter = () => {
    if (isGameWon[gridSize] || isGameLost[gridSize]) {
      return
    }

    if (!(unicodeLength(currentGuesses[gridSize]) === gridSize * gridSize)) {
      setCurrentRowClass('jiggle')
      return showErrorAlert(NOT_ENOUGH_LETTERS_MESSAGE, {
        onClose: clearCurrentRowClass,
      })
    }

    if (!isGuessValid(gridSize, currentGuesses[gridSize])) {
      setCurrentRowClass('jiggle')
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

      if (winningWord) {
        // TODO: setStats for gridSizes
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

  return (
    <div className="flex column h-screen pt-2 pb-8 max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="flex w-80 mx-auto items-center mb-8 mt-20">
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
        currentRowClassName={currentRowClass}
        gridSize={gridSize}
      />
      <Keyboard
        onChar={onChar}
        onDelete={onDelete}
        onEnter={onEnter}
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
      />

      <AlertContainer />
    </div>
  )
}

export default App
