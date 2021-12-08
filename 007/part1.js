const fs = require('fs')
const origin = require('path').join(__dirname, '007.txt')
const raw = fs.readFileSync(origin, 'utf8').split('\n').filter(l => l !== '')[0]
const initialValues = raw.split(',').map(v => ~~v)

let poss = []

initialValues.forEach(cpos => {
  if (!poss[cpos]) poss[cpos] = 0
  poss[cpos] += 1
})

poss = poss
  .map((crabs, pos) => ({
    crabs, pos
  }))
  .filter(itm => itm)
  .map(({ crabs, pos }, iterator, arr) => {
    return {
      crabs,
      pos,
      fuel: arr
        .map(itm => {
          return crabs * Math.abs(itm.pos - pos)
        })
    }
  })

const fuels = poss
  .map(({ fuel }) => fuel)
  .reduce((acum, curr) => {
    return curr.map((itm, key) => {
      return itm + (acum[key] || 0)
    })
  }, [])
  .sort((a, b) => {
    if (a > b) return 1
    if (a < b) return -1
    return 0
  })

console.log(fuels[0])
