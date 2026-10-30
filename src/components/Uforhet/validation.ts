import {Validation} from "src/declarations/app";
import {checkIfEmpty} from "src/utils/validation";
import {Uforhet} from "src/declarations/p2200";

export interface ValidationUforhetProps {
  uforhet: Uforhet | undefined
}

export const validateUforhet = (
  v: Validation,
  namespace: string,
  {
    uforhet
  }: ValidationUforhetProps
): boolean => {
  const hasErrors: Array<boolean> = []

    hasErrors.push(checkIfEmpty(v, {
      needle: uforhet?.arbeidsUlykke,
      id: namespace + '-arbeidsUlykke',
      message: 'validation:missing-p2000-uforhet-arbeidsUlykke'
    }))

  hasErrors.push(checkIfEmpty(v, {
    needle: uforhet?.militartjenesteUlykke,
    id: namespace + '-militartjenesteUlykke',
    message: 'validation:missing-p2000-uforhet-militartjenesteUlykke'
  }))

  hasErrors.push(checkIfEmpty(v, {
    needle: uforhet?.bevisstforsaketSoker,
    id: namespace + '-bevisstforsaketSoker',
    message: 'validation:missing-p2000-uforhet-bevisstforsaketSoker'
  }))

  hasErrors.push(checkIfEmpty(v, {
    needle: uforhet?.ansvarligTredjepart,
    id: namespace + '-ansvarligTredjepart',
    message: 'validation:missing-p2000-uforhet-ansvarligTredjepart'
  }))

  return hasErrors.find(value => value) !== undefined
}
