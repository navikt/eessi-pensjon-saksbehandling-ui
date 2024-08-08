import {Validation} from "declarations/app";
import { checkIfNotEmpty } from 'utils/validation'
import {Verge} from "declarations/p2000";
import _ from "lodash";

export interface ValidationVergeProps {
  verge: Verge
}

export const validateVerge = (
  v: Validation,
  namespace: string,
  {
    verge
  }: ValidationVergeProps
): boolean => {
  const hasErrors: Array<boolean> = []

  if(!_.isEmpty(verge?.person?.etternavn) || !_.isEmpty(verge?.person?.fornavn)){
    hasErrors.push(checkIfNotEmpty(v, {
      needle: verge?.person?.etternavn,
      id: namespace + '-person-etternavn',
      message: 'validation:missing-p2000-verge-person-etternavn'
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: verge?.person?.fornavn,
      id: namespace + '-person-fornavn',
      message: 'validation:missing-p2000-verge-person-fornavn'
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: verge?.adresse?.gate,
      id: namespace + '-adresse-gate',
      message: 'validation:missing-p2000-verge-adresse-gate'
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: verge?.adresse?.postnummer,
      id: namespace + '-adresse-postnummer',
      message: 'validation:missing-p2000-verge-adresse-postnummer'
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: verge?.adresse?.by,
      id: namespace + '-adresse-by',
      message: 'validation:missing-p2000-verge-adresse-by'
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: verge?.adresse?.land,
      id: namespace + '-adresse-land',
      message: 'validation:missing-p2000-verge-adresse-land'
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
