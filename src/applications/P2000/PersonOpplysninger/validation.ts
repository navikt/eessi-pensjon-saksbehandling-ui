import {Validation} from "src/declarations/app";
import {Person} from "src/declarations/p2000";
import {checkIfNotEmpty, checkLength, checkValidDateFormat} from "src/utils/validation";

export interface ValidationPersonProps {
  person: Person | undefined
}

export const validatePerson = (
  v: Validation,
  namespace: string,
  {
    person
  }: ValidationPersonProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: person?.etternavn,
    id: namespace + '-person-etternavn',
    message: 'validation:missing-p2000-person-etternavn'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: person?.fornavn,
    id: namespace + '-person-fornavn',
    message: 'validation:missing-p2000-person-fornavn'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: person?.foedselsdato,
    id: namespace + '-person-foedselsdato',
    message: 'validation:missing-p2000-person-foedselsdato'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: person?.kjoenn,
    id: namespace + '-person-kjoenn',
    message: 'validation:missing-p2000-person-kjoenn'
  }))

  hasErrors.push(checkLength(v, {
    needle: person?.etternavn,
    id: namespace + '-person-etternavn',
    max: 155,
    message: 'validation:textOverX'
  }))

  hasErrors.push(checkLength(v, {
    needle: person?.fornavn,
    id: namespace + '-person-fornavn',
    max: 155,
    message: 'validation:textOverX'
  }))

  hasErrors.push(checkValidDateFormat(v, {
    needle: person?.foedselsdato,
    id: namespace + '-person-foedselsdato',
    message: 'validation:invalidDateFormat',
  }))

  return hasErrors.find(value => value) !== undefined
}
