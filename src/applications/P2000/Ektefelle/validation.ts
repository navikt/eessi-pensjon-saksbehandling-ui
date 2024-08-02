import {Validation} from "declarations/app";
import {Ektefelle} from "../../../declarations/p2000";
import {checkIfNotEmpty} from "../../../utils/validation";
import _ from "lodash";
import performValidation from "../../../utils/performValidation";
import {validateFoedested, ValidationFoedestedProps} from "../Foedested/validation";



export interface ValidationEktefelleProps {
  ektefelle: Ektefelle | undefined
}

export const validateEktefelle = (
  v: Validation,
  namespace: string,
  {
    ektefelle
  }: ValidationEktefelleProps
): boolean => {
  const hasErrors: Array<boolean> = []

  if(ektefelle?.type){
    hasErrors.push(checkIfNotEmpty(v, {
      needle: ektefelle?.person.etternavn,
      id: namespace + '-person-etternavn',
      message: 'validation:missing-p2000-person-etternavn'
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: ektefelle?.person.fornavn,
      id: namespace + '-person-fornavn',
      message: 'validation:missing-p2000-person-fornavn'
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: ektefelle?.person.foedselsdato,
      id: namespace + '-person-foedselsdato',
      message: 'validation:missing-p2000-person-foedselsdato'
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: ektefelle?.person.kjoenn,
      id: namespace + '-person-kjoenn',
      message: 'validation:missing-p2000-person-kjoenn'
    }))
  }

  if(!_.isEmpty(ektefelle?.person.foedested)){
    hasErrors.push(performValidation<ValidationFoedestedProps>(v, namespace + '-person-foedested', validateFoedested, {
      foedested: ektefelle?.person.foedested
    }, true))
  }

  return hasErrors.find(value => value) !== undefined
}
