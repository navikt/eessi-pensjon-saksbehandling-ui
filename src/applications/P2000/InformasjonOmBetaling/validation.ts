import {Validation} from "src/declarations/app";
import {checkIfEmpty, checkIfNotValidIban, checkIfNotValidSwift, checkIfTooLong} from 'src/utils/validation'
import _ from 'lodash'
import performValidation from "../../../utils/performValidation";
import {validateAdresse, ValidationAdresseProps} from "../Adresse/validation";
import {Bank} from "src/declarations/sed";

export interface ValidationBankProps {
  bank: Bank | undefined
  sepaIkkeSepa: string | undefined
}

export interface ValidationSwiftProps {
  swift: string | undefined
}

export interface ValidationIbanProps {
  iban: string | undefined
}

export const validateBank = (
  v: Validation,
  namespace: string,
  {
    bank,
    sepaIkkeSepa
  }: ValidationBankProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfTooLong(v, {
    needle: bank?.konto?.innehaver?.navn,
    id: namespace + '-konto-innehaver-navn',
    max: 255,
    message: 'validation:textOverX'
  }))

  if(sepaIkkeSepa === "sepa"){
    hasErrors.push(checkIfEmpty(v, {
      needle: bank?.konto?.sepa?.iban,
      id: namespace + '-konto-sepa-iban',
      message: 'validation:missing-p2000-bank-konto-sepa-iban'
    }))

    hasErrors.push(checkIfEmpty(v, {
      needle: bank?.konto?.sepa?.swift,
      id: namespace + '-konto-sepa-swift',
      message: 'validation:missing-p2000-bank-konto-sepa-swift'
    }))


    if (!_.isEmpty(bank?.konto?.sepa?.iban)){
      validateIban(v, namespace + '-konto-sepa', {iban: bank?.konto?.sepa?.iban})
    }

    if (!_.isEmpty(bank?.konto?.sepa?.swift)){
      validateSwift(v, namespace + '-konto-sepa', {swift: bank?.konto?.sepa?.swift})
    }
  }

  if(sepaIkkeSepa === "ikkesepa"){
    hasErrors.push(performValidation<ValidationAdresseProps>(v, namespace + '-bank', validateAdresse, {
      adresse: bank?.adresse,
      usePostKode: true
    }, true))

    hasErrors.push(checkIfEmpty(v, {
      needle: bank?.konto?.kontonr,
      id: namespace + '-konto-kontonr',
      message: 'validation:missing-p2000-bank-konto-kontonr'
    }))

    hasErrors.push(checkIfEmpty(v, {
      needle: bank?.konto?.ikkesepa?.swift,
      id: namespace + '-konto-ikkesepa-swift',
      message: 'validation:missing-p2000-bank-konto-ikkesepa-swift'
    }))

    hasErrors.push(checkIfEmpty(v, {
      needle: bank?.navn,
      id: namespace + '-bank-navn',
      message: 'validation:missing-p2000-bank-navn'
    }))


    if (!_.isEmpty(bank?.konto?.ikkesepa?.swift)){
      validateSwift(v, namespace + '-konto-ikkesepa', {swift: bank?.konto?.ikkesepa?.swift})
    }
  }

  return hasErrors.find(value => value) !== undefined
}

export const validateSwift = (
  v: Validation,
  namespace: string,
  {
    swift
  }: ValidationSwiftProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotValidSwift(v,{
      needle: swift,
      id: namespace,
      message: 'validation:invalid-p2000-bank-konto-ikkesepa-swift'
    })
  )

  return hasErrors.find(value => value) !== undefined
}

export const validateIban = (
  v: Validation,
  namespace: string,
  {
    iban
  }: ValidationIbanProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotValidIban(v,{
      needle: iban,
      id: namespace,
      message: 'validation:invalid-p2000-bank-konto-sepa-iban'
    })
  )

  return hasErrors.find(value => value) !== undefined
}

