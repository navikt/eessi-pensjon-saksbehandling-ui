export default () => {
  const x = Math.random()
  const whichOne = Math.floor(x * 3)
  if (whichOne === 0) {
    return []
  }
  if (whichOne === 1) {
    return [{
      fnr: '12345678901'
    }]
  }
  if (whichOne === 2) {
    return [{
      fnr: '12345678902'
    }, {
      fnr: '12345678903'
    }]
  }
  return undefined
}
