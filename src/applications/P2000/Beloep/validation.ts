import {Validation} from "declarations/app";
import {getIdx} from "../../../utils/namespace";
import {Beloep} from "../../../declarations/p2000";
import {checkIfNotEmpty} from "../../../utils/validation";

export interface ValidationBeloepProps {
  beloep: Beloep | undefined
  index?: number
}

export const validateBeloep = (
  v: Validation,
  namespace: string | undefined,
  {
    beloep,
    index
  }: ValidationBeloepProps,
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: beloep?.beloep,
    id: namespace + idx + '-beloep',
    message: 'validation:missing-p2000-ytelse-beloep-beloep'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: beloep?.valuta,
    id: namespace + idx + '-valuta',
    message: 'validation:missing-p2000-ytelse-beloep-valuta'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: beloep?.gjeldendesiden,
    id: namespace + idx + '-gjeldendesiden',
    message: 'validation:missing-p2000-ytelse-beloep-gjeldendesiden'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: beloep?.betalingshyppighetytelse,
    id: namespace + idx + '-betalingshyppighetytelse',
    message: 'validation:missing-p2000-ytelse-beloep-betalingshyppighetytelse'
  }))

  return hasErrors.find(value => value) !== undefined
}
