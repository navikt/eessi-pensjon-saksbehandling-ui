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

export interface ValidateLengthParams extends ValidateValueParams {
  max: number
}

export const checkIfNotEmpty = (v: Validation, { needle, id, message, extra }: ValidateValueParams): boolean => {
  if (_.isEmpty(_.isString(needle) ? needle.trim() : needle)) {
    return addError(v, { id, message, extra })
  }
  return false
}

export const checkLength = (v: Validation, {
  needle, max = 500, id, message, extra
}: ValidateLengthParams): boolean => {
  if (!_.isEmpty(needle?.trim()) && needle?.trim().length > max) {
    const newExtra = { ...extra, x: max }
    return addError(v, { id, message, extra: newExtra })
  }
  return false
}

export const checkIfDuplicate = (v: Validation, {
  needle, haystack, index, matchFn, id, message, extra
}: any): boolean => {
  let duplicate: boolean
  let _h
  if (!_.isEmpty(needle)) {
    if (_.isNil(index)) {
      _h = haystack
    } else {
      _h = _.filter(haystack, (p, i) => i !== index)
    }
    duplicate = _.find(_h, matchFn) !== undefined
    if (duplicate) {
      return addError(v, { id, message, extra })
    }
  }
  return false
}

export const checkIfNotEmail = (v: Validation, {
  needle, id, message, extra
}: ValidateValueParams): boolean => {
  const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (!_.isEmpty(needle) && !(needle!.match(emailPattern))) {
    return addError(v, { id, message, extra })
  }
  return false
}

export const checkIfNotTelephoneNumber = (v: Validation, {
  needle, id, message, extra
}: ValidateValueParams): boolean => {
  const telephoneNumberPattern = /^\+?\d[\d\s()]*$/

  if (!_.isEmpty(needle) && !(needle!.match(telephoneNumberPattern))) {
    return addError(v, { id, message, extra })
  }
  return false
}

export const checkIfValidLand = (v: Validation, {
  needle,
  id,
  message,
  extra
}: any): boolean => {
  if (!_.isEmpty(needle) && needle?.trim()?.length !== 2) {
    return addError(v, { id, message, extra })
  }
  return false
}

export const checkIfNotGB = (v: Validation, {
  needle,
  id,
  message,
  extra
}: any): boolean => {
  if (!_.isEmpty(needle) && needle?.trim()?.toLowerCase() === 'gb') {
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

export const hasNamespaceWithErrors = (v: Validation, namespace: string): boolean =>
  _.some(v, (value, key) => (key.startsWith(namespace) && v[key]?.feilmelding !== 'ok' && v[key]?.feilmelding !== undefined))

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
