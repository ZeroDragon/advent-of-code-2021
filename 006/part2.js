const fs = require('fs')
const origin = require('path').join(__dirname, '006.txt')
const raw = fs.readFileSync(origin, 'utf8').split('\n').filter(l => l !== '')[0]
const initialValues = raw.split(',').map(v => ~~v)

const iterations = 256 // days to calculate
const offset = 8 + 1 // days for new spawn
const numberOfDays = iterations + offset
const days = Array.from({ length: numberOfDays }).fill(0)

const spawnDays = Array
  .from({ length: Math.ceil(numberOfDays / 7) })
  .map((_, i) => i * 7)

initialValues.forEach(timeout => {
  days[timeout] += 1
})

// Básicamente hay que recorrer todos los días con el seed inicial
// y buscae en qué días van a nacer los nuevos peces para luego
// sumarle a esos días los nuevos peces y así hasta recorrer todos
// los días y todos los spawnDays dentro de los días.
// De esta forma no hay que recorrer pez por pez en cada día, solo se
// van sumando los acumuladores
days.forEach((fishes, current) => {
  spawnDays.forEach(dayD => {
    const newFishes = current + dayD + offset
    if (newFishes < numberOfDays) {
      days[newFishes] += fishes
    }
  })
})

// console.log(days)

const fishes = days.reduce((acum, fish) => acum + fish)

console.log(fishes)
