/* eslint-disable no-sequences */
import { readFileSync as rfs } from 'fs'
const { pathname: root } = new URL('./', import.meta.url)
const input = rfs(`${root}024.txt`, 'utf8')
  .trim()
  .split('\n')

const ALU = (
  input,
  state = [...'xyzwi'].reduce((s, v) => ((s[v] = 0), s), {})
) => ({
  state,
  inp: a => (state[a] = (input / 10 ** (13 - state.i++)) % 10 | 0),
  add: (a, b) => (state[a] = state[a] + (state[b] ?? Number(b))),
  mul: (a, b) => (state[a] = state[a] * (state[b] ?? Number(b))),
  mod: (a, b) => (state[a] = state[a] % (state[b] ?? Number(b))),
  div: (a, b) => (state[a] = Math.trunc(state[a] / (state[b] ?? Number(b)))),
  eql: (a, b) => (state[a] = state[a] === (state[b] ?? Number(b)) ? 1 : 0)
})

export const exec = (code, num) =>
  code
    .map(line => line.split(' '))
    .reduce((vm, [instr, a, b]) => (vm[instr](a, b), vm), ALU(num)).state

export const part1 = (lines, max = true) =>
  lines
    .map(line => line.split(' '))
    .map(([, , v]) => Number(v))
    .filter((_, i) => [4, 5, 15].some(r => r === i % 18))
    .reduce(
      (groups, v, i) => (groups[(i / 3) | 0].push(v), groups),
      [...Array(14)].map(_ => [])
    )
    .reduce(
      ([digits, stack], [divZ, c, nextC], i) => {
        if (divZ === 1) {
          stack = [...stack, [nextC, i]]
        } else {
          const [prevC, prevI] = stack.pop()
          const diff = prevC + c
          digits[prevI] = max ? Math.min(9, 9 - diff) : Math.max(1, 1 - diff)
          digits[i] = digits[prevI] + diff
        }
        return [digits, stack]
      },
      [Array(14).fill(0), []]
    )[0]
    .reduce((number, n) => number * 10 + n)

export const part2 = lines => part1(lines, false)

console.log(part1(input))
console.log(part2(input))
