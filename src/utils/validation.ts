import _ from 'lodash'
import { Validation } from 'declarations/app'

// note that this function not only returns validation, but CHANGES original object, because we want
// that to chain-validate
export const filterAllWithNamespace = (v: Validation, namespace: string | Array<string>): Validation => {
  const namespaceArray: Array<string> = _.isString(namespace) ? [namespace] : namespace
  const allMatchedKeys: Array<string> = Object.keys(v).filter(haystack =>
    namespaceArray.find((needle: string) => haystack.startsWith(needle)) !== undefined)
  for (const path of allMatchedKeys) {
    _.unset(v, path)
  }
  return v
}
