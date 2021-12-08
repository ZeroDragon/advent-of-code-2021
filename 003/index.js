const fs = require('fs')
const origin = require('path').join(__dirname, '003.txt')
const raw = fs.readFileSync(origin, 'utf8').split('\n').filter(e => e !== '')

const mostCommon = (list, side = 0) => {
  const inputSize = list.length
  const init = list[0].split('').map(bit => 0)
  const reduced = list
    .reduce((acum, current) => {
      const [...bits] = current.split('').map(e => ~~e)
      return acum.map((bit, pos) => bit + bits[pos])
    }, init)
    .map(value => {
      const mid = inputSize / 2
      if (side === 1) {
        return value >= mid ? 1 ^ side : 0 ^ side
      }
      return value < mid ? 0 : 1
    })
  return reduced
}

const reduced = mostCommon(raw)
const gammaBin = reduced.join('')
const epsilonBin = reduced.map(bit => bit ^ 1).join('')
const gamma = parseInt(gammaBin, 2)
const epsilon = parseInt(epsilonBin, 2)
console.log(gamma * epsilon)

const reducer = (list, filter, pos = 0) => {
  const reduced = mostCommon(list, filter)
  const newList = list
    .map(lecture => lecture.split('').map(bit => ~~bit))
    .filter(lecture => lecture[pos] === reduced[pos])
    .map(lecture => lecture.join(''))
  if (newList.length === 1) return newList[0]
  const next = pos + 1
  return reducer(newList, filter, next)
}
const oBin = reducer(raw, 0)
const coBin = reducer(raw, 1)
const oxigen = parseInt(oBin, 2)
const dioxide = parseInt(coBin, 2)
console.log(oxigen * dioxide)
