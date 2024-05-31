import {Validation} from "../../../declarations/app";
import {getIdx} from "../../../utils/namespace";
import {checkIfNotEmpty} from "../../../utils/validation";
import {Barn} from "../../../declarations/p2000";

export interface ValidationBarnArrayProps {
  barnArray: Array<Barn> | undefined
}

export interface ValidationBarnProps {
  barn: Barn | null | undefined
  index ?: number
}

export const validateBarn = (
  v: Validation,
  namespace: string | undefined,
  {
    barn,
    index
  }: ValidationBarnProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: barn?.person?.etternavn,
    id: namespace + idx + '-person-etternavn',
    message: 'validation:missing-p2000-barn-person-etternavn'
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateBarnArray = (
  v: Validation,
  namespace: string,
  {
    barnArray,
  }: ValidationBarnArrayProps
): boolean => {
  const hasErrors: Array<boolean> = []

  console.log(v, namespace, barnArray)

  return hasErrors.find(value => value) !== undefined
}
