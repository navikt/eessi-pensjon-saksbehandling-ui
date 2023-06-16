import _ from 'lodash'
import { ErrorElement, Validation } from 'declarations/app'
import i18n from "i18next";

export interface ValidateParams {
  id: string
  message: string
  extra ?: any
}

export interface ValidateValueParams extends ValidateParams {
  needle: any
}

export const checkIfNotEmpty = (v: Validation, { needle, id, message, extra }: ValidateValueParams): boolean => {
  if (_.isEmpty(_.isString(needle) ? needle.trim() : needle)) {
    return addError(v, { id, message, extra })
  }
  return false
}

export const addError = (v: Validation, { id, message, extra = {} }: ValidateParams
) => {
  v[id] = {
    feilmelding: i18n.t(message, extra),
    skjemaelementId: id
  } as ErrorElement
  return true
}

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
