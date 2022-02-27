export const MAX_CHALLENGES = 8
export const ALERT_TIME_MS = 2000
export const REVEAL_TIME_MS = 350
export const GAME_END_DELAY = (gridSize: number): number =>
  2 * gridSize * REVEAL_TIME_MS
export const KEY_DELAY_MS = (gridSize: number): number =>
  (2 * gridSize - 1) * REVEAL_TIME_MS
export const WELCOME_INFO_MODAL_MS = 350
