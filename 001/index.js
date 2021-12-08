const fs = require('fs')
const rVals = fs.readFileSync('./001.txt', 'utf8')
const vals = rVals.split('\n').map(itm => ~~itm)

const countChanges = input => {
  const changes = input.map((e, i, s) => {
    if (i === 0) return 'N/A'
    if (e > s[i - 1]) return 'increased'
    return 'decreased'
  })
  const increased = changes.filter(e => e === 'increased')
  console.log(increased.length)
}

countChanges(vals)

const triplets = (input, acum = []) => {
  const [t1, t2, t3, ...tail] = input
  const [, ...rest] = input
  acum.push([t1, t2, t3])
  if (tail.length === 0) return acum
  return triplets(rest, acum)
}

const tts = triplets(vals)
const sums = tts.map(([t1, t2, t3]) => t1 + t2 + t3)

countChanges(sums)
