import {Validation} from "src/declarations/app";
import { checkIfNotEmpty } from 'src/utils/validation'
import {Verge} from "src/declarations/p2000";


export interface ValidationVergeProps {
  verge: Verge | undefined
}

export const validateVerge = (
  v: Validation,
  namespace: string,
  {
    verge
  }: ValidationVergeProps
): boolean => {
  const hasErrors: Array<boolean> = []



  hasErrors.push(checkIfNotEmpty(v, {
    needle: verge?.person?.etternavn,
    id: namespace + '-person-etternavn',
    message: 'validation:missing-p2000-verge-person-etternavn'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: verge?.person?.fornavn,
    id: namespace + '-person-fornavn',
    message: 'validation:missing-p2000-verge-person-fornavn'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: verge?.vergemaal?.mandat,
    id: namespace + '-vergemaal-mandat',
    message: 'validation:missing-p2000-verge-vergemaal-mandat'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: verge?.adresse?.gate,
    id: namespace + '-adresse-gate',
    message: 'validation:missing-p2000-verge-adresse-gate'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: verge?.adresse?.postnummer,
    id: namespace + '-adresse-postnummer',
    message: 'validation:missing-p2000-verge-adresse-postnummer'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: verge?.adresse?.by,
    id: namespace + '-adresse-by',
    message: 'validation:missing-p2000-verge-adresse-by'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: verge?.adresse?.region,
    id: namespace + '-adresse-region',
    message: 'validation:missing-p2000-verge-adresse-region'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: verge?.adresse?.land,
    id: namespace + '-adresse-land',
    message: 'validation:missing-p2000-verge-adresse-land'
  }))

  return hasErrors.find(value => value) !== undefined
}
