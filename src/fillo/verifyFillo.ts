export const verifyFillomino = (gridSize: number, guess: string): boolean => {
  if (guess.length !== gridSize * gridSize) {
    return false
  }

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      let visited = new Array<boolean>(guess.length)
      if (
        guess[r * gridSize + c] !==
        `${dfs(r, c, gridSize, guess, visited, guess[r * gridSize + c])}`
      ) {
        return false
      }
    }
  }

  return true
}

const dfs = (
  row: number,
  col: number,
  gridSize: number,
  guess: string,
  visited: boolean[],
  target: string
): number => {
  const current = row * gridSize + col
  if (
    row < 0 ||
    row >= gridSize ||
    col < 0 ||
    col >= gridSize ||
    visited[current] ||
    guess[current] !== target
  ) {
    return 0
  }
  visited[current] = true
  return (
    1 +
    dfs(row + 1, col, gridSize, guess, visited, target) +
    dfs(row - 1, col, gridSize, guess, visited, target) +
    dfs(row, col + 1, gridSize, guess, visited, target) +
    dfs(row, col - 1, gridSize, guess, visited, target)
  )
}