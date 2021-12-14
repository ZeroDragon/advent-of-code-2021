const { readFileSync } = require('fs')
const { join } = require('path')
const [rDots, rIns] = readFileSync(join(__dirname, '013.txt'), 'utf8')
  .split('\n\n')
const dots = rDots.split('\n')
const ins = rIns.split('\n').filter(line => line !== '')

const clearDots = dots.map(dot => dot.split(',').map(val => ~~val))

const [xs, ys] = clearDots
  .reduce((acum, current) => {
    acum[0].push(current[0])
    acum[1].push(current[1])
    return acum
  }, [[], []])

const maxX = Math.max(...xs)
const maxY = Math.max(...ys)

const clearIns = ins.map(line => {
  const [, , axisPointer] = line.split(' ')
  const [axis, pointer] = axisPointer.split('=')
  return [axis, ~~pointer]
})

let matrix = Array.from({ length: maxY + 1 }).map(_ => {
  return Array.from({ length: maxX + 1 }).map(_ => '.')
})

clearDots.forEach(dot => {
  const [y, x] = dot
  matrix[x][y] = '#'
})

matrix = matrix
  .map(line => line.join(''))

const sumArrays = (left, right) => {
  const leftA = left.map(line => line.split(''))
  const rightA = right.map(line => line.split(''))
  return leftA.map((line, lineN) => {
    return line
      .map((itm, itmN) => {
        const val2 = rightA[lineN] ? rightA[lineN][itmN] : '.'
        if (itm === '#' || val2 === '#') return '#'
        return '.'
      })
      .join('')
  })
}

const foldY = axis => {
  const [up, down] = [matrix.slice(0, axis), matrix.slice(axis + 1, maxY + 1)]
  const reversedDown = [...down].reverse()
  matrix = sumArrays(up, reversedDown)
}

const foldX = axis => {
  const [left, right] = matrix
    .map(line => {
      return [line.slice(0, axis), line.slice(axis + 1, maxX + 1)]
    })
    .reduce((acum, current) => {
      current.forEach((itm, k) => acum[k].push(itm))
      return acum
    }, [[], []])
  const rightReversed = right
    .map(line => {
      return line.split('').reverse().join('')
    })
  matrix = sumArrays(left, rightReversed)
}

const folds = { x: foldX, y: foldY }

const countHashes = _ => {
  return matrix
    .flatMap(row => {
      return row.split('')
    })
    .reduce((acum, current) => {
      return acum + (current === '#' ? 1 : 0)
    }, 0)
}

clearIns.forEach(([axis, value], key) => {
  if (key === 1) console.log('Part1:', countHashes())
  folds[axis](value)
})
