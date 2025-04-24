import {Validation} from "src/declarations/app";
import {P8000SED} from "src/declarations/p8000";


export interface ValidationP8000Props {
  P8000SED: P8000SED
}

export const validateP8000 = (
  v: Validation,
  namespace: string,
  {
    P8000SED
  }: ValidationP8000Props
): boolean => {
  const hasErrors: Array<boolean> = []

  if(P8000SED.options?.ofteEtterspurtInformasjon.inntektFoerUfoerhetIUtlandet){

  }

  return hasErrors.find(value => value) !== undefined
}
