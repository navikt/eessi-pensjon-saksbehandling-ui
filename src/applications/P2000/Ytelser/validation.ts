import {Validation} from "declarations/app";
import {Ytelse} from "../../../declarations/p2000";
import {getIdx} from "../../../utils/namespace";

export interface ValidationYtelserProps {
  ytelser: Array<Ytelse> | undefined
}

export interface ValidationYtelseProps {
  ytelse: Ytelse | null | undefined
  index ?: number
}

export const validateYtelse = (
  v: Validation,
  namespace: string | undefined,
  {
    ytelse,
    index
  }: ValidationYtelseProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  console.log(v, ytelse, idx)

  return hasErrors.find(value => value) !== undefined
}

export const validateYtelser = (
  v: Validation,
  namespace: string,
  {
    ytelser,
  }: ValidationYtelserProps
): boolean => {
  const hasErrors: Array<boolean> = []

  console.log(v, namespace, ytelser)

  return hasErrors.find(value => value) !== undefined
}
