const fs = require('fs')
const origin = require('path').join(__dirname, '005.txt')
const raw = fs.readFileSync(origin, 'utf8').split('\n').filter(l => l !== '')

const getPts = ({ x1, y1, x2, y2 }) => {
  let m = 0
  if (x1 - x2 !== 0) m = (y2 - y1) / (x2 - x1)
  const c = y1 - m * x1
  const pts2 = []
  if (x1 < x2) {
    for (let i = x1; i <= x2; i += 1) {
      const y = m * i + c
      pts2.push({ x: i, y, id: `x${i}y${y}` })
    }
  }
  if (x1 > x2) {
    for (let i = x2; i <= x1; i += 1) {
      const y = m * i + c
      pts2.push({ x: i, y, id: `x${i}y${y}` })
    }
  }
  if (x1 === x2) {
    if (y1 < y2) {
      for (let i = y1; i <= y2; i += 1) {
        pts2.push({ x: x1, y: i, id: `x${x1}y${i}` })
      }
    }
    if (y1 > y2) {
      for (let i = y2; i <= y1; i += 1) {
        pts2.push({ x: x1, y: i, id: `x${x1}y${i}` })
      }
    }
  }
  return pts2
}

const lines = raw
  .map(input => {
    const [point1, point2] = input.split(' -> ')
    return [point1, point2]
  })
  .map(([point1, point2]) => {
    const [x1, y1] = point1.split(',').map(v => ~~v)
    const [x2, y2] = point2.split(',').map(v => ~~v)
    return { x1, y1, x2, y2 }
  })
  .map(line => {
    return getPts(line)
  })

const pts = {}
lines.forEach(line => {
  line.forEach(({ id }) => {
    if (!pts[id]) pts[id] = []
    pts[id].push(id)
  })
})

const crosses = Object.keys(pts)
  .map(key => {
    return pts[key].length
  })
  .filter(instances => instances >= 2)

// console.log(pts)
console.log(crosses.length)
// console.log(JSON.stringify(lines, false, 2))
