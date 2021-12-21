const input = require('fs')
  .readFileSync(require('path').join(__dirname, '021.txt'), 'utf8')

const parseInput = (rawInput) => rawInput.match(/(?<=: )\d+/g).map(x => +x)

const part1 = (rawInput) => {
  const [aStart, bStart] = parseInput(rawInput)
  let a = aStart; let b = bStart; let aScore = 0; let bScore = 0; let isATurn = true
  let die = 0; let numRolls = 0
  function roll () {
    numRolls++
    return (die = die % 100 + 1)
  }
  while (aScore < 1000 && bScore < 1000) {
    const rolls = [roll(), roll(), roll()]
    if (isATurn) {
      a += rolls[0] + rolls[1] + rolls[2]
      a = (a - 1) % 10 + 1
      aScore += a
    } else {
      b += rolls[0] + rolls[1] + rolls[2]
      b = (b - 1) % 10 + 1
      bScore += b
    }
    isATurn = !isATurn
  }
  return Math.min(aScore, bScore) * numRolls
}

const frequencies = []
for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 3; j++) {
    for (let k = 1; k <= 3; k++) {
      frequencies[i + j + k] = (frequencies[i + j + k] ?? 0) + 1
    }
  }
}

const part2 = (rawInput) => {
  const [aStart, bStart] = parseInput(rawInput)
  const memo = []
  const winThreshold = 21
  function countWins (aScore, bScore, aPos, bPos, isATurn) {
    const existing = memo[[aScore, bScore, aPos, bPos, isATurn]]
    if (existing !== undefined) return existing
    if (aScore >= winThreshold) {
      memo[[aScore, bScore, aPos, bPos, isATurn]] = [1, 0]
      return [1, 0]
    }
    if (bScore >= winThreshold) {
      memo[[aScore, bScore, aPos, bPos, isATurn]] = [0, 1]
      return [0, 1]
    }
    let totalWins = [0, 0]
    for (let diceSum = 3; diceSum <= 9; diceSum++) {
      let thisWin
      if (isATurn) {
        const nextAPos = (aPos - 1 + diceSum) % 10 + 1
        thisWin = countWins(aScore + nextAPos, bScore, nextAPos, bPos, !isATurn)
      } else {
        const nextBPos = (bPos - 1 + diceSum) % 10 + 1
        thisWin = countWins(aScore, bScore + nextBPos, aPos, nextBPos, !isATurn)
      }
      totalWins = [totalWins[0] + frequencies[diceSum] * thisWin[0], totalWins[1] + frequencies[diceSum] * thisWin[1]]
    }
    memo[[aScore, bScore, aPos, bPos, isATurn]] = totalWins
    return totalWins
  }
  return Math.max(...countWins(0, 0, aStart, bStart, true))
}

console.log(part1(input))
console.log(part2(input))
