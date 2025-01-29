import {removeWhiteSpace} from 'src/utils/utils'

describe('utils/utils/removeWhiteSpaceAndCommasAndPeriods', () => {

  it('Should remove white spaces', () => {
    expect(removeWhiteSpace(' String With White Spaces ')).toEqual(
      'StringWithWhiteSpaces'
    )
  })

  it('Should do nothing when string has no white spaces', () => {
    expect(removeWhiteSpace('StringWithoutWhiteSpacesCommasOrPeriods')).toEqual(
      'StringWithoutWhiteSpacesCommasOrPeriods'
    )
  })

  it('Should return empty string when string contains only white spaces', () => {
    expect(removeWhiteSpace('  ')).toEqual(
      ''
    )
  })

  it('Should not remove periods', () => {
    expect(removeWhiteSpace('String.WithPeriods')).toEqual(
      'String.WithPeriods'
    )
  })

  it('Should remove white spaces from number strings', () => {
    expect(removeWhiteSpace(' 432 56 1 9 ')).toEqual(
      '4325619'
    )
  })

  it('Should do nothing when number string has no white spaces', () => {
    expect(removeWhiteSpace('12345678')).toEqual(
      '12345678'
    )
  })

  it('Should not remove periods from number strings', () => {
    expect(removeWhiteSpace('4646.872')).toEqual(
      '4646.872'
    )
  })

  it('Empty string should return empty string', () => {
    expect(removeWhiteSpace('')).toEqual(
      ''
    )
  })
})
