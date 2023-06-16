import {Validation} from "declarations/app";
import { checkIfNotEmpty } from 'utils/validation'
import {Verge} from "declarations/p2000";


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

  hasErrors.push(checkIfNotEmpty(v, {
    needle: verge.person.etternavn,
    id: namespace + '-person-etternavn',
    message: 'validation:verge-no-etternavn'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: verge.person.fornavn,
    id: namespace + '-person-fornavn',
    message: 'validation:verge-no-fornavn'
  }))

  return hasErrors.find(value => value) !== undefined
}
