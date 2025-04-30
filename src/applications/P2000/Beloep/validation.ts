import {Validation} from "src/declarations/app";
import {getIdx} from "../../../utils/namespace";
import {Beloep} from "../../../declarations/p2000";
import {checkIfDuplicate, checkIfNotEmpty, checkIfNotValidBeloep, checkIfNotValidDateFormat} from "../../../utils/validation";

export interface ValidationBeloepProps {
  beloepArray: Array<Beloep> | null | undefined
  beloep: Beloep | undefined
  index?: number
}

export const validateBeloep = (
  v: Validation,
  namespace: string | undefined,
  {
    beloepArray,
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

  hasErrors.push(checkIfNotValidBeloep(v, {
    needle: beloep?.beloep,
    id: namespace + idx + '-beloep',
    message: 'validation:invalid-p2000-beloep'
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

  hasErrors.push(checkIfNotValidDateFormat(v, {
    needle: beloep?.gjeldendesiden,
    id: namespace + idx + '-gjeldendesiden  ',
    message: 'validation:invalidDateFormat',
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: beloep?.betalingshyppighetytelse,
    id: namespace + idx + '-betalingshyppighetytelse',
    message: 'validation:missing-p2000-ytelse-beloep-betalingshyppighetytelse'
  }))

  hasErrors.push(checkIfDuplicate(v, {
    needle: beloep,
    haystack: beloepArray,
    matchFn: (_b: Beloep) =>
      _b.beloep === beloep?.beloep &&
      _b.valuta === beloep?.valuta &&
      _b.gjeldendesiden === beloep?.gjeldendesiden &&
      _b.betalingshyppighetytelse === beloep?.betalingshyppighetytelse,
    index,
    id: namespace + idx + '-beloepArray',
    message: 'validation:duplicate-p2000-ytelse-beloep',
  }))



  return hasErrors.find(value => value) !== undefined
}
