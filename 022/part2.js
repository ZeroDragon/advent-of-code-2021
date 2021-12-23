const { readFileSync: rfs } = require('fs')
const { join } = require('path')
const input = rfs(join(__dirname, '022.txt'), 'utf8')

const parseInput = (rawInput) => rawInput
  .trim()
  .split('\n')
  .map(line => {
    const [on, coords] = line.split(' ')
    const numbers = coords.match(/-?\d+/g).map(x => ~~x)
    const ranges = []
    for (let i = 0; i < numbers.length; i += 2) {
      ranges.push([numbers[i], numbers[i + 1]])
    }
    return {
      on: on === 'on',
      ranges
    }
  })

function volume (c) {
  return c.reduce((acc, [min, max]) => {
    const value = acc *= max + 1 - min
    return value
  }, 1)
}

function intersect2d (a, b) {
  const newMin = Math.max(a[0], b[0])
  const newMax = Math.min(a[1], b[1])
  return newMin > newMax ? null : [newMin, newMax]
}

function overwrittenVolume (a, cuboids) {
  return cuboids.map((b, i) => {
    const intersection = a.map((aRange, j) => intersect2d(aRange, b.ranges[j]))
    if (intersection.includes(null)) return 0 // no overlapping volume
    return volume(intersection) - overwrittenVolume(intersection, cuboids.slice(1 + i))
  }).reduce((acc, cur) => acc + cur, 0)
}

function countOn (cuboids) {
  let total = 0
  for (let i = 0; i < cuboids.length; i++) {
    if (cuboids[i].on) { total += volume(cuboids[i].ranges) - overwrittenVolume(cuboids[i].ranges, cuboids.slice(i + 1)) }
  }
  return total
}

console.log(countOn(parseInput(input)))
