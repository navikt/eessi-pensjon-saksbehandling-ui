/* istanbul ignore next */
import { Sed } from 'declarations/buc'

const seds: any = {
  '60578cf8bf9f45a7819a39987c6c8fd4': 1,
  '50578cf8bf9f45a7819a39987c6c8fd4': 2,
  '40578cf8bf9f45a7819a39987c6c8fd4': 3
}

export default (sed: Sed, type: string = 'small') => {
  const sedNr = seds[sed.id] || sed.lastUpdate % 3 + 1
  const m = require('mocks/buc/sed_P5000_' + type + '' + sedNr)
  return m.default
}
