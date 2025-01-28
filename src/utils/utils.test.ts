import {removeWhiteSpaceAndSeperators} from 'src/utils/utils'

describe('utils/utils/removeWhiteSpaceAndCommasAndPeriods', () => {
  it('Should remove both white spaces, commas and periods', () => {
    expect(removeWhiteSpaceAndSeperators(' String With White Spaces, Commas, ...Periods.')).toEqual(
      'StringWithWhiteSpacesCommasPeriods'
    )
  })

  it('Should remove white spaces', () => {
    expect(removeWhiteSpaceAndSeperators(' String With White Spaces ')).toEqual(
      'StringWithWhiteSpaces'
    )
  })

  it('Should remove commas', () => {
    expect(removeWhiteSpaceAndSeperators('String,With,Commas')).toEqual(
      'StringWithCommas'
    )
  })

  it('Should remove periods', () => {
    expect(removeWhiteSpaceAndSeperators('String.With.Periods')).toEqual(
      'StringWithPeriods'
    )
  })

  it('Should do nothing when string has no white spaces, commas or periods', () => {
    expect(removeWhiteSpaceAndSeperators('StringWithoutWhiteSpacesCommasOrPeriods')).toEqual(
      'StringWithoutWhiteSpacesCommasOrPeriods'
    )
  })

  it('Should return empty string when string contains only white spaces', () => {
    expect(removeWhiteSpaceAndSeperators('  ')).toEqual(
      ''
    )
  })

  it('Should return empty string when string only contains commas', () => {
    expect(removeWhiteSpaceAndSeperators(',,,,,')).toEqual(
      ''
    )
  })

  it('Should return empty string when string only contains periods', () => {
    expect(removeWhiteSpaceAndSeperators('....')).toEqual(
      ''
    )
  })

  it('Should remove both white spaces, commas and periods from number strings', () => {
    expect(removeWhiteSpaceAndSeperators(' 123,45 ')).toEqual(
      '12345'
    )
  })

  it('Should remove white spaces from number strings', () => {
    expect(removeWhiteSpaceAndSeperators(' 432 56 1 9 ')).toEqual(
      '4325619'
    )
  })

  it('Should remove commas from number strings', () => {
    expect(removeWhiteSpaceAndSeperators('4646,8,2')).toEqual(
      '464682'
    )
  })

  it('Should remove periods from number strings', () => {
    expect(removeWhiteSpaceAndSeperators('4321.00.55')).toEqual(
      '43210055'
    )
  })

  it('Should do nothing when string has no white spaces, commas or periods from number strings', () => {
    expect(removeWhiteSpaceAndSeperators('12345678')).toEqual(
      '12345678'
    )
  })

  it('Empty string should return empty string', () => {
    expect(removeWhiteSpaceAndSeperators('')).toEqual(
      ''
    )
  })

  it('Undefined should return empty undefined', () => {
    expect(removeWhiteSpaceAndSeperators(undefined)).toEqual(
      undefined
    )
  })
})
