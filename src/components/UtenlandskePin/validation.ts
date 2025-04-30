import { Validation} from 'src/declarations/app'
import { getIdx } from 'src/utils/namespace'
import {checkIfDuplicate, checkIfEmpty, checkIfGB, checkIfTooLong} from 'src/utils/validation'
import {PIN} from "src/declarations/sed";

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

  hasErrors.push(checkIfEmpty(v, {
    needle: pin?.identifikator,
    id: namespace + idx + '-identifikator',
    message: 'validation:missing-utenlandskepin-id'
  }))

  hasErrors.push(checkIfTooLong(v, {
    needle: pin?.identifikator,
    id: namespace + idx + '-identifikator',
    max: 65,
    message: 'validation:textOverX'
  }))

  hasErrors.push(checkIfEmpty(v, {
    needle: pin?.land,
    id: namespace + idx + '-land',
    message: 'validation:missing-utenlandskepin-land'
  }))

  hasErrors.push(checkIfGB(v, {
    needle: pin?.land,
    id: namespace + idx + '-land',
    message: 'validation:invalid-utenlandskepin-land'
  }))

  hasErrors.push(checkIfDuplicate(v, {
    needle: pin?.land,
    haystack: utenlandskePINs,
    matchFn: (_pin: PIN) => _pin.land === pin?.land,
    index,
    id: namespace + idx + '-land',
    message: 'validation:duplicate-utenlandskepin-land',
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
