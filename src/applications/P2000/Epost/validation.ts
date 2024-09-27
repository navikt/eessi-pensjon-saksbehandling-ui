import {Validation} from "src/declarations/app";
import {checkIfNotEmail, checkIfNotEmpty} from 'src/utils/validation'
import {Email} from "src/declarations/p2000";
import {getIdx} from "src/utils/namespace";

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

  hasErrors.push(checkIfNotEmpty(v, {
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
