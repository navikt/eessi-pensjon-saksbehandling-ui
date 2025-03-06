import {Validation} from "src/declarations/app";
import _ from "lodash";
import performValidation from "../../../utils/performValidation";
import {validateFoedested, ValidationFoedestedProps} from "../Foedested/validation";
import {validatePerson, ValidationPersonProps} from "../PersonOpplysninger/validation";
import {addError} from "src/utils/validation";
import {Ektefelle, Person} from "src/declarations/sed";



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

  if(ektefelle?.person && Object.keys(ektefelle.person).every(key => ektefelle.person[key as keyof Person] !== undefined) && !_.isEmpty(ektefelle.person)){
    hasErrors.push(performValidation<ValidationPersonProps>(v, namespace, validatePerson, {
      person: ektefelle?.person
    }, true))

    if(!ektefelle?.type) {
      hasErrors.push(addError(v, {
        id: namespace + '-type',
        message: 'validation:missing-p2000-ektefelle-type',
      }))
    }
  }

  if(ektefelle?.type){
    hasErrors.push(performValidation<ValidationPersonProps>(v, namespace, validatePerson, {
      person: ektefelle?.person
    }, true))
  }

  if(!_.isEmpty(ektefelle?.person?.foedested)){
    hasErrors.push(performValidation<ValidationFoedestedProps>(v, namespace + '-person-foedested', validateFoedested, {
      foedested: ektefelle?.person.foedested
    }, true))
  }

  return hasErrors.find(value => value) !== undefined
}
