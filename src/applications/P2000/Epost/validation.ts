import {Validation} from "declarations/app";
import {checkIfNotEmail, checkIfNotEmpty} from 'utils/validation'
import {Email} from "declarations/p2000";
import {getIdx} from "../../../utils/namespace";

export interface ValidationEpostProps {
  epost: Email | undefined
  index?: number
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
