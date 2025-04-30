import {Validation} from "src/declarations/app";
import {checkIfNotEmpty, checkIfTooLong} from 'src/utils/validation'

import {Adresse} from "src/declarations/sed";

export interface ValidationAdresseProps {
  adresse?: Adresse
  usePostKode?: boolean
}

export const validateAdresse = (
  v: Validation,
  namespace: string,
  {
    adresse,
    usePostKode = false
  }: ValidationAdresseProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: adresse?.gate,
    id: namespace + '-adresse-gate',
    message: 'validation:missing-p2000-adresse-gate'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: usePostKode ? adresse?.postkode : adresse?.postnummer,
    id: namespace + '-adresse-postnummer',
    message: 'validation:missing-p2000-adresse-postnummer'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: adresse?.by,
    id: namespace + '-adresse-by',
    message: 'validation:missing-p2000-adresse-by'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: adresse?.land,
    id: namespace + '-adresse-land',
    message: 'validation:missing-p2000-adresse-land'
  }))

  hasErrors.push(checkIfTooLong(v, {
    needle: adresse?.gate,
    id: namespace + '-adresse-gate',
    max: 155,
    message: 'validation:textOverX'
  }))

  hasErrors.push(checkIfTooLong(v, {
    needle: usePostKode ? adresse?.postkode : adresse?.postnummer,
    id: namespace + '-adresse-postnummer',
    max: 25,
    message: 'validation:textOverX'
  }))

  hasErrors.push(checkIfTooLong(v, {
    needle: adresse?.by,
    id: namespace + '-adresse-by',
    max: 65,
    message: 'validation:textOverX'
  }))

  hasErrors.push(checkIfTooLong(v, {
    needle: adresse?.region,
    id: namespace + '-adresse-region',
    max: 65,
    message: 'validation:textOverX'
  }))

  return hasErrors.find(value => value) !== undefined
}
