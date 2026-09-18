import {Validation} from "src/declarations/app";
import {P12000SED} from "src/declarations/p12000";
import performValidation from "src/utils/performValidation";
import {validatePerson, ValidationPersonProps} from "src/components/PersonOpplysninger/validation";

export interface ValidationP12000Props {
  P12000SED: P12000SED
}

export const validateP12000 = (
  v: Validation,
  namespace: string,
  {
    P12000SED
  }: ValidationP12000Props
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(performValidation<ValidationPersonProps>(v, `${namespace}-mottakeravgjenlevendepensjon`, validatePerson, {
    person: P12000SED?.pensjon?.gjenlevende?.person,
    requiredIfAnyFilled: true
  }, true))

  return hasErrors.find(value => value) !== undefined
}
