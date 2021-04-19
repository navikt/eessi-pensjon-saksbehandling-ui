/* istanbul ignore next */
import { Sed } from 'declarations/buc'

export default async (sed: Sed, type: string = 'small') => {
  const which = sed.creationDate % 2 !== 0 ? 1 : 2
  const m = await import('mocks/buc/sed_P5000_' + type + '' + which)
  return m.default
}
