import {checkIfDuplicate, checkIfNotEmpty, checkLength} from "src/utils/validation";

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

describe('validation/checkIfNotEmpty', () => {
  it('Should return true when needle is empty', () => {
    expect(checkIfNotEmpty(
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
    expect(checkIfNotEmpty(
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
    expect(checkIfNotEmpty(
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

describe('validation/checkLength', () => {
  it('Should return false when needle has length shorter then max', () => {
    expect(checkLength(
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
    expect(checkLength(
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
    expect(checkLength(
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
    expect(checkLength(
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

