import {Validation} from "../../declarations/app";
import {P2000SED} from "../../declarations/p2000";
import _ from "lodash";


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

  if (!_.isEmpty(P2000SED.nav.verge)) {

  }

  return hasErrors.find(value => value) !== undefined
}
