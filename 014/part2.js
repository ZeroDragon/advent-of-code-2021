const { readFileSync: rfs } = require('fs')
const { join } = require('path')
const [template, rRules] = rfs(join(__dirname, '014.txt'), 'utf8')
  .split('\n\n')
  .map(line => line.trim())
const rules = {}
rRules.split('\n').forEach(rule => {
  const [pair, insert] = rule.split(' -> ')
  const [a, b] = pair
  rules[pair] = `${a}${insert}${b}`
})

const inserter = (templ, times, first) => {
  if (templ.length > 2) {
    const [a, ...rest] = templ
    const [b] = rest
    const left = mInserter(`${a}${b}`, times, first)
    const right = mInserter(rest.join(''), times, false)
    const sum = {}
    Object.entries(right).forEach(([key, val]) => {
      if (!sum[key]) sum[key] = 0
      sum[key] += val
    })
    Object.entries(left).forEach(([key, val]) => {
      if (!sum[key]) sum[key] = 0
      sum[key] += val
    })
    return sum
  }
  if (times > 0) {
    const applied = rules[templ]
    return mInserter(applied, times - 1, first)
  }
  const value = first ? templ : templ[1]
  const counter = {}
  value.split('').forEach(v => {
    if (!counter[v]) counter[v] = 0
    counter[v] += 1
  })
  return counter
}

const cache = {}
const mInserter = (...params) => {
  if (!cache[params.join('')]) {
    cache[params.join('')] = inserter(...params)
  }
  return cache[params.join('')]
}

const result = mInserter(template, 40, true)
const max = Math.max(...Object.values(result))
const min = Math.min(...Object.values(result))

console.log(max, min, max - min)
