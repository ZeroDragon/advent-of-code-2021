const io = require('../common/io')
const { join } = require('path')
const input = io.readLines(join(__dirname, '018.txt'))

const findPathsToNumbers = (snail, path = [], paths = []) => {
  if (Number.isInteger(snail)) {
    paths.push([path, snail])
  } else {
    snail.forEach((s, i) => findPathsToNumbers(s, path.concat(i), paths))
  }
  return paths
}

const explode = (snail, enumeratePaths) => (paths = enumeratePaths()) =>
  paths
    .filter(([path]) => path.length === 5)
    .slice(0, 2)
    .reduce((exploded, [path, value, index], i) => {
      path.slice(0, 3).reduce((p, d) => p[d], snail)[path.at(-2)] = 0
      const explodeTo = paths.find(
        ([, , j]) => j === index + (i === 0 ? -1 : 1)
      )
      if (explodeTo) {
        const [tPath, tvalue] = explodeTo
        tPath.slice(0, tPath.length - 1).reduce((p, d) => p[d], snail)[
          tPath.at(-1)
        ] = tvalue + value
      }
      return true
    }, false)

const split = (snail, enumeratePaths) => (paths = enumeratePaths()) =>
  paths
    .filter(([, v]) => v > 9)
    .slice(0, 1)
    .reduce((splitted, [path, value]) => {
      path.slice(0, path.length - 1).reduce((p, d) => p[d], snail)[
        path.at(-1)
      ] = [Math.floor, Math.ceil].map(f => f(value / 2))
      return true
    }, false)

const reduce = snail => {
  const enumerate = () => findPathsToNumbers(snail).map((v, i) => v.concat(i))
  const operations = [explode, split].map(f => f(snail, enumerate))
  // eslint-disable-next-line no-empty
  while (operations.reduce((b, op) => b || op(), false)) {}
  return snail
}

const magnitude = snail =>
  snail
    .map((v, i) => (i === 0 ? 3 : 2) * (Array.isArray(v) ? magnitude(v) : v))
    .reduce((sum, v) => sum + v, 0)

const part1 = snails =>
  magnitude(
    snails.map(JSON.parse).reduce((result, snail) => reduce([result, snail]))
  )

console.log(part1(input))

const part2 = snails =>
  snails
    .flatMap((line, i) => [
      [...Array(snails.length - i)].map((_, j) => [i, j + i])
    ])
    .flat()
    .filter(([a, b]) => a !== b)
    .flatMap(([a, b]) => [
      [snails[a], snails[b]],
      [snails[b], snails[a]]
    ])
    .map(part1)
    .reduce((max, v) => Math.max(max, v))

console.log(part2(input))
