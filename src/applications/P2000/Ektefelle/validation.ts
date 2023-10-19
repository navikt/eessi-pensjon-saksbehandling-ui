import {Validation} from "declarations/app";
import {Ektefelle} from "../../../declarations/p2000";



export interface ValidationEktefelleProps {
  ektefelle: Ektefelle | undefined
}

export const validateEktefelle = (
  v: Validation,
  namespace: string,
  {
    ektefelle
  }: ValidationEktefelleProps
): boolean => {
  const hasErrors: Array<boolean> = []

  console.log(v, namespace, ektefelle
  )

  return hasErrors.find(value => value) !== undefined
}
