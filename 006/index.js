const fs = require('fs')
const origin = require('path').join(__dirname, 'test.txt')
const raw = fs.readFileSync(origin, 'utf8').split('\n').filter(l => l !== '')[0]
const initialValues = raw.split(',').map(v => ~~v)

class Fish {
  constructor (initial) {
    this.value = initial
  }

  dayPass () {
    if (this.value === 0) {
      this.value = 6
      return new Fish(8)
    }
    this.value -= 1
    return null
  }
}

const fishes = []

initialValues.forEach(value => {
  fishes.push(new Fish(value))
})

// console.log(fishes)

const days = [...new Array(80)].map((_, i) => i)
days.forEach(d => {
  const newFishes = fishes
    .map(fish => {
      return fish.dayPass()
    })
    .filter(newFish => newFish !== null)
  newFishes.forEach(fish => {
    fishes.push(fish)
  })
})

console.log(fishes.length)
