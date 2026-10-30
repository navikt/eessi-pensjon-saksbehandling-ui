import {Validation} from "src/declarations/app";
import {checkIfEmpty, checkIfNotTelephoneNumber} from 'src/utils/validation'
import {getIdx} from "src/utils/namespace";
import {Telefon} from "src/declarations/sed";


export interface ValidationTelefonProps {
  telefon: Telefon | undefined
  index?: number
}

export interface ValidationTelefonNumreProps {
  telefonNumre: Array<Telefon> | undefined
}

export const validateTelefon = (
  v: Validation,
  namespace: string | undefined,
  {
    telefon,
    index
  }: ValidationTelefonProps,
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfEmpty(v, {
    needle: telefon?.nummer,
    id: namespace + idx + '-nummer',
    message: 'validation:missing-p2000-telefon-nummer'
  }))

  hasErrors.push(checkIfNotTelephoneNumber(v, {
    needle: telefon?.nummer,
    id: namespace + idx + '-nummer',
    message: 'validation:invalid-p2000-telefon-nummer'
  }))

  hasErrors.push(checkIfEmpty(v, {
    needle: telefon?.type,
    id: namespace + idx +  '-type',
    message: 'validation:missing-p2000-telefon-type'
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateTelefonNumre = (
  v: Validation,
  namespace: string,
  {
    telefonNumre,
  }: ValidationTelefonNumreProps
): boolean => {

  const hasErrors: Array<boolean> = telefonNumre?.map((telefon: Telefon, index: number) => {
    return validateTelefon(v, namespace, {
      telefon,
      index,
    })
  }) ?? []

  return hasErrors.find(value => value) !== undefined
}
