import {Validation} from "../../../declarations/app";
import {getIdx} from "../../../utils/namespace";
import {Barn} from "../../../declarations/p2000";
import _ from "lodash";
import performValidation from "../../../utils/performValidation";
import {validateFoedested, ValidationFoedestedProps} from "../Foedested/validation";
import {validatePerson, ValidationPersonProps} from "../PersonOpplysninger/validation";

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

  hasErrors.push(performValidation<ValidationPersonProps>(v, namespace + idx, validatePerson, {
    person: barn?.person
  }, true))


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
