import {Validation} from "src/declarations/app";
import {Ytelse} from "src/declarations/p2000";
import {getIdx} from "src/utils/namespace";
import {checkIfNotEmpty} from "src/utils/validation";

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

  hasErrors.push(checkIfNotEmpty(v, {
    needle: ytelse?.ytelse,
    id: namespace + idx + '-ytelse',
    message: 'validation:missing-p2000-ytelse-ytelse'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: ytelse?.status,
    id: namespace + idx + '-status',
    message: 'validation:missing-p2000-ytelse-status'
  }))

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

  ytelser?.forEach((ytelse, index) => {
    hasErrors.push(validateYtelse(v, namespace, {
      ytelse: ytelse,
      index: index
    }))
  })

  return hasErrors.find(value => value) !== undefined
}
