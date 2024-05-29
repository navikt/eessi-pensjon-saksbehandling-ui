import {Validation} from "src/declarations/app";
import {addError, checkIfNotEmpty} from 'src/utils/validation'
import {Bank  } from "src/declarations/p2000";
import _ from 'lodash'

export interface ValidationBankProps {
  bank: Bank | undefined
  sepaIkkeSepa: string | undefined
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

  if(sepaIkkeSepa === "sepa"){
    hasErrors.push(checkIfNotEmpty(v, {
      needle: bank?.konto?.sepa?.iban,
      id: namespace + '-konto-sepa-iban',
      message: 'validation:missing-p2000-bank-konto-sepa-iban'
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: bank?.konto?.sepa?.swift,
      id: namespace + '-konto-sepa-swift',
      message: 'validation:missing-p2000-bank-konto-sepa-swift'
    }))

    if (!_.isEmpty(bank?.konto?.sepa?.iban) && !bank?.konto?.sepa?.iban?.trim().match(/^[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[a-zA-Z0-9]{7}([a-zA-Z0-9]?){0,16}/)) {
      hasErrors.push(addError(v, {
        id: namespace + '-konto-sepa-iban',
        message: 'validation:invalid-p2000-bank-konto-sepa-iban'
      }))
    }

    if (!_.isEmpty(bank?.konto?.sepa?.swift) && !bank?.konto?.sepa?.swift?.trim().match(/([a-zA-Z]){4}([a-zA-Z]){2}([0-9a-zA-Z]){2}([0-9a-zA-Z]{3})?/)) {
      hasErrors.push(addError(v, {
        id: namespace + '-konto-sepa-swift',
        message: 'validation:invalid-p2000-bank-konto-sepa-swift'
      }))
    }
  }

  if(sepaIkkeSepa === "ikkesepa"){
    hasErrors.push(checkIfNotEmpty(v, {
      needle: bank?.konto?.kontonr,
      id: namespace + '-konto-kontonr',
      message: 'validation:missing-p2000-bank-konto-kontonr'
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: bank?.konto?.ikkesepa?.swift,
      id: namespace + '-konto-ikkesepa-swift',
      message: 'validation:missing-p2000-bank-konto-ikkesepa-swift'
    }))

    if (!_.isEmpty(bank?.konto?.ikkesepa?.swift) && !bank?.konto?.ikkesepa?.swift?.trim().match(/([a-zA-Z]){4}([a-zA-Z]){2}([0-9a-zA-Z]){2}([0-9a-zA-Z]{3})?/)) {
      hasErrors.push(addError(v, {
        id: namespace + '-konto-ikkesepa-swift',
        message: 'validation:invalid-p2000-bank-konto-ikkesepa-swift'
      }))
    }
  }

  return hasErrors.find(value => value) !== undefined
}
