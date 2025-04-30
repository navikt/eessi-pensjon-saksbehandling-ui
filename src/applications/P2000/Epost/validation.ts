import {Validation} from "src/declarations/app";
import {checkIfNotEmail, checkIfEmpty} from 'src/utils/validation'
import {getIdx} from "src/utils/namespace";
import {Email} from "src/declarations/sed";

export interface ValidationEpostProps {
  epost: Email | undefined
  index?: number
}

export interface ValidationEpostAdresserProps {
  epostAdresser: Array<Email> | undefined
}

export const validateEpost = (
  v: Validation,
  namespace: string | undefined,
  {
    epost,
    index
  }: ValidationEpostProps,
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfEmpty(v, {
    needle: epost?.adresse,
    id: namespace + idx + '-adresse',
    message: 'validation:missing-p2000-epost-adresse'
  }))

  hasErrors.push(checkIfNotEmail(v, {
    needle: epost?.adresse,
    id: namespace + idx + '-adresse',
    message: 'validation:invalid-p2000-epost-adresse'
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateEpostAdresser = (
  v: Validation,
  namespace: string,
  {
    epostAdresser,
  }: ValidationEpostAdresserProps
): boolean => {

  const hasErrors: Array<boolean> = epostAdresser?.map((epost: Email, index: number) => {
    return validateEpost(v , namespace, {
      epost,
      index,
    })
  }) ?? []

  return hasErrors.find(value => value) !== undefined
}
