import {Validation} from "../../declarations/app";
import {P2000SED} from "../../declarations/p2000";
import performValidation from "../../utils/performValidation";
import {ValidationVergeProps, validateVerge} from "./Verge/validation";
import {validateDiverse, ValidationDiverseProps} from "./Diverse/validation";
import {validateEktefelle, ValidationEktefelleProps} from "./Ektefelle/validation";
import {validateBank, ValidationBankProps} from "./InformasjonOmBetaling/validation";


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

  hasErrors.push(performValidation<ValidationEktefelleProps>(v, `p2000-ektefelle`, validateEktefelle, {
    ektefelle: P2000SED.nav.ektefelle
  }, true))

  hasErrors.push(performValidation<ValidationVergeProps>(v, `p2000-verge`, validateVerge, {
    verge: P2000SED.nav.verge
  }, true))

  let sepaIkkeSepa = undefined
  if(P2000SED.nav.bruker.bank?.konto?.sepa){
    sepaIkkeSepa = "sepa"
  } else if(P2000SED.nav.bruker.bank?.konto?.kontonr || P2000SED.nav.bruker.bank?.konto?.ikkesepa){
    sepaIkkeSepa = "ikkesepa"
  }
  hasErrors.push(performValidation<ValidationBankProps>(v, `p2000-informasjonombetaling`, validateBank, {
    bank: P2000SED.nav.bruker.bank,
    sepaIkkeSepa: sepaIkkeSepa
  }, true))


  hasErrors.push(performValidation<ValidationDiverseProps>(v, `p2000-diverse-pensjon`, validateDiverse, {
    pensjon: P2000SED.pensjon
  }, true))

  return hasErrors.find(value => value) !== undefined
}
