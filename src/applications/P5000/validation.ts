import { Validation } from 'declarations/app'
import { P5000SED } from 'declarations/p5000'
import { TFunction } from 'react-i18next'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'

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
    v['P5000Edit-ytelse'] = {
      feilmelding: t('buc:error-noYtelse'),
      skjemaelementId: 'P5000Edit-ytelse-select'
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (_.isEmpty(p5000sed?.pensjon?.medlemskapboarbeid?.gyldigperiode)) {
    v['P5000Edit-forsikringEllerBosetningsperioder'] = {
      feilmelding: t('buc:error-noForsikringEllerBosetningsperioder'),
      skjemaelementId: 'P5000Edit-forsikringEllerBosetningsperioder'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (!_.isEmpty(p5000sed?.pensjon?.medlemskapboarbeid?.enkeltkrav?.krav) &&
    p5000sed?.pensjon?.medlemskapboarbeid?.gyldigperiode === '1' &&
    _.isEmpty(p5000sed?.pensjon?.medlemskapboarbeid?.medlemskap)) {
    v['P5000Edit-tabell'] = {
      feilmelding: t('buc:error-noPeriods'),
      skjemaelementId: 'P5000Edit-tabell'
    } as FeiloppsummeringFeil
    hasErrors = true
  }


  return hasErrors
}
