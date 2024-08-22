import {Validation} from "declarations/app";
import {checkIfNotEmpty, checkLength} from 'utils/validation'
import {Verge} from "declarations/p2000";
import _ from "lodash";
import {validateAdresse, ValidationAdresseProps} from "../Adresse/validation";
import performValidation from "../../../utils/performValidation";

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
    hasErrors.push(performValidation<ValidationAdresseProps>(v, namespace, validateAdresse, {
      adresse: verge?.adresse
    }, true))

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

    hasErrors.push(checkLength(v, {
      needle: verge?.person?.etternavn,
      id: namespace + '-person-etternavn',
      max: 155,
      message: 'validation:textOverX'
    }))

    hasErrors.push(checkLength(v, {
      needle: verge?.person?.fornavn,
      id: namespace + '-person-fornavn',
      max: 155,
      message: 'validation:textOverX'
    }))

    hasErrors.push(checkLength(v, {
      needle: verge?.vergemaal?.mandat,
      id: namespace + '-vergemaal-mandat',
      max: 255,
      message: 'validation:textOverX'
    }))
  }


  return hasErrors.find(value => value) !== undefined
}
