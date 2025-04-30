import {Validation} from "src/declarations/app";
import _ from "lodash";
import {checkIfNotEmpty, checkIfTooLong, checkIfNotValidDateFormat} from "src/utils/validation";
import {P2000Pensjon} from "src/declarations/p2000";

export interface ValidationDiverseProps {
  pensjon: P2000Pensjon
}

export const validateDiverse = (
  v: Validation,
  namespace: string,
  {
    pensjon
  }: ValidationDiverseProps
): boolean => {
  const hasErrors: Array<boolean> = []

  if(pensjon?.vedlegg?.some(v => v==="annet")){
    hasErrors.push(checkIfNotEmpty(v, {
      needle: pensjon.vedleggandre,
      id: namespace + '-vedleggandre',
      message: 'validation:missing-p2000-pensjon-vedleggandre'
    }))
  }

  if (!_.isEmpty(pensjon?.vedleggandre)) {
    hasErrors.push(checkIfTooLong(v, {
      needle: pensjon.vedleggandre,
      max: 255,
      id: namespace + '-vedleggandre',
      message: 'validation:textOverX',
    }))
  }

  if (!_.isEmpty(pensjon?.etterspurtedokumenter)) {
    hasErrors.push(checkIfTooLong(v, {
      needle: pensjon.etterspurtedokumenter,
      max: 255,
      id: namespace + '-etterspurtedokumenter',
      message: 'validation:textOverX',
    }))
  }

  if (!_.isEmpty(pensjon?.ytterligeinformasjon)) {
    hasErrors.push(checkIfTooLong(v, {
      needle: pensjon.ytterligeinformasjon,
      max: 500,
      id: namespace + '-ytterligeinformasjon',
      message: 'validation:textOverX',
    }))
  }

  hasErrors.push(checkIfNotValidDateFormat(v, {
    needle: pensjon?.forespurtstartdato,
    id: namespace + '-forespurtstartdato  ',
    message: 'validation:invalidDateFormat',
  }))

  return hasErrors.find(value => value) !== undefined
}
