const fs = require('fs')
const origin = require('path').join(__dirname, '007.txt')
const raw = fs.readFileSync(origin, 'utf8').split('\n').filter(l => l !== '')[0]
const initialValues = raw.split(',').map(v => ~~v)

// cargamos el arreglo de posiciones, cada KEY del arreglo es la posición
// donde se encuentra un cangrejo. Y el VALUE del arreglo es la cantidad
// de cangrejos en esa posición.
const poss = []
initialValues.forEach(cpos => {
  if (!poss[cpos]) poss[cpos] = 0
  poss[cpos] += 1
})

const fuels = poss
  .map((crabs, pos) => ({
    crabs, pos
  }))
  // hay elementos del arreglo (posiciones de cangrejos) vacías,
  // esas no nos interesan
  .filter(itm => itm)
  // vamos a agregarle a cada posición un arreglo con lo que
  // costaría a todos los cangrejos en esa posición moverse a cada una
  // de las otras posiciones.
  .map(({ crabs, pos }, iterator, arr) => {
    return {
      crabs,
      pos,
      fuel: arr
        // recorremos el mismo arreglo de posiciones para multiplicar
        // los cangrejos por la fórmula de sumatoria de números anteriores
        // al valor máximo de movimientos (max / 2) * (1 + max)
        .map(itm => {
          const moves = Math.abs(itm.pos - pos)
          return crabs * ((moves / 2) * (1 + moves))
        })
    }
  })
  // descartamos los valores innecesarios y nos quedamos solo con los fuels
  .map(({ fuel }) => fuel)
  // tenemos un arreglo de arreglos donde cada posición tiene el costo de
  // cada grupo de cangrejos para moverse a dicha posición.
  // entonces con un reduce podemos sumar cada uno de los valores de cada
  // arreglo hasta tener un arreglo único con todas las sumas de valores
  // para cada posición
  .reduce((acum, curr) => {
    return curr.map((itm, key) => {
      return itm + (acum[key] || 0)
    })
  }, [])
  // ahora solo lo ponemos de menor a mayor, y el primer elemento será
  // el costo más bajo
  .sort((a, b) => {
    if (a > b) return 1
    if (a < b) return -1
    return 0
  })

console.log(fuels[0])
