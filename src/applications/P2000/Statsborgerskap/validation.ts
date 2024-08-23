import {Statsborgerskap} from "../../../declarations/p2000";
import { Validation} from 'src/declarations/app'
import { getIdx } from 'src/utils/namespace'
import { checkIfDuplicate, checkIfNotEmpty, checkIfNotGB, checkIfValidLand } from 'src/utils/validation'

export interface ValidationStatsborgerskapProps {
  statsborgerskap: Statsborgerskap | null | undefined
  statsborgerskapArray: Array<Statsborgerskap> | undefined
  index ?: number
}

export interface ValidationStatsborgerskapArrayProps {
  statsborgerskapArray: Array<Statsborgerskap> | undefined
}

export const validateStatsborgerskap = (
  v: Validation,
  namespace: string | undefined,
  {
    statsborgerskap,
    statsborgerskapArray,
    index
  }: ValidationStatsborgerskapProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: statsborgerskap?.land,
    id: namespace + idx + '-land',
    message: 'validation:missing-p2000-statsborgerskap-land'
  }))

  hasErrors.push(checkIfValidLand(v, {
    needle: statsborgerskap?.land,
    id: namespace + idx + '-land',
    message: 'validation:invalid-p2000-statsborgerskap-land'
  }))

  hasErrors.push(checkIfDuplicate(v, {
    needle: statsborgerskap?.land,
    haystack: statsborgerskapArray,
    matchFn: (_statsborgerskap: Statsborgerskap) => _statsborgerskap.land === statsborgerskap?.land,
    index,
    id: namespace + idx + '-land',
    message: 'validation:duplicate-p2000-statsborgerskap-land',
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateStatsborgerskapArray = (
  v: Validation,
  namespace: string,
  {
    statsborgerskapArray,
  }: ValidationStatsborgerskapArrayProps
): boolean => {
  const hasErrors: Array<boolean> = statsborgerskapArray?.map((statsborgerskap: Statsborgerskap, index: number) => {
    return validateStatsborgerskap(v, namespace, {
      index,
      statsborgerskap,
      statsborgerskapArray,
    })
  }) ?? []
  return hasErrors.find(value => value) !== undefined
}
