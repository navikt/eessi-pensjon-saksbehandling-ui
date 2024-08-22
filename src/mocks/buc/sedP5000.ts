/* istanbul ignore next */
import { Sed } from 'src/declarations/buc'

const seds: any = {
  '60578cf8bf9f45a7819a39987c6c8fd4': 1,
  '50578cf8bf9f45a7819a39987c6c8fd4': 2, // foreign
  '40578cf8bf9f45a7819a39987c6c8fd4': 3
}

export default (sed: Sed, type: string = 'small') => {
  let sedNr
  if (seds[sed.id]) sedNr = seds[sed.id]
  if (sedNr === undefined && sed.lastUpdate) sedNr = sed.lastUpdate % 3 + 1

/*  const m = require('mocks/buc/sed_P5000_' + type + '' + sedNr)
  return m.default*/

  let m;
  import(`./sed_P5000_${type}${sedNr}.ts`)
    .then(module => {
      m = module.default;
      return m;
    })
    .catch(error => {
      console.error('Failed to load module:', error);
    });
}
