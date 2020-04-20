import * as storage from 'constants/storage'

export default (aktoerId: string) => [
  aktoerId + '___' + storage.NAMESPACE_PINFO + '___' + storage.FILE_PINFO
]
