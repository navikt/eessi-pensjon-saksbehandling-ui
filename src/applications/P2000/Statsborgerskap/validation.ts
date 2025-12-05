import { Validation} from 'src/declarations/app'
import { getIdx } from 'src/utils/namespace'
import { checkIfDuplicate, checkIfEmpty } from 'src/utils/validation'
import {Statsborgerskap} from "src/declarations/sed";

export interface ValidationStatsborgerskapProps {
  statsborgerskap: Statsborgerskap | null | undefined
  statsborgerskapArray: Array<Statsborgerskap> | undefined
  index ?: number
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

  hasErrors.push(checkIfEmpty(v, {
    needle: statsborgerskap?.land,
    id: namespace + idx + '-land',
    message: 'validation:missing-p2000-statsborgerskap-land'
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
