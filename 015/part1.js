const { readFileSync: rfs } = require('fs')
const { join } = require('path')
require('consolecolors')
const map = rfs(join(__dirname, 'test.txt'), 'utf8')
  .trim()
  .split('\n')
  .map(line => line.split('').map(n => ~~n))

const start = '0,0'
const end = '9,9'

const getOptions = ([y, x]) => {
  const options = []
  if (map[y + 1] !== undefined) options.push([y + 1, x])
  if (map[y][x + 1] !== undefined) options.push([y, x + 1])
  return options
}

const tracer = pos => {
  const options = getOptions(pos)
  const route = {}
  if (options.length === 0) {
    route[pos] = []
  } else {
    route[pos] = options.map(iPos => memoizer(iPos))
  }
  return route
}

let cache = {}
const memoizer = (...args) => {
  const pointer = args.join('')
  if (!cache[pointer]) cache[pointer] = tracer(...args)
  return cache[pointer]
}

const trace = memoizer([0, 0])

const stories = []
const joiner = (...args) => {
  const [node, story] = args
  const [name, nodes] = Object.entries(node)[0]
  if (nodes.length === 0) {
    stories.push(`${story}-${end}`)
  }
  nodes.forEach(nde => {
    joiner(
      nde,
      [story, name]
        .filter(s => s)
        .filter(s => s !== start)
        .join('-')
    )
  })
}

joiner(trace)
// memoizer(joiner, trace)
cache = {}

const winner = stories
  .map(story => {
    return story
      .split('-')
      .map(step => {
        const [y, x] = step.split(',').map(val => ~~val)
        return map[y][x]
      })
      .reduce((acum, curr) => acum + curr)
  })
  .map((value, pos) => ({ value, pos }))
  .sort((a, b) => {
    if (a.value > b.value) return 1
    if (a.value < b.value) return -1
    return 0
  })[0]

let toPrint = JSON.parse(JSON.stringify(map))
stories[winner.pos]
  .split('-')
  .forEach(step => {
    const [y, x] = step.split(',').map(val => ~~val)
    toPrint[y][x] = toPrint[y][x].blue
  })
toPrint[0][0] = toPrint[0][0].blue
toPrint = toPrint.map(line => line.join(''))

console.log(winner.value)
console.log(toPrint.join('\n'))
