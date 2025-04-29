import {Validation} from "src/declarations/app";
import {P8000Field, P8000SED} from "src/declarations/p8000";
import {addError, checkIfInteger, checkIfNotEmpty, hasFourDigits, isInteger} from "src/utils/validation";
import _ from "lodash";

export interface ValidationP8000Props {
  P8000SED: P8000SED
}

export const validateP8000 = (
  v: Validation,
  namespace: string,
  {
    P8000SED
  }: ValidationP8000Props
): boolean => {
  const hasErrors: Array<boolean> = []
  const ofteEtterspurtInformasjon = P8000SED.options?.ofteEtterspurtInformasjon
  const informasjonSomKanLeggesInn = P8000SED.options?.informasjonSomKanLeggesInn

  if(ofteEtterspurtInformasjon?.dokumentasjonPaaArbeidINorge){
    const arbeidINorge: P8000Field = ofteEtterspurtInformasjon?.dokumentasjonPaaArbeidINorge

    hasErrors.push(checkIfNotEmpty(v, {
      needle: arbeidINorge.periodeFra,
      id: namespace + '-ofteEtterspurtInformasjon' + '-dokumentasjonPaaArbeidINorge' + '-periodeFra',
      message: 'validation:missing-p8000-periodeFra'
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: arbeidINorge.periodeTil,
      id: namespace + '-ofteEtterspurtInformasjon' + '-dokumentasjonPaaArbeidINorge' + '-periodeTil',
      message: 'validation:missing-p8000-periodeTil'
    }))

    hasErrors.push(checkIfInteger(v, {
      needle: arbeidINorge.periodeFra,
      id: namespace + '-ofteEtterspurtInformasjon' + '-dokumentasjonPaaArbeidINorge' + '-periodeFra',
      message: 'validation:notanumber-p8000-periodeFra'
    }))

    hasErrors.push(checkIfInteger(v, {
      needle: arbeidINorge.periodeTil,
      id: namespace + '-ofteEtterspurtInformasjon' + '-dokumentasjonPaaArbeidINorge' + '-periodeTil',
      message: 'validation:notanumber-p8000-periodeTil'
    }))

    if(arbeidINorge.periodeFra && !hasFourDigits(arbeidINorge.periodeFra)){
      hasErrors.push(addError(v, {
        id: namespace + '-ofteEtterspurtInformasjon' + '-dokumentasjonPaaArbeidINorge' + '-periodeFra',
        message: 'validation:notfourdigits-p8000-periodeFra',
      }))
    }

    if(arbeidINorge.periodeTil && !hasFourDigits(arbeidINorge.periodeTil)){
      hasErrors.push(addError(v, {
        id: namespace + '-ofteEtterspurtInformasjon' + '-dokumentasjonPaaArbeidINorge' + '-periodeTil',
        message: 'validation:notfourdigits-p8000-periodeTil',
      }))
    }

    if(!_.isEmpty(arbeidINorge.periodeFra) && !_.isEmpty(arbeidINorge.periodeTil) &&
      isInteger(arbeidINorge.periodeFra) && isInteger(arbeidINorge.periodeTil) &&
      hasFourDigits(arbeidINorge.periodeFra) && hasFourDigits(arbeidINorge.periodeTil))
    {
      if(arbeidINorge.periodeFra > arbeidINorge.periodeTil){
        hasErrors.push(addError(v, {
          id: namespace + '-ofteEtterspurtInformasjon' + '-dokumentasjonPaaArbeidINorge' + '-periodeTil',
          message: 'validation:notinrange-p8000-periodeTilPeriodeFra',
        }))
      }
    }
  }

  if(ofteEtterspurtInformasjon?.inntektFoerUfoerhetIUtlandet){
    const inntekt: P8000Field = ofteEtterspurtInformasjon?.inntektFoerUfoerhetIUtlandet
    hasErrors.push(checkIfNotEmpty(v, {
      needle: inntekt.landkode,
      id: namespace + '-ofteEtterspurtInformasjon' + '-inntektFoerUfoerhetIUtlandet' + '-land',
      message: 'validation:missing-p8000-land'
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: inntekt.periodeFra,
      id: namespace + '-ofteEtterspurtInformasjon' + '-inntektFoerUfoerhetIUtlandet' + '-periodeFra',
      message: 'validation:missing-p8000-periodeFra'
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: inntekt.periodeTil,
      id: namespace + '-ofteEtterspurtInformasjon' + '-inntektFoerUfoerhetIUtlandet' + '-periodeTil',
      message: 'validation:missing-p8000-periodeTil'
    }))

    hasErrors.push(checkIfInteger(v, {
      needle: inntekt.periodeFra,
      id: namespace + '-ofteEtterspurtInformasjon' + '-inntektFoerUfoerhetIUtlandet' + '-periodeFra',
      message: 'validation:notanumber-p8000-periodeFra'
    }))

    hasErrors.push(checkIfInteger(v, {
      needle: inntekt.periodeTil,
      id: namespace + '-ofteEtterspurtInformasjon' + '-inntektFoerUfoerhetIUtlandet' + '-periodeTil',
      message: 'validation:notanumber-p8000-periodeTil'
    }))

    if(inntekt.periodeFra && !hasFourDigits(inntekt.periodeFra)){
      hasErrors.push(addError(v, {
        id: namespace + '-ofteEtterspurtInformasjon' + '-inntektFoerUfoerhetIUtlandet' + '-periodeFra',
        message: 'validation:notfourdigits-p8000-periodeFra',
      }))
    }

    if(inntekt.periodeTil && !hasFourDigits(inntekt.periodeTil)){
      hasErrors.push(addError(v, {
        id: namespace + '-ofteEtterspurtInformasjon' + '-inntektFoerUfoerhetIUtlandet' + '-periodeTil',
        message: 'validation:notfourdigits-p8000-periodeTil',
      }))
    }

    if(!_.isEmpty(inntekt.periodeFra) && !_.isEmpty(inntekt.periodeTil) &&
      isInteger(inntekt.periodeFra) && isInteger(inntekt.periodeTil) &&
      hasFourDigits(inntekt.periodeFra) && hasFourDigits(inntekt.periodeTil))
    {
      if(inntekt.periodeFra > inntekt.periodeTil){
        hasErrors.push(addError(v, {
          id: namespace + '-ofteEtterspurtInformasjon' + '-inntektFoerUfoerhetIUtlandet' + '-periodeTil',
          message: 'validation:notinrange-p8000-periodeTilPeriodeFra',
        }))
      }
    }
  }

  if(ofteEtterspurtInformasjon?.opplysningerOmEPS){
    hasErrors.push(checkIfNotEmpty(v, {
      needle: ofteEtterspurtInformasjon?.opplysningerOmEPS.landkode,
      id: namespace + '-ofteEtterspurtInformasjon' + '-opplysningerOmEPS' + '-land',
      message: 'validation:missing-p8000-land'
    }))
  }

  if(informasjonSomKanLeggesInn?.saksbehandlingstid){
    hasErrors.push(checkIfNotEmpty(v, {
      needle: informasjonSomKanLeggesInn?.saksbehandlingstid.antallMaaneder,
      id: namespace + '-informasjonSomKanLeggesInn' + '-saksbehandlingstid' + '-antallMaaneder',
      message: 'validation:missing-p8000-antallMaaneder'
    }))

    hasErrors.push(checkIfInteger(v, {
      needle: informasjonSomKanLeggesInn?.saksbehandlingstid.antallMaaneder,
      id: namespace + '-informasjonSomKanLeggesInn' + '-saksbehandlingstid' + '-antallMaaneder',
      message: 'validation:notanumber-p8000-antallMaaneder'
    }))

    if(!_.isEmpty(informasjonSomKanLeggesInn?.saksbehandlingstid.antallMaaneder) &&
      isInteger(informasjonSomKanLeggesInn?.saksbehandlingstid.antallMaaneder))
    {
      if(parseInt(informasjonSomKanLeggesInn?.saksbehandlingstid.antallMaaneder) < 1 || parseInt(informasjonSomKanLeggesInn?.saksbehandlingstid.antallMaaneder) > 24){
        hasErrors.push(addError(v, {
          id: namespace + '-informasjonSomKanLeggesInn' + '-saksbehandlingstid' + '-antallMaaneder',
          message: 'validation:notinrange-p8000-antallMaaneder',
        }))
      }
    }
  }

  return hasErrors.find(value => value) !== undefined
}
