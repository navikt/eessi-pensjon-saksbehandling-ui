import _ from 'lodash'
import { ErrorElement, Validation } from 'src/declarations/app'
import i18n from "i18next";
import {isDateValidFormat} from "src/applications/P2000/DateField/DateField";

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

export const isInteger = (v: any): boolean => {
  return v!.match(/^[0-9]*$/)
}

export const hasFourDigits = (v: any): boolean => {
  return v.toString().length === 4
}

export const isOutOfRange = (num: any, from: any, to: any): boolean => {
  return (parseInt(num) < from) || (parseInt(num) > to)
}

export const checkIfEmpty = (v: Validation, { needle, id, message, extra }: ValidateValueParams): boolean => {
  if (_.isEmpty(_.isString(needle) ? needle.trim() : needle)) {
    return addError(v, { id, message, extra })
  }
  return false
}

export const checkIfNotInteger = (v: Validation, {
  needle, id, message, extra
}: ValidateValueParams): boolean => {
  if (!_.isEmpty(needle) && !(isInteger(needle))) {
    return addError(v, { id, message, extra })
  }
  return false
}

export const checkIfTooLong = (v: Validation, {
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


export const checkIfNotValidDateFormat = (v: Validation, { needle, id, message, extra }: ValidateValueParams): boolean => {
  if (isDateValidFormat(needle)){
    return false
  } else {
    return addError(v, { id, message, extra })
  }
}


export const checkIfNotEmail = (v: Validation, {
  needle, id, message, extra
}: ValidateValueParams): boolean => {
  const emailPattern = /([\w\-\.]+)@(([\w]+\.)+)([a-zA-Z]{2,15})/
  if (!_.isEmpty(needle) && !(needle!.match(emailPattern))) {
    return addError(v, { id, message, extra })
  }
  return false
}

export const checkIfNotTelephoneNumber = (v: Validation, {
  needle, id, message, extra
}: ValidateValueParams): boolean => {
  const telephoneNumberPattern = /^((\+|[0]{2})?[0-9]{1,3}[\. \-]?([0-9]{1,3}[\- \.]?)([0-9][\- \.]?){5,10}[0-9])$/

  if (!_.isEmpty(needle) && !(needle!.match(telephoneNumberPattern))) {
    return addError(v, { id, message, extra })
  }
  return false
}

export const checkIfNotValidBeloep = (v: Validation, {
  needle, id, message, extra
}: ValidateValueParams): boolean => {
  const beloepPattern = /^\d+(\.\d+)?$/

  if (!_.isEmpty(needle) && !(needle!.match(beloepPattern))) {
    return addError(v, { id, message, extra })
  }
  return false
}

export const checkIfNotValidSwift = (v: Validation, {
  needle, id, message, extra
}: ValidateValueParams): boolean => {
  const swiftPattern = /^([a-zA-Z]){4}([a-zA-Z]){2}([0-9a-zA-Z]){2}([0-9a-zA-Z]{3})?$/

  if (!_.isEmpty(needle) && !(needle!.match(swiftPattern))) {
    return addError(v, { id, message, extra })
  }
  return false
}

export const checkIfNotValidIban = (v: Validation, {
  needle, id, message, extra
}: ValidateValueParams): boolean => {
  const ibanPattern = /^[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[a-zA-Z0-9]{7}([a-zA-Z0-9]?){0,16}$/
  const ibanPatternNO = /^[a-zA-Z]{2}[0-9]{13}$/
  if (!_.isEmpty(needle) && !(needle!.match(needle.substring(0,2).toUpperCase() === "NO" ? ibanPatternNO : ibanPattern))) {
    return addError(v, { id, message, extra })
  }
  return false
}

export const checkIfNotValidLand = (v: Validation, {
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

export const checkIfGB = (v: Validation, {
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
