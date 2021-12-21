// Target area: x=34..67, y=-215..-186
// Test target area: x=20..30, y=-10..-5 should return 45

const tx = [34, 67]
const ty = [-215, -186]

const bt = (value, min, max) => {
  if (value < min) return false
  if (value > max) return false
  return true
}

let ans = -Infinity
let initVel = 0
for (let deltaX = 0; deltaX <= 1000; deltaX += 1) {
  for (let deltaY = -1000; deltaY <= 1000; deltaY += 1) {
    let found = false
    let maxY = -Infinity
    let x = 0
    let y = 0
    let dX = deltaX
    let dY = deltaY
    for (let step = 0; step <= 1000; step += 1) {
      x += dX
      y += dY
      maxY = Math.max(maxY, y)
      if (dX > 0) dX -= 1
      else if (dX < 0) dX += 1
      dY -= 1
      if (bt(x, ...tx) && bt(y, ...ty)) {
        ans = Math.max(ans, maxY)
        found = true
      }
    }
    if (found) initVel += 1
  }
}

console.log('part1:', ans, 'part2:', initVel)
