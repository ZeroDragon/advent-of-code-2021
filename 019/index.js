const { readFileSync: rfs } = require('fs')
const { join } = require('path')
const input = rfs(join(__dirname, '019.txt'), 'utf8')

const getInput = (s) =>
  s
    .trim()
    .split(/\s*---[^-]+---\s*/)
    .map((x) =>
      x.split(/\s+/).map((x) => x.split(/,/).map((x) => parseInt(x)))
    )

// extract xyz
function findCommonModifier (arr) {
  const a = arr.slice(0)
  a.sort((x, y) => x.v - y.v)
  let mx = 1
  let cur = 1
  let res = a[0]
  for (let i = 1; i < a.length; i++) {
    if (a[i].v === a[i - 1].v) {
      cur++
    } else {
      if (cur > mx) {
        mx = cur
        res = a[i - 1]
      }
      cur = 1
    }
  }
  if (cur > mx) {
    mx = cur
    res = a[a.length - 1]
  }
  res.occur = mx
  return res
}

// find xyz
function findTranslation (a, b) {
  const arr = [[], [], [], [], [], [], [], [], []]
  function push (ar, c, op, v) {
    ar.push({ c, v, op })
  }
  for (let i = 0; i < 3; i++) {
    // x translation
    push(arr[0], 0, -1, a[i][0] + b[i][0])
    push(arr[0], 0, +1, a[i][0] - b[i][0])
    push(arr[1], 1, -1, a[i][0] + b[i][1])
    push(arr[1], 1, +1, a[i][0] - b[i][1])
    push(arr[2], 2, -1, a[i][0] + b[i][2])
    push(arr[2], 2, +1, a[i][0] - b[i][2])
    // y translation
    push(arr[3], 1, -1, a[i][1] + b[i][1])
    push(arr[3], 1, +1, a[i][1] - b[i][1])
    push(arr[4], 0, -1, a[i][1] + b[i][0])
    push(arr[4], 0, +1, a[i][1] - b[i][0])
    push(arr[5], 2, -1, a[i][1] + b[i][2])
    push(arr[5], 2, +1, a[i][1] - b[i][2])
    // z translation
    push(arr[6], 2, -1, a[i][2] + b[i][2])
    push(arr[6], 2, +1, a[i][2] - b[i][2])
    push(arr[7], 0, -1, a[i][2] + b[i][0])
    push(arr[7], 0, +1, a[i][2] - b[i][0])
    push(arr[8], 1, -1, a[i][2] + b[i][1])
    push(arr[8], 1, +1, a[i][2] - b[i][1])
  }
  const xyzTranslations = []
  for (const mod of arr) {
    const most = findCommonModifier(mod)
    if (most.occur === 3) xyzTranslations.push(most)
  }
  return xyzTranslations
}

function distance (a, b) {
  let sum = 0
  for (const i in a) {
    sum += (a[i] - b[i]) ** 2
  }
  return sum
}

function createBeaconThumbprints (A) {
  const beacons = []
  A.forEach((scanner, scannerIdx) => {
    scanner.forEach((beacon, beaconIdx) => {
      const bc = { scannerIdx, beaconIdx, peers: [] }

      scanner.forEach((to, toIdx) => {
        if (beaconIdx === toIdx) return
        const d = distance(beacon, to)
        bc.peers.push({ i: toIdx, d })
      }) // loop peers

      // sum 2 nearest distance
      bc.peers.sort((a, b) => a.d - b.d).splice(2)
      bc.sum = bc.peers.reduce((ac, c) => ac + c.d, 0)
      // distance btw 2 nearest peers
      bc.psum = distance(scanner[bc.peers[0].i], scanner[bc.peers[1].i])
      // risky hash by distance
      bc.hash = bc.sum * bc.psum
      // to derive translation values later
      bc.tri = [beacon, scanner[bc.peers[0].i], scanner[bc.peers[1].i]]
      beacons.push(bc)
    }) // loop beacon
  }) // loop scanner
  return beacons
}

function main (src = input, clear = true) {
  if (clear) console.clear()
  const ans = []
  const [, ...A] = getInput(src)
  const foundScanners = new Map() // match scanner-N to scanner-0 by 1 matched beacon-tri
  let beacons = createBeaconThumbprints(A)
  const uniq = new Set(beacons.map((x) => x.hash))
  ans[0] = uniq.size

  // part 2
  // loop til all scanners found
  while (foundScanners.size < A.length - 1) {
    // match beacon thumbprint from scanner-0 and scanner-N
    for (const a of beacons.filter((x) => x.scannerIdx === 0)) {
      for (const b of beacons.filter((x) => x.scannerIdx > 0)) {
        if (foundScanners.has(b.scannerIdx)) continue
        if (a.hash === b.hash) {
          const translations = findTranslation(a.tri, b.tri)
          foundScanners.set(b.scannerIdx, { a, b, translations })
        }
      }
    }

    // extend scanner-0 by adding new beacons relative to scanner-0
    for (const [idx, match] of foundScanners) {
      for (const beacon of A[idx]) {
        const t = match.translations
        const a = [
          t[0].v + beacon[t[0].c] * t[0].op, // x
          t[1].v + beacon[t[1].c] * t[1].op, // y
          t[2].v + beacon[t[2].c] * t[2].op // z
        ]
        // avoid duplicate which confuse thumbprint calculation
        if (!A[0].some((b) => b[0] === a[0] && b[1] === a[1] && b[2] === a[2])) { A[0].push(a) }
      }
    }

    // todo: instead regenerate all, do only for new joined beacons
    // redo thumbprint for new joined beacon
    beacons = createBeaconThumbprints(A)
  }

  const scanners = [[0, 0, 0]]
  for (const [idx, match] of foundScanners) {
    const t = match.translations
    scanners[idx] = [t[0].v, t[1].v, t[2].v]
  }

  let farthest = 0
  for (const a of scanners) {
    for (const b of scanners) {
      const d =
        Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2])
      farthest = Math.max(d, farthest)
    }
  }
  ans[1] = farthest

  console.log('Part1: ' + ans[0] + '\nPart2: ' + ans[1])
}

main()
