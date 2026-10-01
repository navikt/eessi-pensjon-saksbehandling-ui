import {Validation} from "src/declarations/app";
import {checkIfEmpty, checkIfTooLong, checkIfNotValidDateFormat} from "src/utils/validation";
import {Person} from "src/declarations/sed";
import _ from "lodash";

export interface ValidationPersonProps {
  person: Person | undefined
  /**
   * When true, etternavn/fornavn/foedselsdato/kjoenn are only mandatory if at
   * least one of them has a value. When false or omitted they are always mandatory.
   */
  requiredIfAnyFilled?: boolean
}

export const validatePerson = (
  v: Validation,
  namespace: string,
  {
    person,
    requiredIfAnyFilled
  }: ValidationPersonProps
): boolean => {
  const hasErrors: Array<boolean> = []

  const anyFilled: boolean = [person?.etternavn, person?.fornavn, person?.foedselsdato, person?.kjoenn]
    .some((value) => !_.isEmpty(_.isString(value) ? value.trim() : value))
  const required: boolean = requiredIfAnyFilled !== true || anyFilled

  if(required){
    hasErrors.push(checkIfEmpty(v, {
      needle: person?.etternavn,
      id: namespace + '-person-etternavn',
      message: 'validation:missing-person-etternavn'
    }))

    hasErrors.push(checkIfEmpty(v, {
      needle: person?.fornavn,
      id: namespace + '-person-fornavn',
      message: 'validation:missing-person-fornavn'
    }))

    hasErrors.push(checkIfEmpty(v, {
      needle: person?.foedselsdato,
      id: namespace + '-person-foedselsdato',
      message: 'validation:missing-person-foedselsdato'
    }))

    hasErrors.push(checkIfEmpty(v, {
      needle: person?.kjoenn,
      id: namespace + '-person-kjoenn',
      message: 'validation:missing-person-kjoenn'
    }))
  }

  hasErrors.push(checkIfTooLong(v, {
    needle: person?.etternavn,
    id: namespace + '-person-etternavn',
    max: 155,
    message: 'validation:textOverX'
  }))

  hasErrors.push(checkIfTooLong(v, {
    needle: person?.fornavn,
    id: namespace + '-person-fornavn',
    max: 155,
    message: 'validation:textOverX'
  }))

  hasErrors.push(checkIfNotValidDateFormat(v, {
    needle: person?.foedselsdato,
    id: namespace + '-person-foedselsdato',
    message: 'validation:invalidDateFormat',
  }))

  return hasErrors.find(value => value) !== undefined
}
