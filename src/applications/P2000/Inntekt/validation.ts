import {Validation} from "declarations/app";
import {getIdx} from "../../../utils/namespace";

export interface ValidationInntektProps {
  index?: number
}

export const validateInntekt = (
  v: Validation,
  namespace: string | undefined,
  {
    index
  }: ValidationInntektProps,
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)
  console.log(idx)

  return hasErrors.find(value => value) !== undefined
}
