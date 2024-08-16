import {PIN} from "../../../declarations/p2000";
import { Validation} from 'declarations/app'
import { getIdx } from 'utils/namespace'
import {checkIfDuplicate, checkIfNotEmpty, checkIfNotGB, checkIfValidLand, checkLength} from 'utils/validation'

export interface ValidationUtenlandskPINProps {
  pin: PIN | null | undefined
  utenlandskePINs: Array<PIN> | undefined
  index ?: number
}

export interface ValidationUtenlandskePINsProps {
  utenlandskePINs: Array<PIN> | undefined
}

export const validateUtenlandskPIN = (
  v: Validation,
  namespace: string | undefined,
  {
    pin,
    utenlandskePINs,
    index
  }: ValidationUtenlandskPINProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: pin?.identifikator,
    id: namespace + idx + '-identifikator',
    message: 'validation:missing-p2000-utenlandskepin-id'
  }))

  hasErrors.push(checkLength(v, {
    needle: pin?.identifikator,
    id: namespace + idx + '-identifikator',
    max: 65,
    message: 'validation:textOverX'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: pin?.land,
    id: namespace + idx + '-land',
    message: 'validation:missing-p2000-utenlandskepin-land'
  }))

  hasErrors.push(checkIfValidLand(v, {
    needle: pin?.land,
    id: namespace + idx + '-land',
    message: 'validation:invalid-p2000-utenlandskepin-land'
  }))

  hasErrors.push(checkIfNotGB(v, {
    needle: pin?.land,
    id: namespace + idx + '-land',
    message: 'validation:invalid-p2000-utenlandskepin-land'
  }))

  hasErrors.push(checkIfDuplicate(v, {
    needle: pin?.land,
    haystack: utenlandskePINs,
    matchFn: (_pin: PIN) => _pin.land === pin?.land,
    index,
    id: namespace + idx + '-land',
    message: 'validation:duplicate-p2000-utenlandskepin-land',
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateUtenlandskePINs = (
  v: Validation,
  namespace: string,
  {
    utenlandskePINs,
  }: ValidationUtenlandskePINsProps
): boolean => {
  const hasErrors: Array<boolean> = utenlandskePINs?.map((pin: PIN, index: number) => {
    return validateUtenlandskPIN(v, namespace, {
      index,
      pin,
      utenlandskePINs,
    })
  }) ?? []
  return hasErrors.find(value => value) !== undefined
}
