const fs = require('fs')
const rInstructions = fs.readFileSync('./002.txt', 'utf8')
const instructions = rInstructions.split('\n').map(itm => {
  const [direction, value] = itm.split(' ')
  return { direction, value: ~~value }
}).filter(({ direction }) => direction !== '')

const dic = { up: 0, down: 0, forward: 0 }
instructions.forEach(({ direction, value }) => { dic[direction] += value })
const pos = { horizontal: 0, depth: 0 }
pos.horizontal += dic.forward
pos.depth += dic.down
pos.depth -= dic.up
console.log(pos.horizontal * pos.depth)

const pos2 = { aim: 0, horizontal: 0, depth: 0 }
instructions.forEach(({ direction, value }) => {
  switch (direction) {
    case 'forward':
      pos2.horizontal += value
      pos2.depth += pos2.aim * value
      break
    case 'down':
      pos2.aim += value
      break
    case 'up':
      pos2.aim -= value
      break
    default:
      console.log('what')
      break
  }
})

console.log(pos2.horizontal * pos2.depth)
