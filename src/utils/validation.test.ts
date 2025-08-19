import {
  checkIfDuplicate,
  checkIfNotEmail,
  checkIfEmpty,
  checkIfGB,
  checkIfNotTelephoneNumber,
  checkIfNotValidBeloep,
  checkIfNotValidSwift,
  checkIfTooLong,
  checkIfNotValidDateFormat,
  isOutOfRange
} from "src/utils/validation";

interface MockObject {
  property1: string
  property2: string
}

const mockValidation =       {
  "namespace": {
    "skjemaelementId": "1",
    "feilmelding": "ok"
  }
}

describe('validation/isOutOfRange', () => {
  it('Should return true when num is bigger than max', () => {
    const min = 1
    const max = 2
    const num = 3

    expect(
      isOutOfRange(num, min, max)
    )
      .toEqual(true)
  })

  it('Should return true when num is smaller than min', () => {
    const min = 10
    const max = 20
    const num = 2

    expect(
      isOutOfRange(num, min, max)
    )
      .toEqual(true)
  })

  it('Should return false when num is between min and max', () => {
    const min = 1000
    const max = 3000
    const num = 2000

    expect(
      isOutOfRange(num, min, max)
    )
      .toEqual(false)
  })

  it('Should return false when all parameters are 0', () => {
    const min = 0
    const max = 0
    const num = 0

    expect(
      isOutOfRange(num, min, max)
    )
      .toEqual(false)
  })
})

describe('validation/checkIfEmpty', () => {
  it('Should return true when needle is empty', () => {
    expect(checkIfEmpty(
      mockValidation,
      {
        needle: "",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(true)
  })
  it('Should return false when needle is not empty', () => {
    expect(checkIfEmpty(
      mockValidation,
      {
        needle: "not empty",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(false)
  })
  it('Should return true when needle is not a string', () => {
    expect(checkIfEmpty(
      mockValidation,
      {
        needle: 23,
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(true)
  })
})

describe('validation/checkIfTooLong', () => {
  it('Should return false when needle has length shorter then max', () => {
    expect(checkIfTooLong(
      mockValidation,
      {
        needle: "1234567890",
        id: 'id',
        max: 65,
        message: 'validation text'
      }
    ))
      .toEqual(false)
  })
  it('Should return false when needle has same length as max', () => {
    expect(checkIfTooLong(
      mockValidation,
      {
        needle: "12345678901234567890123456789012345678901234567890123456789012345",
        id: 'id',
        max: 65,
        message: 'validation text'
      }
    ))
      .toEqual(false)
  })
  it('Should return true when length is more than max', () => {
    expect(checkIfTooLong(
      mockValidation,
      {
        needle: "1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890",
        id: 'id',
        max: 65,
        message: 'validation text'
      }
    ))
      .toEqual(true)
  })
  it('Should return false when needle is an empty string', () => {
    expect(checkIfTooLong(
      mockValidation,
      {
        needle: "",
        id: 'id',
        max: 65,
        message: 'validation text'
      }
    ))
      .toEqual(false)
  })
})

describe('validation/checkIfDuplicate', () => {
  it('Should return false when needle element is mathced in the haystack array', () => {
    const mockObject : MockObject =       {
      property1: "mockProperty1",
      property2: "mockProperty2",
    }
    const mockObjectArray : any = [{
      property1: "mockProperty1",
      property2: "mockProperty2",
    }]

    const mockMatchFn = (_m : MockObject) =>
      _m.property1 === mockObject?.property1 &&
      _m.property2 === mockObject?.property2

    expect(checkIfDuplicate(
      mockValidation,
      {
        needle: mockObject,
        haystack: mockObjectArray,
        matchFn: mockMatchFn,
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(true)
  })

  it('Should return false when needle element is not matched in the haystack array', () => {
    const mockObject : MockObject =       {
      property1: "mockProperty1",
      property2: "mockProperty2",
    }
    const mockObjectArray : any = [{
      property1: "mockProperty3",
      property2: "mockProperty4",
    }]

    const mockMatchFn = (_m : MockObject) =>
      _m.property1 === mockObject?.property1 &&
    _m.property2 === mockObject?.property2

    expect(checkIfDuplicate(
      mockValidation,
      {
        needle: mockObject,
        haystack: mockObjectArray,
        matchFn: mockMatchFn,
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(false)
  })

  it('Should return false when needle element is only partly matched in the haystack array', () => {
    const mockObject : MockObject =       {
      property1: "mockProperty1",
      property2: "mockProperty2",
    }
    const mockObjectArray : any = [{
      property1: "mockProperty2",
      property2: "mockProperty3",
    }]

    const mockMatchFn = (_m : MockObject) =>
      _m.property1 === mockObject?.property1 &&
      _m.property2 === mockObject?.property2

    expect(checkIfDuplicate(
      mockValidation,
      {
        needle: mockObject,
        haystack: mockObjectArray,
        matchFn: mockMatchFn,
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(false)
  })

  it('Should return false when needle element is empty', () => {
    const mockObject : string = ""
    const mockObjectArray : any = [""]

    const mockMatchFn = (_m : MockObject) =>
      mockObject.toString() === mockObject[0].toString()

    expect(checkIfDuplicate(
      mockValidation,
      {
        needle: mockObject,
        haystack: mockObjectArray,
        matchFn: mockMatchFn,
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(false)
  })
})

describe('validation/checkIfNotValidDateFormat', () => {
  it('Should return false when date needle is YYYY-MM-DD', () => {
    expect(checkIfNotValidDateFormat(
      mockValidation,
      {
        needle: "2025-09-02",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(false)
  })

  it('Should return false when date needle is DD.MM.YYYY', () => {
    expect(checkIfNotValidDateFormat(
      mockValidation,
      {
        needle: "01.01.2025",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(false)
  })

  it('Should return false when date needle is DD.MM.YY', () => {
    expect(checkIfNotValidDateFormat(
      mockValidation,
      {
        needle: "30.12.24",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(false)
  })

  it('Should return false when date needle is DDMMYY', () => {
    expect(checkIfNotValidDateFormat(
      mockValidation,
      {
        needle: "010203",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(false)
  })


  it('Should return false when date needle is undefined', () => {
    expect(checkIfNotValidDateFormat(
      mockValidation,
      {
        needle: undefined,
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(false)
  })

  it('Should return true when date needle is D.M.YY', () => {
    expect(checkIfNotValidDateFormat(
      mockValidation,
      {
        needle: "2.4.72",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(true)
  })

  it('Should return true when date needle is not a date string at all', () => {
    expect(checkIfNotValidDateFormat(
      mockValidation,
      {
        needle: "Petter",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(true)
  })
})

describe('validation/checkIfNotEmail', () => {
  it('Should return false when needle is of valid dateformat', () => {
    expect(checkIfNotEmail(
      mockValidation,
      {
        needle: "123@123.no",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(false)
  })

  it('Should return true when email needle lacks dot', () => {
    expect(checkIfNotEmail(
      mockValidation,
      {
        needle: "123@123no",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(true)
  })

  it('Should return true when email needle lacks alpha', () => {
    expect(checkIfNotEmail(
      mockValidation,
      {
        needle: "123123.no",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(true)
  })

  it('Should return true when email needle has nothing left of alpha', () => {
    expect(checkIfNotEmail(
      mockValidation,
      {
        needle: "@123.no",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(true)
  })
})

describe('validation/checkIfNotTelephoneNumber', () => {
  it('Should return false when phone needle is eighth digits without white spaces', () => {
    expect(checkIfNotTelephoneNumber(
      mockValidation,
      {
        needle: "12345678",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(false)
  })

  it('Should return false when phone needle is eighth digits and has white spaces', () => {
    expect(checkIfNotTelephoneNumber(
      mockValidation,
      {
        needle: "12 345 678",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(false)
  })

  it('Should return false when phone needle is eighth digits, has white spaces and land prefix', () => {
    expect(checkIfNotTelephoneNumber(
      mockValidation,
      {
        needle: "+47 12 345 678",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(false)
  })

  it('Should return false when phone needle has dashs', () => {
    expect(checkIfNotTelephoneNumber(
      mockValidation,
      {
        needle: "+47-12-345-678",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(false)
  })

  it('Should return false when phone needle has dots', () => {
    expect(checkIfNotTelephoneNumber(
      mockValidation,
      {
        needle: "+47.12.345.678",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(false)
  })

  it('Should return false when phone needle is empty string', () => {
    expect(checkIfNotTelephoneNumber(
      mockValidation,
      {
        needle: "",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(false)
  })

  it('Should return true when phone needle has commas', () => {
    expect(checkIfNotTelephoneNumber(
      mockValidation,
      {
        needle: "+47,12,345,678",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(true)
  })

  it('Should return true when phone needle has letters', () => {
    expect(checkIfNotTelephoneNumber(
      mockValidation,
      {
        needle: "p47.12.345.678",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(true)
  })
})

describe('validation/checkIfNotValidBeloep', () => {
  it('Should return false when beloep needle only has digits', () => {
    expect(checkIfNotValidBeloep(
      mockValidation,
      {
        needle: "12345678",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(false)
  })

  it('Should return false when beloep has single dot', () => {
    expect(checkIfNotValidBeloep(
      mockValidation,
      {
        needle: "123456.78",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(false)
  })

  it('Should return false when beloep is an empty string', () => {
    expect(checkIfNotValidBeloep(
      mockValidation,
      {
        needle: "",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(false)
  })

  it('Should return true when beloep has white space', () => {
    expect(checkIfNotValidBeloep(
      mockValidation,
      {
        needle: "123 456.78",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(true)
  })

  it('Should return true when beloep has comma', () => {
    expect(checkIfNotValidBeloep(
      mockValidation,
      {
        needle: "123456,78",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(true)
  })

  it('Should return true when beloep has multiple dots', () => {
    expect(checkIfNotValidBeloep(
      mockValidation,
      {
        needle: "123.456.78",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(true)
  })

  it('Should return true when beloep has other characters than numbers and a single dot', () => {
    expect(checkIfNotValidBeloep(
      mockValidation,
      {
        needle: "123456.78f",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(true)
  })

  it('Should return true when beloep has more than two digits behind the dot', () => {
    expect(checkIfNotValidBeloep(
      mockValidation,
      {
        needle: "123456.123",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(true)
  })

  it('Should return true when beloep has more than ten digits', () => {
    expect(checkIfNotValidBeloep(
      mockValidation,
      {
        needle: "12345678901",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(true)
  })

  it('Should return false when beloep has more than ten digits including dot and digits after the dot', () => {
    expect(checkIfNotValidBeloep(
      mockValidation,
      {
        needle: "123456789.01",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(false)
  })
})

describe('validation/checkIfNotValidSwift', () => {
  it('Should return false when swift needle meets all criterias and has nothing extra', () => {
    expect(checkIfNotValidSwift(
      mockValidation,
      {
        needle: "ABCDefg1123",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(false)
  })

  it('Should return false when swift needle meets all criterias, but is shorter than max length', () => {
    expect(checkIfNotValidSwift(
      mockValidation,
      {
        needle: "ABCDefg1",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(false)
  })

  it('Should return false when swift needle is an empty string', () => {
    expect(checkIfNotValidSwift(
      mockValidation,
      {
        needle: "",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(false)
  })

  it('Should return true when swift needle has dot', () => {
    expect(checkIfNotValidSwift(
      mockValidation,
      {
        needle: "AAAAaa.11111 ",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(true)
  })

  it('Should return true when swift needle has comma', () => {
    expect(checkIfNotValidSwift(
      mockValidation,
      {
        needle: "AAAAaa,11111 ",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(true)
  })

  it('Should return true when swift needle has white space', () => {
    expect(checkIfNotValidSwift(
      mockValidation,
      {
        needle: "AAAAaa,11111 ",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(true)
  })

  it('Should return true when swift is shorter than 6 characters', () => {
    expect(checkIfNotValidSwift(
      mockValidation,
      {
        needle: "AAAAa ",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(true)
  })

  it('Should return true when order of letters and numbers are wrong', () => {
    expect(checkIfNotValidSwift(
      mockValidation,
      {
        needle: "11111AAAAaa",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(true)
  })
})

describe('validation/checkIfGB', () => {
  it('Should return true when needle is gb in small letters', () => {
    expect(checkIfGB(
      mockValidation,
      {
        needle: "gb",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(true)
  })

  it('Should return true when needle is gb in large letters', () => {
    expect(checkIfGB(
      mockValidation,
      {
        needle: "GB",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(true)
  })

  it('Should return false when needle is not gb', () => {
    expect(checkIfGB(
      mockValidation,
      {
        needle: "BG",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(false)
  })

  it('Should return false when needle is gb multiple times', () => {
    expect(checkIfGB(
      mockValidation,
      {
        needle: "GBGB",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(false)
  })

  it('Should return false when needle is an empty string', () => {
    expect(checkIfGB(
      mockValidation,
      {
        needle: "",
        id: 'id',
        message: 'validation text'
      }
    ))
      .toEqual(false)
  })
})









