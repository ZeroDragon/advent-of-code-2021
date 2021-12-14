const fs = require('fs')
const { join } = require('path')
require('consolecolors')

const [data1, data2] = fs
  .readFileSync(join(__dirname, '013.txt'), 'utf8')
  .split('\n\n')

const coordinates = data1
  .split('\n')
  .map((line) => {
    const [x, y] = line.split(',').map(Number)
    return { x, y }
  })

const foldInstructions = data2
  .trim()
  .split('\n')
  .map(line => {
    const [, , ins] = line.split(' ')
    const [axis, position] = ins.split('=')
    return { axis, position: ~~position }
  })

const part2 = _ => {
  const points = JSON.parse(JSON.stringify(coordinates))
  const nextPoints = []
  foldInstructions.forEach(fold => {
    points.forEach(point => {
      if (point[fold.axis] > fold.position) {
        point[fold.axis] = (point[fold.axis] - fold.position) * -1 + fold.position
      }
      nextPoints.push(point)
    })
  })

  // remove dupes
  const set = new Set(points.map(p => `${p.x},${p.y}`))
  const array = [...set].map(point => point.split(','))
  const maxX = Math.max(...array.map(([x]) => ~~x))
  const maxY = Math.max(...array.map(([, y]) => ~~y))

  for (let j = 0; j <= maxY; j++) {
    let string = ''
    for (let i = 0; i <= maxX; i++) {
      const key = `${i},${j}`
      if (set.has(key)) {
        string += '#'.blue
      } else {
        string += ' '
      }
    }
    console.log(string)
  }
}

part2()
