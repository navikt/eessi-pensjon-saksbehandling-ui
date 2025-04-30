import { Validation} from 'src/declarations/app'
import { getIdx } from 'src/utils/namespace'
import {checkIfDuplicate, checkIfEmpty, checkIfGB, checkIfTooLong} from 'src/utils/validation'
import {Eessisak} from "src/declarations/sed";

export interface ValidationUtenlandskSaksnrProps {
  eessisak: Eessisak | null | undefined
  utenlandskeSaksnr: Array<Eessisak> | undefined
  index ?: number
}

export interface ValidationUtenlandskeSaksnrProps {
  utenlandskeSaksnr: Array<Eessisak> | undefined
}

export const validateUtenlandskSaksnr = (
  v: Validation,
  namespace: string | undefined,
  {
    eessisak,
    utenlandskeSaksnr,
    index
  }: ValidationUtenlandskSaksnrProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfEmpty(v, {
    needle: eessisak?.saksnummer,
    id: namespace + idx + '-saksnummer',
    message: 'validation:missing-utenlandskesaksnr-saksnr'
  }))

  hasErrors.push(checkIfTooLong(v, {
    needle: eessisak?.saksnummer,
    id: namespace + idx + '-saksnummer',
    max: 65,
    message: 'validation:textOverX'
  }))

  hasErrors.push(checkIfEmpty(v, {
    needle: eessisak?.land,
    id: namespace + idx + '-land',
    message: 'validation:missing-utenlandskesaksnr-land'
  }))

  hasErrors.push(checkIfGB(v, {
    needle: eessisak?.land,
    id: namespace + idx + '-land',
    message: 'validation:invalid-utenlandskesaksnr-land'
  }))

  hasErrors.push(checkIfDuplicate(v, {
    needle: eessisak?.land,
    haystack: utenlandskeSaksnr,
    matchFn: (_eessisak: Eessisak) => _eessisak.land === eessisak?.land,
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
    utenlandskeSaksnr,
  }: ValidationUtenlandskeSaksnrProps
): boolean => {

  const hasErrors: Array<boolean> = utenlandskeSaksnr?.map((eessisak: Eessisak, index: number) => {
    return validateUtenlandskSaksnr(v, namespace, {
      index,
      eessisak: eessisak,
      utenlandskeSaksnr: utenlandskeSaksnr,
    })
  }) ?? []

  return hasErrors.find(value => value) !== undefined
}
