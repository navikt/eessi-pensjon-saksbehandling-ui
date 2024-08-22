import {Validation} from "src/declarations/app";
import {Arbeidsforhold} from "../../../declarations/p2000";
import {getIdx} from "../../../utils/namespace";
import {checkIfNotEmpty} from "../../../utils/validation";

export interface ValidationYrkesaktivitetProps {
  arbeidsforholdArray: Array<Arbeidsforhold> | undefined
}

export interface ValidationArbeidsforholdProps {
  arbeidsforhold: Arbeidsforhold | null | undefined
  index ?: number
}

export const validateArbeidsforhold = (
  v: Validation,
  namespace: string | undefined,
  {
    arbeidsforhold,
    index
  }: ValidationArbeidsforholdProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: arbeidsforhold?.type,
    id: namespace + idx + '-yrkesaktivitet',
    message: 'validation:missing-p2000-arbeidsforhold-yrkesaktivitet'
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateYrkesaktivitet = (
  v: Validation,
  namespace: string,
  {
    arbeidsforholdArray,
  }: ValidationYrkesaktivitetProps
): boolean => {
  const hasErrors: Array<boolean> = []

  console.log(v, namespace, arbeidsforholdArray)

  return hasErrors.find(value => value) !== undefined
}
