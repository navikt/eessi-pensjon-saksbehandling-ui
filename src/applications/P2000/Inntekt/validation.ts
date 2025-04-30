import {Validation} from "src/declarations/app";
import {getIdx} from "../../../utils/namespace";
import {Inntekt} from "../../../declarations/p2000";
import {checkIfNotEmpty, checkIfNotValidBeloep, checkIfNotValidDateFormat} from "../../../utils/validation";

export interface ValidationInntektProps {
  inntekt: Inntekt | undefined
  index?: number
}

export const validateInntekt = (
  v: Validation,
  namespace: string | undefined,
  {
    inntekt,
    index
  }: ValidationInntektProps,
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: inntekt?.beloep,
    id: namespace + idx + '-beloep',
    message: 'validation:missing-p2000-arbeidsforhold-inntekt-belop'
  }))

  hasErrors.push(checkIfNotValidBeloep(v, {
    needle: inntekt?.beloep,
    id: namespace + idx + '-beloep',
    message: 'validation:invalid-p2000-beloep'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: inntekt?.valuta,
    id: namespace + idx + '-valuta',
    message: 'validation:missing-p2000-arbeidsforhold-inntekt-valuta'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: inntekt?.beloeputbetaltsiden,
    id: namespace + idx + '-beloeputbetaltsiden',
    message: 'validation:missing-p2000-arbeidsforhold-inntekt-beloeputbetaltsiden'
  }))

  hasErrors.push(checkIfNotValidDateFormat(v, {
    needle: inntekt?.beloeputbetaltsiden,
    id: namespace + idx + '-beloeputbetaltsiden',
    message: 'validation:invalidDateFormat',
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: inntekt?.betalingshyppighetinntekt,
    id: namespace + idx + '-betalingshyppighetinntekt',
    message: 'validation:missing-p2000-arbeidsforhold-inntekt-betalingshyppighetinntekt'
  }))

  return hasErrors.find(value => value) !== undefined
}
