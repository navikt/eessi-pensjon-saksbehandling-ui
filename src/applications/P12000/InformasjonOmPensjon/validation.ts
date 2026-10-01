import {Validation} from "src/declarations/app";
import {Pensjoninfo} from "src/declarations/p12000";
import {checkIfTooLong} from "src/utils/validation";

export const TILLEGGSYTELSER_MAX_LENGTH = 255

export interface ValidationInformasjonOmPensjonProps {
  pensjoninfo: Pensjoninfo | undefined
}

export const validateInformasjonOmPensjon = (
  v: Validation,
  namespace: string,
  {
    pensjoninfo
  }: ValidationInformasjonOmPensjonProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfTooLong(v, {
    needle: pensjoninfo?.tilleggsytelserutbetalingitilleggtilpensjon,
    max: TILLEGGSYTELSER_MAX_LENGTH,
    id: namespace + '-tilleggsytelserutbetalingitilleggtilpensjon',
    message: 'validation:textOverX'
  }))

  return hasErrors.find(value => value) !== undefined
}
