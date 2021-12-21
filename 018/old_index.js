const io = require('../common/io')
const { join } = require('path')
const input = io.readLines(join(__dirname, 'test.txt'))
  // .map(line => JSON.parse(line))

const add = (left, right) => [left, right]

const explode = snailNumber => {
  let deep = 0
  let loc = 0
  const byLetter = snailNumber.split('')
  for (let i = 0; i <= byLetter.length; i += 1) {
    const e = byLetter[i]
    if (e === '[') deep += 1
    if (e === ']') deep -= 1
    if (deep === 5) {
      loc = i
      break
    }
  }
  const second = snailNumber.slice(loc)
  const first = snailNumber.slice(0, loc)
  const pBracket = first.lastIndexOf('[')
  const nBracket = second.indexOf(']') + 1
  const nnBracket = second.slice(nBracket).indexOf(']')

  const prev = snailNumber.slice(0, pBracket)
  const next = second.slice(nBracket + nnBracket + 1)
  const middle = second.slice(0, nBracket)

  const [left, right] = JSON.parse(middle)
  const pNumber = ~~(/(\d+)(?!.*\d)/.exec(first) || [0])[0]
  const nNumber = ~~(/\d+/.exec(second.slice(nBracket)) || [0])[0]
  const nMiddle = JSON.stringify([
    pNumber === 0 ? 0 : pNumber + left,
    nNumber === 0 ? 0 : nNumber + right
  ])
  console.log(`${prev}${nMiddle}${next}`)
  return `${prev}${nMiddle}${next}`
}

console.log(explode('[[[[[9,8],1],2],3],4]') === '[[[[0,9],2],3],4]')
console.log(explode('[7,[6,[5,[4,[3,2]]]]]') === '[7,[6,[5,[7,0]]]]')
console.log(explode('[[6,[5,[4,[3,2]]]],1]') === '[[6,[5,[7,0]]],3]')
