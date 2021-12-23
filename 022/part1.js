const { readFileSync: rfs } = require('fs')
const { join } = require('path')
const input = rfs(join(__dirname, '022.txt'), 'utf8')
  .trim()
  .split('\n')
  .map(line => line.split(' '))
  .map(([action, values]) => ({ action, bounds: values.split(',') }))
  .map(data => {
    data.bounds = data.bounds
      .map(bound => bound.split('=')[1])
      .map(bound => {
        const [min, max] = bound.split('..').map(itm => ~~itm)
        return { min, max }
      })
    return data
  })

const runner = (instructions, ret, step = 0) => {
  if (!instructions[step]) return ret
  const { action, bounds: [x, y, z] } = instructions[step]
  if (
    x.min >= -50 && x.max <= 50 &&
    y.min >= -50 && y.max <= 50 &&
    z.min >= -50 && z.max <= 50
  ) {
    console.log(action, x, y, z)
    for (let xx = x.min; xx <= x.max; xx += 1) {
      for (let yy = y.min; yy <= y.max; yy += 1) {
        for (let zz = z.min; zz <= z.max; zz += 1) {
          const key = [xx, yy, zz].join(':')
          if (action === 'on') ret[key] = true
          if (action === 'off') delete ret[key]
        }
      }
    }
  }
  return runner(instructions, ret, step + 1)
}

const result = runner(input, {})

console.log(Object.keys(result).length)
