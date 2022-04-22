import * as storage from 'constants/storage'

export default (aktoerId: string) => [aktoerId + '___' + storage.NAMESPACE_BUC + '___' + storage.FILE_BUCINFO]
