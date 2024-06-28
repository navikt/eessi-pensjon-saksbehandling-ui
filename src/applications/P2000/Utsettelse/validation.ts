import {Validation} from "declarations/app";
import {Utsettelse} from "declarations/p2000";
import {getIdx} from "../../../utils/namespace";
import {checkIfNotEmpty} from "../../../utils/validation";

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

  hasErrors.push(checkIfNotEmpty(v, {
    needle: utsettelse?.land,
    id: namespace + idx + '-land',
    message: 'validation:missing-p2000-pensjon-utsettelse-land',
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: utsettelse?.institusjonsnavn,
    id: namespace + idx + '-institusjonsnavn',
    message: 'validation:missing-p2000-pensjon-utsettelse-institusjonsnavn',
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: utsettelse?.tildato,
    id: namespace + idx + '-tildato',
    message: 'validation:missing-p2000-pensjon-utsettelse-tildato',
  }))

  return hasErrors.find(value => value) !== undefined
}
