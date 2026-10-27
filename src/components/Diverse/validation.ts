import {Validation} from "src/declarations/app";
import _ from "lodash";
import {checkIfEmpty, checkIfTooLong, checkIfNotValidDateFormat} from "src/utils/validation";
import {Krav} from "src/declarations/sed";

export interface ValidationDiverseProps {
  pensjon?: {
    vedlegg?: string[]
    vedleggandre?: string
    etterspurtedokumenter?: string
    ytterligeinformasjon?: string
    forespurtstartdato?: string
  }
  sed?: string
  krav?: Krav
}

export const validateDiverse = (
  v: Validation,
  namespace: string,
  {
    pensjon,
    sed,
    krav
  }: ValidationDiverseProps
): boolean => {
  const hasErrors: Array<boolean> = []

  if(pensjon?.vedlegg?.some(v => v==="annet")){
    hasErrors.push(checkIfEmpty(v, {
      needle: pensjon?.vedleggandre,
      id: namespace + '-vedleggandre',
      message: 'validation:missing-p2000-pensjon-vedleggandre'
    }))
  }

  if (!_.isEmpty(pensjon?.vedleggandre)) {
    hasErrors.push(checkIfTooLong(v, {
      needle: pensjon?.vedleggandre,
      max: 255,
      id: namespace + '-vedleggandre',
      message: 'validation:textOverX',
    }))
  }

  if (!_.isEmpty(pensjon?.etterspurtedokumenter)) {
    hasErrors.push(checkIfTooLong(v, {
      needle: pensjon?.etterspurtedokumenter,
      max: 255,
      id: namespace + '-etterspurtedokumenter',
      message: 'validation:textOverX',
    }))
  }

  if (!_.isEmpty(pensjon?.ytterligeinformasjon)) {
    hasErrors.push(checkIfTooLong(v, {
      needle: pensjon?.ytterligeinformasjon,
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

  if (sed === "P2200") {
    const hasMissingDate = checkIfEmpty(v, {
      needle: krav?.dato,
      id: `${namespace}-kravDato`,
      message: "message:validation-chooseKravDato"
    })
    hasErrors.push(hasMissingDate)

    if (!hasMissingDate) {
      hasErrors.push(checkIfNotValidDateFormat(v, {
        needle: krav?.dato,
        id: `${namespace}-kravDato`,
        message: "validation:invalidDateFormat"
      }))
    }
  }

  return hasErrors.find(value => value) !== undefined
}
