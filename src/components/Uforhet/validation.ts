import {Validation} from "src/declarations/app";
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

  return hasErrors.find(value => value) !== undefined
}
