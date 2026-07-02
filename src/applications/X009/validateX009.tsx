import {Validation} from "src/declarations/app";
import {X009SED} from "src/declarations/x009";
import performValidation from "src/utils/performValidation";
import {validatePaaminnelse, ValidationPaaminnelseProps} from "./Paaminnelse/validation";

export interface ValidationX009Props {
  X009SED: X009SED
}

export const validateX009 = (
  v: Validation,
  namespace: string,
  {
    X009SED
  }: ValidationX009Props
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(performValidation<ValidationPaaminnelseProps>(v, `x009-paaminnelse`, validatePaaminnelse, {
    sendeItemArray: X009SED.nav?.sak?.paaminnelse?.sende
  }, true))

  return hasErrors.find(value => value) !== undefined
}
