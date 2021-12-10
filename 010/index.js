const fs = require('fs')
const os = require('os')
const path = require('path')

const input = fs
  .readFileSync(path.join(__dirname, '010.txt'))
  .toString()
  .split(os.EOL)
  .map((x) => x.trim().split(''))

const isOpen = (character) => ['(', '{', '<', '['].some((c) => c === character)

const getOpened = (character) => {
  const table = {
    ')': '(',
    '}': '{',
    ']': '[',
    '>': '<'
  }

  return table[character]
}

const getClosed = (character) => {
  const table = {
    '(': ')',
    '{': '}',
    '[': ']',
    '<': '>'

  }

  return table[character]
}

const getPoints = (character, part1) => {
  const table = {
    ')': [3, 1],
    ']': [57, 2],
    '}': [1197, 3],
    '>': [25137, 4]

  }

  return part1 ? table[character][0] : table[character][1]
}

const getCorrupt = (line) => {
  const corrupt = []
  let isCorrupt = false
  const stack = []
  let idx = 0

  while (!isCorrupt && idx < line.length) {
    if (isOpen(line[idx])) {
      stack.push(line[idx])
    } else {
      if (stack[stack.length - 1] === getOpened(line[idx])) {
        stack.pop()
      } else {
        isCorrupt = true
        corrupt.push(line[idx])
      }
    }

    idx++
  }

  return corrupt
}

const getScore = (line) => {
  const stack = []
  let idx = 0

  while (idx < line.length) {
    if (isOpen(line[idx])) {
      stack.push(line[idx])
    } else {
      if (stack[stack.length - 1] === getOpened(line[idx])) stack.pop()
    }

    idx++
  }

  return stack
    .map(getClosed)
    .reverse()
    .reduce((acc, cur) => {
      return (acc = acc * 5 + getPoints(cur, false))
    }, 0)
}

const isCorrupt = (line) => {
  let isCorrupt = false
  const stack = []
  let idx = 0

  while (!isCorrupt && idx < line.length - 1) {
    if (isOpen(line[idx])) {
      stack.push(line[idx])
    } else {
      if (stack[stack.length - 1] === getOpened(line[idx])) {
        stack.pop()
      } else {
        isCorrupt = true
      }
    }

    idx++
  }

  return isCorrupt
}

const part1 = (data) => {
  const characters = data.reduce((acc, cur) => {
    return (acc = [...acc, ...getCorrupt(cur)])
  }, [])

  return characters.reduce((acc, cur) => {
    return (acc += getPoints(cur, true))
  }, 0)
}

const part2 = (data) => {
  const clean = data.filter((x) => !isCorrupt(x))
  const scores = clean.map(getScore).sort((a, b) => a - b)
  return scores[Math.round((scores.length - 1) / 2)]
}

console.log(part1(input))
console.log(part2(input))
