export default function getError (val) {
  if (!val || val.valid) {
    return null
  }
  let errorType
  switch (true) {
    case val.customError:
      errorType = 'customError'
      break
    case val.valueMissing:
      errorType = 'valueMissing'
      break
    case val.patternMismatch:
      errorType = 'patternMismatch'
      break
    case val.badInput:
      errorType = 'badInput'
      break
    case val.rangeOverflow:
      errorType = 'rangeOverflow'
      break
    case val.rangeUnderflow:
      errorType = 'rangeUnderflow'
      break
    case val.stepMismatch:
      errorType = 'stepMismatch'
      break
    case val.tooLong:
      errorType = 'tooLong'
      break
    case val.tooShort:
      errorType = 'tooShort'
      break
    case val.typeMismatch:
      errorType = 'typeMismatch'
      break
    default:
      errorType = 'unknownError'
  }
  return errorType || null
}
