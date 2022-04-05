import * as storage from 'constants/storage'

export default (aktoerId: string) => [aktoerId + '--_' + storage.NAMESPACE_BUC + '--_' + storage.FILE_BUCINFO]
