const fs = require('fs')
const origin = require('path').join(__dirname, '004.txt')
const raw = fs.readFileSync(origin, 'utf8').split('\n\n')
const [rNumbers, ...rBoards] = raw
const boards = rBoards.map(board => board.split('\n').filter(row => row !== ''))
const numbers = rNumbers.split(',')
class Board {
  constructor (rawBoard, name) {
    this.tablet = rawBoard.map(row => row.split(/\s+/))
    this.score = this.tablet.map(row => row.map(_ => 0))
    this.name = name
  }

  search (input, time) {
    this.tablet.forEach((row, rPos) => {
      const found = row.indexOf(input)
      if (found !== -1) this.score[rPos][found] = 1
    })
    this.checkWinner(input, time)
  }

  rowSum (matrix) {
    return matrix.map(row => row.reduce((a, b) => a + b))
  }

  traspose (matrix) {
    return matrix[0].map((col, i) => matrix.map(row => row[i]))
  }

  checkWinner (input, time) {
    // console.log(this.tablet, this.score)
    const rowValues = this.rowSum(this.score)
    const trasposed = this.traspose(this.score)
    const columnValues = this.rowSum(trasposed)
    const allValues = [...rowValues, ...columnValues]
    const hasWinner = allValues.find(value => value === 5)
    if (hasWinner) this.calculate(input, time)
  }

  calculate (input, time) {
    if (this.isWinner) return
    this.isWinner = true
    this.time = time
    const notChecked = this.tablet
      .map((row, rowIndex) => {
        return row.map((cell, cellIndex) => {
          return this.score[rowIndex][cellIndex] === 0 ? ~~cell : 0
        })
      })
      .reduce((acumRow, currentRow) => {
        const rowValue = currentRow.reduce((a, b) => a + b)
        return acumRow + rowValue
      }, 0)
    this.winnerValue = notChecked * input
  }
}

const gameBoards = []
boards.forEach((board, index) => {
  gameBoards.push(new Board(board, `b${index}`))
})

const setNumber = (index = 0) => {
  const number = numbers[index]
  const winners = gameBoards
    .filter(board => {
      board.search(number, index)
      return true
    })
    .map(board => ({ value: board.winnerValue, time: board.time }))
    .sort((a, b) => {
      if (a.time > b.time) return 1
      if (a.time < b.time) return -1
      return 0
    })
  const nextIndex = index + 1
  if (numbers[nextIndex]) return setNumber(nextIndex)
  return winners
}

const winners = setNumber()
const first = winners.shift()
const last = winners.pop()
console.log(first, last)
