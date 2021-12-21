const io = require('../common/io')
const { join } = require('path')
const [valuesMap, rawMap] = io.readSections(join(__dirname, '020.txt'))

const map = rawMap
  .trim()
  .split('\n')
  .map(line => line.split(''))

const extend = matrix => {
  let cloned = JSON.parse(JSON.stringify(matrix))
  cloned = cloned.map(line => {
    line.push('.')
    line.push('.')
    line.unshift('.')
    line.unshift('.')
    return line
  })
  const lineSize = cloned[0].length
  cloned.push(Array.from({ length: lineSize }).map(bit => '.'))
  cloned.push(Array.from({ length: lineSize }).map(bit => '.'))
  cloned.unshift(Array.from({ length: lineSize }).map(bit => '.'))
  cloned.unshift(Array.from({ length: lineSize }).map(bit => '.'))
  return cloned
}

const enhance = originalMatrix => {
  const matrix = JSON.parse(JSON.stringify(originalMatrix))
  const maxHor = matrix[0].length - 3
  const maxVer = matrix.length - 3
  const snapshots = []
  for (let y = 0; y <= maxVer; y += 1) {
    for (let x = 0; x <= maxHor; x += 1) {
      snapshots.push({
        section: [
          [y, x], [y, x + 1], [y, x + 2],
          [y + 1, x], [y + 1, x + 1], [y + 1, x + 2],
          [y + 2, x], [y + 2, x + 1], [y + 2, x + 2]
        ],
        center: [y + 1, x + 1]
      })
    }
  }
  snapshots
    .map(({ section, center }) => {
      const value = section
        .map(([y, x]) => {
          return matrix[y][x]
        })
        .map(val => val === '#' ? 1 : 0)
        .reduce((acum, curr) => acum + curr, '')
      const val = valuesMap[parseInt(value, 2)]
      return { val, center }
    })
    .forEach(({ val, center: [y, x] }) => {
      matrix[y][x] = val
    })
  return matrix
}

const part1 = (original, times = 0) => {
  if (times === 2) return original
  const nMap = extend(original)
  const enhanced = enhance(nMap)
  console.log(enhanced.join('\n').replace(/,/g, ''))
  console.log('There are', enhanced.join('\n').match(/#/g).length, 'pixels lit')
  return part1(enhanced, times + 1)
}

part1(map)
