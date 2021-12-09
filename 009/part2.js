const fs = require('fs')
const origin = require('path').join(__dirname, '009.txt')
const input = fs.readFileSync(origin, 'utf8')
  .split('\n')
  .filter(l => l !== '')
  .map(row => row.split('').map(val => ~~val))

const testLowest = (y, x) => {
  const tests = []
  if (input[y - 1] !== undefined) tests.push(input[y][x] < input[y - 1][x])
  if (input[y + 1] !== undefined) tests.push(input[y][x] < input[y + 1][x])
  if (input[y][x - 1] !== undefined) tests.push(input[y][x] < input[y][x - 1])
  if (input[y][x + 1] !== undefined) tests.push(input[y][x] < input[y][x + 1])
  return tests.every(test => test)
}

const getBasin = (y, x, test, reg) => {
  reg[y][x] = true
  const acum = [test]
  if (input[y - 1]) {
    if (input[y - 1][x] > test && input[y - 1][x] !== 9) {
      reg[y - 1][x] = true
      acum.push(...getBasin(y - 1, x, input[y - 1][x], reg))
    }
  }
  if (input[y + 1]) {
    if (input[y + 1][x] > test && input[y + 1][x] !== 9) {
      reg[y + 1][x] = true
      acum.push(...getBasin(y + 1, x, input[y + 1][x], reg))
    }
  }
  if (input[y][x - 1]) {
    if (input[y][x - 1] > test && input[y][x - 1] !== 9) {
      reg[y][x - 1] = true
      acum.push(...getBasin(y, x - 1, input[y][x - 1], reg))
    }
  }
  if (input[y][x + 1]) {
    if (input[y][x + 1] > test && input[y][x + 1] !== 9) {
      reg[y][x + 1] = true
      acum.push(...getBasin(y, x + 1, input[y][x + 1], reg))
    }
  }
  return reg
}

const mapped = input
  .map((row, y) => {
    return row.map((_, x) => testLowest(y, x))
  })
  .map((row, y) => {
    return row
      .map((found, x) => {
        const cloned = JSON.parse(JSON.stringify(input))
        if (found) {
          return getBasin(y, x, input[y][x], cloned)
            .map((bRow) => {
              return bRow.filter(cell => cell === true)
            })
            .filter(bRow => bRow.length > 0)
            .reduce((acum, current) => {
              return acum + current.length
            }, 0)
        }
        return false
      })
      .filter(cell => cell !== false)
  })
  .filter(row => row.length > 0)
  .reduce((acum, current) => {
    return [...acum, ...current]
  }, [])
  .sort((a, b) => b - a)
  .slice(0, 3)
  .reduce((acum, curr) => acum * curr)

console.log(JSON.stringify(mapped, false, 2))
