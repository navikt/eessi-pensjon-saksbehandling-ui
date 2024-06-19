import {Validation} from "declarations/app";
import {Utsettelse} from "declarations/p2000";
import {getIdx} from "../../../utils/namespace";

export interface ValidationUtsettelseProps {
  utsettelse: Utsettelse | undefined
  index?: number
}

export const validateUtsettelse = (
  v: Validation,
  namespace: string | undefined,
  {
    utsettelse,
    index
  }: ValidationUtsettelseProps,
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  console.log(utsettelse, idx)

  return hasErrors.find(value => value) !== undefined
}
