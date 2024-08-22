import {Validation} from "src/declarations/app";
import {Person} from "../../../declarations/p2000";

export interface ValidationForsikretPersonProps {
  forsikretPerson: Person | undefined
}

export const validateForsikretPerson = (
  v: Validation,
  namespace: string,
  {
    forsikretPerson
  }: ValidationForsikretPersonProps
): boolean => {
  const hasErrors: Array<boolean> = []

  console.log(v, namespace, forsikretPerson)

  return hasErrors.find(value => value) !== undefined
}
