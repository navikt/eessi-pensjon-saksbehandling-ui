import {Validation} from "src/declarations/app";
import {P12000SED} from "src/declarations/p12000";
import performValidation from "src/utils/performValidation";
import {validatePerson, ValidationPersonProps} from "src/components/PersonOpplysninger/validation";
import {validateUtenlandskePINs, ValidationUtenlandskePINsProps} from "src/components/UtenlandskePin/validation";
import {validateInformasjonOmPensjon, ValidationInformasjonOmPensjonProps} from "./InformasjonOmPensjon/validation";
import _ from "lodash";

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
  const informasjonOmPensjonNamespace = `${namespace}-informasjonompensjon`
  const gjenlevendeNamespace = `${namespace}-mottakeravgjenlevendepensjon`

  hasErrors.push(performValidation<ValidationInformasjonOmPensjonProps>(v, informasjonOmPensjonNamespace, validateInformasjonOmPensjon, {
    pensjoninfo: P12000SED?.pensjon?.pensjoninfo
  }, true))

  hasErrors.push(performValidation<ValidationPersonProps>(v, gjenlevendeNamespace, validatePerson, {
    person: P12000SED?.pensjon?.gjenlevende?.person,
    requiredIfAnyFilled: true
  }, true))

  hasErrors.push(performValidation<ValidationUtenlandskePINsProps>(v, `${gjenlevendeNamespace}-pin`, validateUtenlandskePINs, {
    utenlandskePINs: _.filter(P12000SED?.pensjon?.gjenlevende?.person?.pin, p => p.land !== 'NO')
  }, true))

  return hasErrors.find(value => value) !== undefined
}
