/* istanbul ignore next */ import * as storage from 'constants/storage'
import { Varsler } from 'widgets/Varsler/VarslerPanel'

export default (namespace: string, file: string | undefined): Varsler | undefined => {
  if (namespace === storage.NAMESPACE_VARSLER) {
    const names = ['Ola Nordmenn', 'Kari Olsen', 'Bjørn Knutsen', 'Are Petersen', 'Harald Eide', 'Ragnhild Dahl']
    return {
      tittel: 'E207',
      fulltnavn: names[Math.floor(Math.random() * names.length)],
      timestamp: file ? file.replace('123___', '') : '-'
    }
  }
  return undefined
}
