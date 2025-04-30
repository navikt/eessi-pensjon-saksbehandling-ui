import {Validation} from "src/declarations/app";
import {Utsettelse} from "src/declarations/p2000";
import {getIdx} from "../../../utils/namespace";
import {checkIfEmpty, checkIfTooLong, checkIfNotValidDateFormat} from "../../../utils/validation";

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

  hasErrors.push(checkIfEmpty(v, {
    needle: utsettelse?.land,
    id: namespace + idx + '-land',
    message: 'validation:missing-p2000-pensjon-utsettelse-land',
  }))

  hasErrors.push(checkIfEmpty(v, {
    needle: utsettelse?.tildato,
    id: namespace + idx + '-tildato',
    message: 'validation:missing-p2000-pensjon-utsettelse-tildato',
  }))

  hasErrors.push(checkIfNotValidDateFormat(v, {
    needle: utsettelse?.tildato,
    id: namespace + idx + '-tildato',
    message: 'validation:invalidDateFormat',
  }))

  hasErrors.push(checkIfTooLong(v, {
    needle: utsettelse?.institusjonsnavn,
    id: namespace + idx + '-institusjonsnavn',
    max: 155,
    message: 'validation:textOverX'
  }))

  return hasErrors.find(value => value) !== undefined
}
