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

  if(namespace === "DUMMY"){
    hasErrors.push(checkIfNotEmpty(v, {
      needle: verge?.person?.etternavn,
      id: namespace + '-person-etternavn',
      message: 'validation:missing-p2000-verge-person-etternavn'
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
