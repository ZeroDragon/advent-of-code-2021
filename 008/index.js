const fs = require('fs')
const origin = require('path').join(__dirname, '008.txt')
const input = fs.readFileSync(origin, 'utf8').split('\n').filter(l => l !== '')

const inputArray = input
  .map(line => line
    .split(' | ')
    .map(section => section
      .split(' ')
      .map(letter => letter
        .split('')
        .sort()
        .join('')
      )
    )
  )

const testProbe = probe => {
  const ordered = probe.sort((a, b) => a.length - b.length)
  const numDic = {}
  numDic[ordered[0]] = 1
  numDic[ordered[1]] = 7
  numDic[ordered[2]] = 4
  numDic[ordered[9]] = 8
  const four = ordered[2].split('')
  const seven = ordered[1].split('')
  for (let i = 3; i <= 8; i += 1) {
    const current = ordered[i]
    if (current.length === 6) {
      // posibilidades: 0, 6 y 9
      // solo el 9 trae todas las posiciones del 4
      if (four.every(letter => current.includes(letter))) {
        numDic[current] = 9
        // solo el 0 trae todas las posiciones del 7
        // pero además no trajo todas las del 4
      } else if (seven.every(letter => current.includes(letter))) {
        numDic[current] = 0
        // la tercera es la vencida
      } else {
        numDic[current] = 6
      }
    } else {
      // posibilidades: 2, 3 y 5
      // solo el 3 trae todos los valores del 7
      if (seven.every(letter => current.includes(letter))) {
        numDic[current] = 3
      // solo el 5 tiene 3 coincidencias con el 4
      } else if (four.filter(letter => current.includes(letter)).length === 3) {
        numDic[current] = 5
      // la tercera es la vencida
      } else {
        numDic[current] = 2
      }
    }
  }
  return numDic
}

const validValues = [1, 4, 7, 8]
const part1 = inputArray
  .map(line => {
    const [probe, input] = line
    const dictionary = testProbe(probe)
    const parsed = input.map(digit => dictionary[digit])
    return parsed.filter(number => validValues.includes(number)).length
  })
  .reduce((acum, current) => acum + current)

console.log(part1)

const part2 = inputArray
  .map(line => {
    const [probe, input] = line
    const dictionary = testProbe(probe)
    const parsed = input.map(digit => dictionary[digit])
    // tenemos los digitos, hay que juntarlos sin que se sumen
    // string concatenation al rescate
    return parsed.reduce((acum, current) => acum + current, '')
  })
  // ahora si hay que sumar todos los valores como enteros
  .reduce((acum, current) => acum + ~~current, 0)

console.log(part2)

