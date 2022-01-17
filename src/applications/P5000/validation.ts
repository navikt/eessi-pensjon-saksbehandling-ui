import { ErrorElement, Validation } from 'declarations/app'
import { P5000SED } from 'declarations/p5000'
import { TFunction } from 'react-i18next'
import _ from 'lodash'

export interface P5000EditValidationProps {
  p5000sed: P5000SED
}

export const P5000EditValidate = (
  v: Validation,
  t: TFunction,
  {
    p5000sed
  }: P5000EditValidationProps
): boolean => {
  let hasErrors: boolean = false

  if (_.isEmpty(p5000sed?.pensjon?.medlemskapboarbeid?.enkeltkrav?.krav)) {
    v['P5000Edit-ytelse-select'] = {
      feilmelding: t('message:error-noYtelse'),
      skjemaelementId: 'P5000Edit-ytelse-select'
    } as ErrorElement
    hasErrors = true
  }
  if (_.isEmpty(p5000sed?.pensjon?.medlemskapboarbeid?.gyldigperiode)) {
    v['P5000Edit-forsikringEllerBosetningsperioder'] = {
      feilmelding: t('message:error-noForsikringEllerBosetningsperioder'),
      skjemaelementId: 'P5000Edit-forsikringEllerBosetningsperioder'
    } as ErrorElement
    hasErrors = true
  }

  if (!_.isEmpty(p5000sed?.pensjon?.medlemskapboarbeid?.enkeltkrav?.krav) &&
    p5000sed?.pensjon?.medlemskapboarbeid?.gyldigperiode === '1' &&
    _.isEmpty(p5000sed?.pensjon?.medlemskapboarbeid?.medlemskap)) {
    v['P5000Edit-tabell'] = {
      feilmelding: t('message:error-noPeriods'),
      skjemaelementId: 'P5000Edit-tabell'
    } as ErrorElement
    hasErrors = true
  }

  return hasErrors
}
