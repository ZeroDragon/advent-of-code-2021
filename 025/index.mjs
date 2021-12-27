import { readFileSync as rfs } from 'fs'
const { pathname: root } = new URL('./', import.meta.url)

let map = rfs(`${root}025.txt`, 'utf8')
  .trim()
  .split('\n')
  .map(a => a.split(''))

const height = map.length
const width = map[0].length

const clone = original => JSON.parse(JSON.stringify(original))

let moved = true
let steps = 0

while (moved) {
  steps++
  moved = false

  // Handle right facing cucumbers
  const newMap = clone(map)
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (map[i][j] === '>' && map[i][(j + 1) % width] === '.') {
        newMap[i][j] = '.'
        newMap[i][(j + 1) % width] = '>'
        moved = true
      }
    }
  }

  // Handle down facing cucumbers
  map = clone(newMap)
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (newMap[i][j] === 'v' && newMap[(i + 1) % height][j] === '.') {
        map[i][j] = '.'
        map[(i + 1) % height][j] = 'v'
        moved = true
      }
    }
  }
}

console.log(steps)
