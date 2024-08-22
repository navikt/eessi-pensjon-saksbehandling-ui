import { Validation } from 'src/declarations/app.d'
import { useState } from 'react'

const useValidation = <ValidationData extends any>(
  validateFunction: (
    newValidation: Validation,
    namespace: string | undefined,
    validationData: ValidationData,
  ) => boolean,
  namespace: string,
  initialValue: Validation = {}
): [
      Validation,
      (key?: (string | undefined)) => void,
      (validationData: ValidationData) => boolean,
      ((value: (((prevState: Validation) => Validation) | Validation)) => void)
  ] => {
  const [_validation, setValidation] = useState<Validation>(initialValue)

  const resetValidation = (key: string | undefined = undefined): void => {
    if (key === undefined) {
      setValidation({})
    } else {
      setValidation({
        ..._validation,
        [key!]: undefined
      })
    }
  }

  const performValidation = (validationData: ValidationData): boolean => {
    const newValidation: Validation = {}
    const hasErrors: boolean = validateFunction(
      newValidation,
      namespace,
      validationData
    )
    setValidation(newValidation)
    return !hasErrors
  }

  return [
    _validation,
    resetValidation,
    performValidation,
    setValidation
  ]
}

export default useValidation
