import {Validation} from "src/declarations/app";
import {checkIfEmpty, checkIfNotValidDateFormat} from 'src/utils/validation'
import {getIdx} from "src/utils/namespace";
import {Sivilstand} from "src/declarations/sed";

export interface ValidationFamilieStatusArrayProps {
  sivilstandArray: Array<Sivilstand> | undefined
}

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

  hasErrors.push(checkIfEmpty(v, {
    needle: sivilstand?.status,
    id: namespace + idx + '-status',
    message: 'validation:missing-p2000-forsikret-person-sivilstand-status'
  }))

  hasErrors.push(checkIfEmpty(v, {
    needle: sivilstand?.fradato,
    id: namespace + idx +  '-fradato',
    message: 'validation:missing-p2000-forsikret-person-sivilstand-fradato'
  }))

  hasErrors.push(checkIfNotValidDateFormat(v, {
    needle: sivilstand?.fradato,
    id: namespace + idx + '-fradato',
    message: 'validation:invalidDateFormat',
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateFamilieStatusArray = (
  v: Validation,
  namespace: string,
  {
    sivilstandArray,
  }: ValidationFamilieStatusArrayProps
): boolean => {

  const hasErrors: Array<boolean> = sivilstandArray?.map((sivilstand: Sivilstand, index: number) => {
    return validateFamilieStatus(v, namespace, {
      index,
      sivilstand,
    })
  }) ?? []

  return hasErrors.find(value => value) !== undefined
}
