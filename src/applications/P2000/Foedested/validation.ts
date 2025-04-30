import {Validation} from "src/declarations/app";
import {checkIfNotEmpty, checkIfTooLong} from 'src/utils/validation'
import _ from "lodash";
import {Foedested} from "src/declarations/sed";

export interface ValidationFoedestedProps {
  foedested: Foedested | null | undefined,
}

export const validateFoedested = (
  v: Validation,
  namespace: string,
  {
    foedested,
  }: ValidationFoedestedProps
): boolean => {
  const hasErrors: Array<boolean> = []

  const emptyFoedsted: boolean = (
    _.isEmpty(foedested?.by?.trim()) &&
    _.isEmpty(foedested?.region?.trim()) &&
    _.isEmpty(foedested?.land?.trim())
  )

  if(!_.isEmpty(foedested) && !emptyFoedsted){
    hasErrors.push(checkIfNotEmpty(v, {
      needle: foedested?.by,
      id: namespace + '-by',
      message: 'validation:missing-p2000-person-foedested-by',
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: foedested?.land,
      id: namespace + '-land',
      message: 'validation:missing-p2000-person-foedested-land',
    }))

    hasErrors.push(checkIfTooLong(v, {
      needle: foedested?.by,
      id: namespace + '-by',
      max: 65,
      message: 'validation:textOverX'
    }))

    hasErrors.push(checkIfTooLong(v, {
      needle: foedested?.region,
      id: namespace + '-region',
      max: 65,
      message: 'validation:textOverX'
    }))

  }

  return hasErrors.find(value => value) !== undefined
}
