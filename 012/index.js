const fs = require('fs')
const { join } = require('path')
const input = fs
  .readFileSync(join(__dirname, '012.txt'), 'utf8')
  .split('\n')
  .filter(line => line !== '')

const [,, part] = process.argv

const routes = new Map()

const getCave = name => {
  if (!routes.get(name)) {
    routes.set(name, {
      name,
      isBig: /^[A-Z]\w*$/.test(name),
      connections: []
    })
  }
  return routes.get(name)
}

input
  .map(line => line.split('-'))
  .forEach(names => {
    names
      .map(name => getCave(name))
      .forEach((cave, index, caves) => {
        const other = caves[~~(!index)]
        cave.connections.push(other)
      })
  })

const start = routes.get('start')
const end = routes.get('end')

const filterPart = {
  1: (visited) => {
    return cave => cave.isBig || !visited.has(cave)
  },
  2: (visited, isTwice) => cave => {
    return cave.isBig || !visited.has(cave) || visited.get(cave) < 1 || !isTwice
  }
}

const getPaths = (from, visited, twice = false) => {
  if (from === end) return [end.name]

  const caveCount = (visited.get(from) || 0) + 1
  visited.set(from, caveCount)

  const isTwice = (!from.isBig && caveCount > 1) || twice

  const paths = from.connections
    .filter(next => next !== start)
    .filter(filterPart[part](visited, isTwice))
    .flatMap(next => getPaths(next, visited, isTwice))
    .map(path => [from.name, path].join(','))

  if (~~part === 1) visited.delete(from)
  else visited.set(from, caveCount - 1)

  return paths
}

const paths = getPaths(start, new Map())

console.log(paths.length)
