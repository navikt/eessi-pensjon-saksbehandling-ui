import * as storage from 'src/constants/storage'

export default (aktoerId: string) => [aktoerId + '___' + storage.NAMESPACE_BUC + '___' + storage.FILE_BUCINFO]
