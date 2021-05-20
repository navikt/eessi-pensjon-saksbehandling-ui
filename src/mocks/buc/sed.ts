/* istanbul ignore next */
import { Sed } from 'declarations/buc'

const seds: any = {
  '60578cf8bf9f45a7819a39987c6c8fd4': 1,
  '50578cf8bf9f45a7819a39987c6c8fd4': 2,
  '40578cf8bf9f45a7819a39987c6c8fd4': 3
}

export default async (sed: Sed, type: string = 'small') => {
  const m = await import('mocks/buc/sed_P5000_' + type + '' + seds[sed.id])
  return m.default
}
