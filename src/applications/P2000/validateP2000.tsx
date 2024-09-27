import {Validation} from "src/declarations/app";
import {P2000SED} from "src/declarations/p2000";
import performValidation from "../../utils/performValidation";
import {ValidationVergeProps, validateVerge} from "./Verge/validation";
import {validateDiverse, ValidationDiverseProps} from "./Diverse/validation";
import {validateEktefelle, ValidationEktefelleProps} from "./Ektefelle/validation";
import {validateBank, ValidationBankProps} from "./InformasjonOmBetaling/validation";
import {validateBarnArray, ValidationBarnArrayProps} from "src/applications/P2000/Barn/validation";
import {validateYtelser, ValidationYtelserProps} from "src/applications/P2000/Ytelser/validation";
import {validateYrkesaktivitet, ValidationYrkesaktivitetProps} from "src/applications/P2000/Yrkesaktivitet/validation";
import {
  validateForsikretPerson,
  ValidationForsikretPersonProps
} from "src/applications/P2000/ForsikretPerson/validation";


export interface ValidationP2000Props {
  P2000SED: P2000SED
}


export const validateP2000 = (
  v: Validation,
  namespace: string,
  {
    P2000SED
  }: ValidationP2000Props
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(performValidation<ValidationForsikretPersonProps>(v, `p2000-forsikretperson`, validateForsikretPerson, {
    forsikretPerson: P2000SED.nav?.bruker?.person
  }, true))

  hasErrors.push(performValidation<ValidationYrkesaktivitetProps>(v, `p2000-yrkesaktivitet`, validateYrkesaktivitet, {
    arbeidsforholdArray: P2000SED.pensjon?.bruker?.arbeidsforhold
  }, true))

  hasErrors.push(performValidation<ValidationYtelserProps>(v, `p2000-ytelser`, validateYtelser, {
    ytelser: P2000SED.pensjon?.ytelser
  }, true))

  hasErrors.push(performValidation<ValidationEktefelleProps>(v, `p2000-ektefelle`, validateEktefelle, {
    ektefelle: P2000SED.nav?.ektefelle
  }, true))

  hasErrors.push(performValidation<ValidationBarnArrayProps>(v, `p2000-barn`, validateBarnArray, {
    barnArray: P2000SED.nav?.barn
  }, true))

  hasErrors.push(performValidation<ValidationVergeProps>(v, `p2000-verge`, validateVerge, {
    verge: P2000SED.nav?.verge
  }, true))

  let sepaIkkeSepa = undefined
  if(P2000SED.nav?.bruker?.bank?.konto?.sepa){
    sepaIkkeSepa = "sepa"
  } else if(P2000SED.nav.bruker.bank?.konto?.kontonr || P2000SED.nav.bruker.bank?.konto?.ikkesepa){
    sepaIkkeSepa = "ikkesepa"
  }
  hasErrors.push(performValidation<ValidationBankProps>(v, `p2000-informasjonombetaling`, validateBank, {
    bank: P2000SED.nav?.bruker?.bank,
    sepaIkkeSepa: sepaIkkeSepa
  }, true))


  hasErrors.push(performValidation<ValidationDiverseProps>(v, `p2000-diverse-pensjon`, validateDiverse, {
    pensjon: P2000SED.pensjon
  }, true))

  //console.log(v)

  return hasErrors.find(value => value) !== undefined
}
