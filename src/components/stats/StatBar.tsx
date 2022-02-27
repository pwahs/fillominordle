import { GameStats } from '../../lib/localStorage'
import {
  TOTAL_TRIES_TEXT,
  SUCCESS_RATE_TEXT,
  CURRENT_STREAK_TEXT,
  BEST_STREAK_TEXT,
} from '../../constants/strings'

type Props = {
  gameStats: GameStats
  gridSize: number
}

const StatItem = ({
  label,
  value,
}: {
  label: string
  value: string | number
}) => {
  return (
    <div className="items-center justify-center m-1 w-1/4 dark:text-white">
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-xs">{label}</div>
    </div>
  )
}

export const StatBar = ({ gameStats, gridSize }: Props) => {
  return (
    <div className="flex justify-center my-2">
      <StatItem label={TOTAL_TRIES_TEXT} value={gameStats.totalGames[gridSize]} />
      <StatItem label={SUCCESS_RATE_TEXT} value={`${gameStats.successRate[gridSize]}%`} />
      <StatItem label={CURRENT_STREAK_TEXT} value={gameStats.currentStreak[gridSize]} />
      <StatItem label={BEST_STREAK_TEXT} value={gameStats.bestStreak[gridSize]} />
    </div>
  )
}
