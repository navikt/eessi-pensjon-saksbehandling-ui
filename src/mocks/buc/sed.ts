/* istanbul ignore next */
import { Sed } from 'declarations/buc'
import mockSedP50001 from 'mocks/buc/sed_P5000_1'
import mockSedP50002 from 'mocks/buc/sed_P5000_2'

export default (sed: Sed) => (sed.creationDate % 2 !== 0 ? mockSedP50001 : mockSedP50002)
