import {Validation} from "declarations/app";
import {Arbeidsforhold} from "../../../declarations/p2000";
import {getIdx} from "../../../utils/namespace";

export interface ValidationYrkesaktivitetProps {
  arbeidsforholdArray: Array<Arbeidsforhold> | undefined
}

export interface ValidationArbeidsforholdProps {
  arbeidsforhold: Arbeidsforhold | null | undefined
  arbeidsforholdArray: Array<Arbeidsforhold> | undefined
  index ?: number
}

export const validateArbeidsforhold = (
  v: Validation,
  namespace: string | undefined,
  {
    arbeidsforhold,
    arbeidsforholdArray,
    index
  }: ValidationArbeidsforholdProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  console.log(idx, arbeidsforhold, arbeidsforholdArray)

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
