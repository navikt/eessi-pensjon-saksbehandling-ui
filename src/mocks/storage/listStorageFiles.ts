import * as storage from 'constants/storage'

export default (userId: string, namespace: string): Array<string> => {
  if (namespace === storage.NAMESPACE_PINFO) {
    return [userId + '___' + namespace + '___' + storage.FILE_PINFO]
  }
  if (namespace === storage.NAMESPACE_VARSLER + '___123') {
    return [
      userId + '___' + namespace + '___2019-02-02Z00:00:00',
      userId + '___' + namespace + '___2019-02-27Z00:00:00',
      userId + '___' + namespace + '___2019-03-10Z00:00:00',
      userId + '___' + namespace + '___2019-03-22Z00:00:00',
      userId + '___' + namespace + '___2019-04-01Z00:00:00',
      userId + '___' + namespace + '___2019-06-15Z00:00:00'
    ]
  }
  return []
}
