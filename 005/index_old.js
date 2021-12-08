const fs = require('fs')
const origin = require('path').join(__dirname, '005.txt')
const raw = fs.readFileSync(origin, 'utf8').split('\n').filter(l => l !== '')

const getPoints = ({ x1, y1, x2, y2 }) => {
  let p1 = { x: x1, y: y1 }
  let p2 = { x: x2, y: y2 }
  if (x1 > x2 || y1 > y2) {
    p2 = { x: x1, y: y1 }
    p1 = { x: x2, y: y2 }
  }
  const points = []
  for (let i = p1.x; i <= p2.x; i += 1) {
    points.push({ x: i, y: p1.y, id: `x${i}y${p1.y}` })
  }
  for (let i = p1.y; i <= p2.y; i += 1) {
    points.push({ x: p1.x, y: i, id: `x${p1.x}y${i}` })
  }
  return points
    .filter((e, i, s) => {
      const indexOther = s.findIndex(({ id }) => id === e.id)
      return indexOther === i
    })
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
  .filter(line => {
    return line.x1 === line.x2 || line.y1 === line.y2
  })
  .map(line => {
    return getPoints(line)
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
  .filter(instance => instance >= 2)

// tonsole.log(JSON.stringify(lines, false, 2))
console.log(crosses.length)
