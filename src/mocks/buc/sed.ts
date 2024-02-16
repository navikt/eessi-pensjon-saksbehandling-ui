export default (type: string) => {
  const m = require('mocks/buc/sed_' + type)
  return m.default
}
