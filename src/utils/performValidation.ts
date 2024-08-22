import {ErrorElement, Validation} from 'src/declarations/app'
import { filterAllWithNamespace } from 'src/utils/validation'

const performValidation = <ValidationData extends any>(
  validation: Validation,
  namespace: string,
  validateFunction: (
    validation: Validation,
    namespace: string,
    validationData: ValidationData
  ) => boolean,
  validationData: ValidationData,
  writeSummary: boolean = false
): boolean => {
  // clean up the namespace before performing the validation
  filterAllWithNamespace(validation, namespace)

  const hasErrors: boolean = validateFunction(
    validation,
    namespace,
    validationData
  )
  if (writeSummary) {
    validation[namespace] = { feilmelding: hasErrors ? 'error' : 'ok' } as ErrorElement
  }
  return hasErrors
}

export default performValidation
