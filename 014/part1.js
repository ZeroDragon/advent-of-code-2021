const { readFileSync: rfs } = require('fs')
const { join } = require('path')
const [template, rRules] = rfs(join(__dirname, '014.txt'), 'utf8')
  .split('\n\n')
  .map(line => line.trim())
const rules = new Map()
rRules.split('\n').forEach(rule => {
  const [pair, insert] = rule.split(' -> ')
  rules.set(pair, insert)
})

const inserter = templ => {
  return templ.split('')
    .map((letter, index, arr) => {
      if (arr.length === index + 1) return ''
      return `${letter}${arr[index + 1]}`
    })
    .filter(pair => pair !== '')
    .map(pair => {
      if (!rules.has(pair)) return pair
      const [left] = pair.split('')
      return `${left}${rules.get(pair)}`
    })
    .reverse()
    .reduce((acum, current) => {
      return `${current}${acum}`
    }, templ.split('').pop())
}

const recurser = max => (templ, times = 0) => {
  if (times === max) return templ
  const nTempl = inserter(templ)
  return recurser(max)(nTempl, times + 1)
}

const part = times => {
  const reps = {}
  recurser(times)(template)
    .split('')
    .forEach(letter => {
      if (!reps[letter]) reps[letter] = 0
      reps[letter] += 1
    })

  const max = Math.max(...Object.values(reps))
  const min = Math.min(...Object.values(reps))

  console.log(reps, max, min, max - min)
}

part(10) // 10 or 40
