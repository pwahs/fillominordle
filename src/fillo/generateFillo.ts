import { RandomSeed, create } from 'random-seed'
import { verifyFillomino } from './verifyFillo'

export const generateFillomino = (seed: number, gridSize: number): string => {
  let solution = ''
  const rand = create()

  do {
    const p = 0.4
    const right = generateArray(rand, gridSize, p)
    const down = generateArray(rand, gridSize, p)
    const result = new Array<number>(gridSize * gridSize)

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        let visited = new Array<boolean>(gridSize * gridSize)
        result[r * gridSize + c] = dfs(r, c, gridSize, right, down, visited)
      }
    }
    solution = result.join('')
  } while (!verifyFillomino(gridSize, solution))

  return solution
}

const dfs = (
  r: number,
  c: number,
  gridSize: number,
  right: Array<Array<boolean>>,
  down: Array<Array<boolean>>,
  visited: Array<boolean>
): number => {
  const current = r * gridSize + c
  if (r < 0 || r >= gridSize || c < 0 || c >= gridSize || visited[current]) {
    return 0
  }

  visited[current] = true

  let total = 1

  if (r > 0 && down[r - 1][c]) {
    total += dfs(r - 1, c, gridSize, right, down, visited)
  }

  if (c > 0 && right[r][c - 1]) {
    total += dfs(r, c - 1, gridSize, right, down, visited)
  }

  if (down[r][c]) {
    total += dfs(r + 1, c, gridSize, right, down, visited)
  }

  if (right[r][c]) {
    total += dfs(r, c + 1, gridSize, right, down, visited)
  }

  return total
}

const generateArray = (
  rand: RandomSeed,
  gridSize: number,
  p: number
): Array<Array<boolean>> => {
  return new Array(gridSize)
    .fill(false)
    .map(() =>
      new Array<boolean>(gridSize).fill(false).map(() => rand.random() < p)
    )
}
