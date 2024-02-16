import {Validation} from "declarations/app";
import { checkIfNotEmpty } from 'utils/validation'
import {Sivilstand} from "declarations/p2000";
import {getIdx} from "../../../utils/namespace";

export interface ValidationFamilieStatusProps {
  sivilstand: Sivilstand | undefined
  index?: number
}

export const validateFamilieStatus = (
  v: Validation,
  namespace: string | undefined,
  {
    sivilstand,
    index
  }: ValidationFamilieStatusProps,
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sivilstand?.status,
    id: namespace + idx + '-status',
    message: 'validation:missing-p2000-forsikret-person-sivilstand-status'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sivilstand?.fradato,
    id: namespace + idx +  '-fradato',
    message: 'validation:missing-p2000-forsikret-person-sivilstand-fradato'
  }))

  return hasErrors.find(value => value) !== undefined
}
