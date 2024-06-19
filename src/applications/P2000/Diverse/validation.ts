import {Validation} from "declarations/app";

export interface ValidationDiverseProps {

}

export const validateDiverse = (
  v: Validation,
  namespace: string,
  {

  }: ValidationDiverseProps
): boolean => {
  const hasErrors: Array<boolean> = []

  console.log(v, namespace)

  return hasErrors.find(value => value) !== undefined
}
