import {Validation} from "src/declarations/app";
import {checkIfNotEmpty, checkIfNotTelephoneNumber} from 'src/utils/validation'
import {Telefon} from "src/declarations/p2000";
import {getIdx} from "../../../utils/namespace";

export interface ValidationTelefonProps {
  telefon: Telefon | undefined
  index?: number
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

  hasErrors.push(checkIfNotEmpty(v, {
    needle: telefon?.nummer,
    id: namespace + idx + '-nummer',
    message: 'validation:missing-p2000-telefon-nummer'
  }))

  hasErrors.push(checkIfNotTelephoneNumber(v, {
    needle: telefon?.nummer,
    id: namespace + idx + '-nummer',
    message: 'validation:invalid-p2000-telefon-nummer'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: telefon?.type,
    id: namespace + idx +  '-type',
    message: 'validation:missing-p2000-telefon-type'
  }))

  return hasErrors.find(value => value) !== undefined
}
