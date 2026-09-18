import {Validation} from "src/declarations/app";
import {P12000SED} from "src/declarations/p12000";

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

  return hasErrors.find(value => value) !== undefined
}
