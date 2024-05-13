import {PIN} from "../../../declarations/p2000";
import { Validation} from 'src/declarations/app'
import { getIdx } from 'src/utils/namespace'
import { checkIfDuplicate, checkIfNotEmpty, checkIfNotGB, checkIfValidLand } from 'src/utils/validation'

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
    message: 'validation:noId'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: pin?.land,
    id: namespace + idx + '-land',
    message: 'validation:noLand'
  }))

  hasErrors.push(checkIfValidLand(v, {
    needle: pin?.land,
    id: namespace + idx + '-land',
    message: 'validation:invalidLand'
  }))

  hasErrors.push(checkIfNotGB(v, {
    needle: pin?.land,
    id: namespace + idx + '-land',
    message: 'validation:invalidLand'
  }))

  hasErrors.push(checkIfDuplicate(v, {
    needle: pin?.land,
    haystack: utenlandskePINs,
    matchFn: (_pin: PIN) => _pin.land === pin?.land,
    index,
    id: namespace + idx + '-land',
    message: 'validation:duplicateLand',
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
