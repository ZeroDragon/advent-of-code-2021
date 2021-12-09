const fs = require('fs')
const origin = require('path').join(__dirname, '009.txt')
const input = fs.readFileSync(origin, 'utf8')
  .split('\n')
  .filter(l => l !== '')
  .map(row => row.split(''))

const testLowest = (y, x) => {
  const tests = []
  if (input[y - 1] !== undefined) tests.push(input[y][x] < input[y - 1][x])
  if (input[y + 1] !== undefined) tests.push(input[y][x] < input[y + 1][x])
  if (input[y][x - 1] !== undefined) tests.push(input[y][x] < input[y][x - 1])
  if (input[y][x + 1] !== undefined) tests.push(input[y][x] < input[y][x + 1])
  return tests.every(test => test)
}

const mapped = input
  .map((row, y) => {
    return row.map((_, x) => testLowest(y, x))
  })
  .map((row, y) => {
    return row.map((found, x) => {
      return found ? input[y][x] : false
    })
  })
  .map(row => {
    const newRow = row
      .filter(cell => cell !== false)
      .map(cell => ~~cell)
    return newRow.length > 0 ? newRow : false
  })
  .filter(row => row !== false)
  .reduce((acum, current) => {
    return [...acum, ...current]
  }, [])

const risk = mapped
  .map(val => val + 1)
  .reduce((acum, current) => acum + current)

console.log(risk)
