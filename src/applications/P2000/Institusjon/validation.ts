import {Validation} from "declarations/app";
import { checkIfNotEmpty } from 'utils/validation'
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

  hasErrors.push(checkIfNotEmpty(v, {
    needle: institusjon,
    id: namespace + idx,
    message: 'validation:missing-p2000-pensjon-institusjonennaaikkesoektompensjon'
  }))

  return hasErrors.find(value => value) !== undefined
}
