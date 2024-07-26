import {Validation} from "../../declarations/app";
import {P2000SED} from "../../declarations/p2000";
import performValidation from "../../utils/performValidation";
import {ValidationVergeProps, validateVerge} from "./Verge/validation";
import {validateDiverse, ValidationDiverseProps} from "./Diverse/validation";


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

  hasErrors.push(performValidation<ValidationVergeProps>(v, `p2000-verge`, validateVerge, {
    verge: P2000SED.nav.verge
  }, true))

  hasErrors.push(performValidation<ValidationDiverseProps>(v, `p2000-diverse-pensjon`, validateDiverse, {
    pensjon: P2000SED.pensjon
  }, true))

  return hasErrors.find(value => value) !== undefined
}
