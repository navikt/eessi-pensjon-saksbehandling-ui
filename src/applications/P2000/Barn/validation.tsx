import {Validation} from "../../../declarations/app";
import {getIdx} from "../../../utils/namespace";
import {checkIfNotEmpty} from "../../../utils/validation";
import {Barn} from "../../../declarations/p2000";
import _ from "lodash";
import performValidation from "../../../utils/performValidation";
import {validateFoedested, ValidationFoedestedProps} from "../Foedested/validation";

export interface ValidationBarnArrayProps {
  barnArray: Array<Barn> | undefined
}

export interface ValidationBarnProps {
  barn: Barn | null | undefined
  index ?: number
}

export const validateBarn = (
  v: Validation,
  namespace: string | undefined,
  {
    barn,
    index
  }: ValidationBarnProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: barn?.person?.etternavn,
    id: namespace + idx + '-person-etternavn',
    message: 'validation:missing-p2000-person-etternavn'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: barn?.person?.fornavn,
    id: namespace + idx + '-person-fornavn',
    message: 'validation:missing-p2000-person-fornavn'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: barn?.person?.foedselsdato,
    id: namespace + idx + '-person-foedselsdato',
    message: 'validation:missing-p2000-person-foedselsdato'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: barn?.person?.kjoenn,
    id: namespace + idx + '-person-kjoenn',
    message: 'validation:missing-p2000-person-kjoenn'
  }))

  if(!_.isEmpty(barn?.person?.foedested)){
    hasErrors.push(performValidation<ValidationFoedestedProps>(v, namespace + idx + '-person-foedested', validateFoedested, {
      foedested: barn?.person?.foedested
    }, true))
  }


  return hasErrors.find(value => value) !== undefined
}

export const validateBarnArray = (
  v: Validation,
  namespace: string,
  {
    barnArray,
  }: ValidationBarnArrayProps
): boolean => {
  const hasErrors: Array<boolean> = []

  console.log(v, namespace, barnArray)

  return hasErrors.find(value => value) !== undefined
}
