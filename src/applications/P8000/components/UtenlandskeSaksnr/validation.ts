import { Validation} from 'src/declarations/app'
import { getIdx } from 'src/utils/namespace'
import {checkIfDuplicate, checkIfNotEmpty, checkIfNotGB, checkLength} from 'src/utils/validation'
import {PIN} from "src/declarations/sed";

export interface ValidationUtenlandskSaksnrProps {
  pin: PIN | null | undefined
  utenlandskePINs: Array<PIN> | undefined
  index ?: number
}

export interface ValidationUtenlandskeSaksnrProps {
  utenlandskePINs: Array<PIN> | undefined
}

export const validateUtenlandskSaksnr = (
  v: Validation,
  namespace: string | undefined,
  {
    pin,
    utenlandskePINs,
    index
  }: ValidationUtenlandskSaksnrProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: pin?.identifikator,
    id: namespace + idx + '-identifikator',
    message: 'validation:missing-utenlandskesaksnr-saksnr'
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
    message: 'validation:missing-utenlandskesaksnr-land'
  }))

  hasErrors.push(checkIfNotGB(v, {
    needle: pin?.land,
    id: namespace + idx + '-land',
    message: 'validation:invalid-utenlandskesaksnr-land'
  }))

  hasErrors.push(checkIfDuplicate(v, {
    needle: pin?.land,
    haystack: utenlandskePINs,
    matchFn: (_pin: PIN) => _pin.land === pin?.land,
    index,
    id: namespace + idx + '-land',
    message: 'validation:duplicate-utenlandskesaksnr-land',
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateUtenlandskeSaksnr = (
  v: Validation,
  namespace: string,
  {
    utenlandskePINs,
  }: ValidationUtenlandskeSaksnrProps
): boolean => {

  const hasErrors: Array<boolean> = utenlandskePINs?.map((pin: PIN, index: number) => {
    return validateUtenlandskSaksnr(v, namespace, {
      index,
      pin,
      utenlandskePINs,
    })
  }) ?? []

  return hasErrors.find(value => value) !== undefined
}
