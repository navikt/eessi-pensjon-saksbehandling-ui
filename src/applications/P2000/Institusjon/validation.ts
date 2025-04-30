import {Validation} from "src/declarations/app";
import {checkIfEmpty, checkIfTooLong} from 'src/utils/validation'
import {getIdx} from "../../../utils/namespace";

export interface ValidationInstitusjonProps {
  institusjon: string | undefined
  index?: number
}

export const validateInstitusjon = (
  v: Validation,
  namespace: string | undefined,
  {
    institusjon,
    index
  }: ValidationInstitusjonProps,
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfEmpty(v, {
    needle: institusjon,
    id: namespace + idx,
    message: 'validation:missing-p2000-pensjon-institusjonennaaikkesoektompensjon'
  }))

  hasErrors.push(checkIfTooLong(v, {
    needle: institusjon,
    id: namespace + idx,
    max: 155,
    message: 'validation:textOverX'
  }))

  return hasErrors.find(value => value) !== undefined
}
